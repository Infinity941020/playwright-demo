"""ログアウトの API。トークンがあり、本文が空のときだけ成功する（JSON として読めない本文も、本文なしとみなす）。"""

import json

from mocks.handler_types import Handler, MockRequest, MockResponse
from mocks.mock_data import MOCK_DATA

_LOGOUT = MOCK_DATA["logout"]


def create_logout_handlers() -> list[Handler]:
    def logout(request: MockRequest) -> MockResponse:
        if not request.header("Authorization"):
            return MockResponse(401, {"error": _LOGOUT["unauthorized_error"]})

        # JSON として読めない本文は、本文なしとみなす
        try:
            body = request.json()
        except json.JSONDecodeError:
            body = None

        if isinstance(body, (dict, list, str)) and len(body) > 0:
            return MockResponse(400, {"error": _LOGOUT["invalid_request_error"]})

        return MockResponse(200, {"success": True})

    return [Handler("POST", "/api/logout", logout)]
