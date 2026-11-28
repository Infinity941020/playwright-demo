"""API のテストが通信する、モックのサーバー。

- 127.0.0.1 の空いているポートで、別のスレッドで動かす
- テストの準備の部品（fixtures/api_fixture.py）が、このサーバーをテストごとに新しく作る。
  作るたびにハンドラーも新しい状態で作るため、状態がテストをまたがない
"""

import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

from mocks.handler_types import Handler, MockRequest, MockResponse
from mocks.handlers.cart_handlers import create_cart_handlers
from mocks.handlers.checkout_handlers import create_checkout_handlers
from mocks.handlers.login_handlers import create_login_handlers
from mocks.handlers.logout_handlers import create_logout_handlers
from mocks.handlers.user_handlers import create_user_handlers
from mocks.mock_data import MOCK_DATA


class MockServer:
    def __init__(self) -> None:
        # 各 API のハンドラー（サーバーを作るたびに、新しい状態で作る）
        self._handlers: list[Handler] = [
            *create_login_handlers(),
            *create_user_handlers(),
            *create_cart_handlers(),
            *create_checkout_handlers(),
            *create_logout_handlers(),
        ]
        self._server: HTTPServer | None = None
        self._thread: threading.Thread | None = None

    @property
    def base_url(self) -> str:
        """接続先（例：http://127.0.0.1:50123）。起動した後に使う。"""
        if self._server is None:
            raise RuntimeError("MockServer is not started")
        host, port = self._server.server_address[:2]
        return f"http://{host}:{port}"

    def start(self) -> None:
        """ポートに 0 を指定して、空いているポートを割り当ててもらって起動する。"""
        # リクエストを1つずつ順に処理するサーバーを使う（状態の読み書きが重ならないようにするため）
        self._server = HTTPServer(("127.0.0.1", 0), self._create_request_handler())
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        if self._server is not None:
            self._server.shutdown()
            self._server.server_close()
        if self._thread is not None:
            self._thread.join()
        self._server = None
        self._thread = None

    def _resolve(self, request: MockRequest) -> MockResponse:
        for handler in self._handlers:
            params = _match_path(handler.path, request.path)
            if handler.method == request.method and params is not None:
                request.params = params
                try:
                    return handler.resolver(request)
                except Exception as error:
                    # ハンドラーの中で起きた例外（JSON として読めない本文など）は、500 を返す
                    return MockResponse(500, {"error": f"{type(error).__name__}: {error}"})
        # 登録されていないメソッド・パスには、404 を返す
        return MockResponse(404, {"error": MOCK_DATA["server"]["no_handler_error"]})

    def _create_request_handler(self) -> type[BaseHTTPRequestHandler]:
        resolve = self._resolve

        class _RequestHandler(BaseHTTPRequestHandler):
            def do_GET(self) -> None:
                self._handle()

            def do_POST(self) -> None:
                self._handle()

            def do_DELETE(self) -> None:
                self._handle()

            def _handle(self) -> None:
                length = int(self.headers.get("Content-Length") or 0)
                request = MockRequest(
                    method=self.command,
                    path=self.path.split("?", 1)[0],
                    headers={name.lower(): value for name, value in self.headers.items()},
                    body=self.rfile.read(length) if length > 0 else b"",
                )
                response = resolve(request)
                payload = json.dumps(response.body).encode("utf-8")
                self.send_response(response.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)

            def log_message(self, format: str, *args: object) -> None:
                # テストの出力にアクセスログを出さない
                pass

        return _RequestHandler


def _match_path(pattern: str, path: str) -> dict[str, str] | None:
    """パスがパターン（例：/api/cart/{id}）に当てはまれば、{名前} の部分の値を返す。当てはまらなければ None を返す。"""
    pattern_parts = pattern.strip("/").split("/")
    path_parts = path.strip("/").split("/")
    if len(pattern_parts) != len(path_parts):
        return None
    params: dict[str, str] = {}
    for pattern_part, path_part in zip(pattern_parts, path_parts):
        if pattern_part.startswith("{") and pattern_part.endswith("}"):
            params[pattern_part[1:-1]] = path_part
        elif pattern_part != path_part:
            return None
    return params
