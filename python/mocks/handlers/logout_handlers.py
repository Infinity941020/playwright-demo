"""Logout Mock Handlers（TS版 mocks/handlers/logoutHandlers.ts に対応）"""

import json

from mocks.handler_types import Handler, MockRequest, MockResponse


def create_logout_handlers() -> list[Handler]:
    def logout(request: MockRequest) -> MockResponse:
        # Authorization ヘッダーがなければ、401 を返す
        if not request.header("Authorization"):
            return MockResponse(401, {"error": "unauthorized"})

        # 本文が空でなければ、400 を返す（TS版と同じく、読めない本文は「本文なし」とみなす）
        try:
            body = request.json()
        except json.JSONDecodeError:
            body = None

        if isinstance(body, (dict, list, str)) and len(body) > 0:
            return MockResponse(400, {"error": "invalid request"})

        return MockResponse(200, {"success": True})

    return [Handler("POST", "/api/logout", logout)]
