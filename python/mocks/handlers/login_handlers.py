"""Login Mock Handlers（TS版 mocks/handlers/loginHandlers.ts に対応）"""

from mocks.handler_types import Handler, MockRequest, MockResponse

_VALID_EMAIL = "test@example.com"
_VALID_PASSWORD = "password123"


def create_login_handlers() -> list[Handler]:
    def login(request: MockRequest) -> MockResponse:
        body = request.json()

        # 正しいメールアドレスとパスワードなら、トークンを返す
        if (
            isinstance(body, dict)
            and body.get("email") == _VALID_EMAIL
            and body.get("password") == _VALID_PASSWORD
        ):
            return MockResponse(200, {"token": "mock-token"})

        # それ以外は、400 とエラーを返す
        return MockResponse(400, {"error": "user not found"})

    return [Handler("POST", "/api/login", login)]
