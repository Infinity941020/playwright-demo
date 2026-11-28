"""ログインの API。正しいメールアドレスとパスワードのときだけトークンを返す。"""

from mocks.handler_types import Handler, MockRequest, MockResponse
from mocks.mock_data import MOCK_DATA

_LOGIN = MOCK_DATA["login"]


def create_login_handlers() -> list[Handler]:
    def login(request: MockRequest) -> MockResponse:
        body = request.json()

        if (
            isinstance(body, dict)
            and body.get("email") == _LOGIN["valid_email"]
            and body.get("password") == _LOGIN["valid_password"]
        ):
            return MockResponse(200, {"token": _LOGIN["token"]})

        return MockResponse(400, {"error": _LOGIN["user_not_found_error"]})

    return [Handler("POST", "/api/login", login)]
