import { createServer, IncomingMessage, Server, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { type Handler, MockRequest, type MockResponse } from './handlerTypes';
import { mockData } from './mockData';
import { createLoginHandlers } from './handlers/loginHandlers';
import { createUserHandlers } from './handlers/userHandlers';
import { createCartHandlers } from './handlers/cartHandlers';
import { createCheckoutHandlers } from './handlers/checkoutHandlers';
import { createLogoutHandlers } from './handlers/logoutHandlers';

// API のテストが通信する、モックのサーバー。
// - 127.0.0.1 の空いているポートで立てるため、並列に動くテストどうしでポートがぶつからない
// - テストの準備の部品（fixtures/apiFixture.ts）が、このサーバーをテストごとに新しく作る。
//   作るたびにハンドラーも新しい状態で作るため、状態がテストをまたがない
export class MockServer {

  private readonly handlers: Handler[] = [
    ...createLoginHandlers(),
    ...createUserHandlers(),
    ...createCartHandlers(),
    ...createCheckoutHandlers(),
    ...createLogoutHandlers(),
  ];

  private server: Server | undefined;

  // 接続先（例：http://127.0.0.1:50123）。起動した後に使う
  get baseUrl(): string {

    const address = this.server?.address() as AddressInfo | null | undefined;

    if (!address) {
      throw new Error('MockServer is not started');
    }

    const { port } = address;

    return `http://${address.address}:${port}`;
  }

  // ポートに 0 を指定して、空いているポートを割り当ててもらう。
  // 1つのサーバーを2回起動すると、前に立てたサーバーを止められなくなるため、例外にする。
  // 起動を待っているあいだに呼ばれたときも例外にできるよう、作った直後に覚えておき、起動に失敗したら戻す
  async start(): Promise<void> {

    if (this.server) {
      throw new Error('MockServer is already started');
    }

    const server = createServer((request, response) => {

      // リクエストの受け取りや返事の組み立ての失敗を、ここで受け止めてテストの実行を止めないようにする。
      // - 返事をまだ送っていなければ、ハンドラーの中の例外と同じ形で 500 を返す
      // - 返事を送り始めていたり、接続が切れていたりすれば、返事を送れないため、接続を閉じるだけにする
      this.handle(request, response).catch((error: unknown) => {

        if (response.headersSent || response.destroyed || request.destroyed) {
          response.destroy();
          return;
        }

        const payload = JSON.stringify({ error: describeError(error) });

        response.writeHead(500, {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        });
        response.end(payload);
      });
    });

    this.server = server;

    try {

      await new Promise<void>((resolve, reject) => {

        server.once('error', reject);

        server.listen(0, '127.0.0.1', () => {

          // 起動の失敗を受け取るための登録なので、起動した後は外す
          server.off('error', reject);
          resolve();
        });
      });

    } catch (error) {

      this.server = undefined;
      throw error;
    }
  }

  // 接続が残っていると停止が終わらないため、残っている接続も閉じてから停止を待つ
  async stop(): Promise<void> {

    const server = this.server;

    if (!server) {
      return;
    }

    this.server = undefined;
    server.closeAllConnections();

    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }

  private resolve(request: MockRequest): MockResponse {

    for (const handler of this.handlers) {

      const params = matchPath(handler.path, request.path);

      if (handler.method === request.method && params !== null) {

        request.params = params;

        try {
          return handler.resolver(request);
        } catch (error) {

          // ハンドラーの中で起きた例外（JSON として読めない本文など）は、500 を返す
          return { status: 500, body: { error: describeError(error) } };
        }
      }
    }

    return { status: 404, body: { error: mockData.server.noHandlerError } };
  }

  private async handle(incoming: IncomingMessage, outgoing: ServerResponse): Promise<void> {

    const chunks: Buffer[] = [];

    for await (const chunk of incoming) {
      chunks.push(chunk as Buffer);
    }

    const headers: Record<string, string> = {};

    for (const [name, value] of Object.entries(incoming.headers)) {
      if (value !== undefined) {
        headers[name.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value;
      }
    }

    const request = new MockRequest(
      incoming.method ?? '',
      (incoming.url ?? '').split('?', 1)[0],
      headers,
      Buffer.concat(chunks),
    );

    const response = this.resolve(request);
    const payload = JSON.stringify(response.body);

    outgoing.writeHead(response.status, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    });
    outgoing.end(payload);
  }
}

// 500 の返事に入れる文言（〈例外の名前〉: 〈中身〉）
function describeError(error: unknown): string {

  const name = error instanceof Error ? error.name : 'Error';
  const message = error instanceof Error ? error.message : String(error);

  return `${name}: ${message}`;
}

// パスがパターン（例：/api/cart/{id}）に当てはまれば、{名前} の部分の値を返す。当てはまらなければ null を返す
function matchPath(pattern: string, path: string): Record<string, string> | null {

  const patternParts = trimSlashes(pattern).split('/');
  const pathParts = trimSlashes(path).split('/');

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < patternParts.length; index++) {

    const patternPart = patternParts[index];
    const pathPart = pathParts[index];

    if (patternPart.startsWith('{') && patternPart.endsWith('}')) {
      params[patternPart.slice(1, -1)] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}
