// モックのリクエスト・レスポンス・ハンドラーの形と、ハンドラーが共通で使う値の判定。
// 両版のモックが同じリクエストに同じ返事をするように、値の扱いはここにまとめる

export class MockRequest {

  readonly method: string;
  readonly path: string;

  // ヘッダー名は小文字にそろえて持つ
  readonly headers: Record<string, string>;

  readonly body: Buffer;

  // パスの {id} などに当てはまった値
  params: Record<string, string> = {};

  constructor(method: string, path: string, headers: Record<string, string>, body: Buffer) {

    this.method = method;
    this.path = path;
    this.headers = headers;
    this.body = body;
  }

  // ヘッダーの値を返す（名前の大文字と小文字は区別しない）
  header(name: string): string | undefined {
    return this.headers[name.toLowerCase()];
  }

  // 本文を JSON として読む。本文が空のときは、値がないとして null を返す。
  // JSON として読めないときは例外になり、サーバーが 500 を返す
  json(): unknown {

    if (this.body.length === 0) {
      return null;
    }

    return JSON.parse(this.body.toString('utf-8'));
  }
}

export type MockResponse = {
  status: number;
  body: unknown;
};

export type Handler = {
  method: string;

  // 例：/api/cart/{id}（{名前} の部分は、リクエストの params に入る）
  path: string;

  resolver: (request: MockRequest) => MockResponse;
};

// 本文が JSON のオブジェクト（配列ではないもの）かどうか
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 値があるとみなすかどうか。null・false・0・空の文字列・空の配列・空のオブジェクトは、値がないとみなす
// （0 も「指定なし」として 400 を返す作りのため。specs/api_spec.md「判断できない挙動」）
export function hasValue(value: unknown): boolean {

  if (value === undefined || value === null || value === false || value === 0 || value === '') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length > 0;
  }

  return true;
}

// 10進の数の書き方（符号、小数点、指数、桁の間の _、inf・infinity・nan を含む）だけを数とみなす。
// 16進などの書き方を数とみなさないことで、両版のモックが同じパスに同じ返事をするようにする
const DECIMAL_PATTERN = /^[+-]?(\d(_?\d)*(\.(\d(_?\d)*)?)?|\.\d(_?\d)*)([eE][+-]?\d(_?\d)*)?$/;
const SPECIAL_PATTERN = /^([+-]?)(inf|infinity|nan)$/i;

// パスの値を数にする。数でなければ null を返す
export function toNumber(value: string): number | null {

  const text = value.trim();

  if (DECIMAL_PATTERN.test(text)) {
    return Number(text.replace(/_/g, ''));
  }

  const special = SPECIAL_PATTERN.exec(text);

  if (special) {

    if (special[2].toLowerCase() === 'nan') {
      return Number.NaN;
    }

    return special[1] === '-' ? -Infinity : Infinity;
  }

  return null;
}
