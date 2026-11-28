"""ユーザーの情報を返す API。

登録しているユーザーは1人だけで、それ以外の id は存在しないユーザーとして 404 を返す。
"""

from mocks.handler_types import Handler, MockRequest, MockResponse, to_number
from mocks.mock_data import MOCK_DATA

_EXISTING_USER = MOCK_DATA["user"]["existing_user"]


def create_user_handlers() -> list[Handler]:
    def get_user(request: MockRequest) -> MockResponse:
        if to_number(request.params["id"]) == _EXISTING_USER["id"]:
            return MockResponse(200, {"data": dict(_EXISTING_USER)})

        return MockResponse(404, {})

    return [Handler("GET", "/api/users/{id}", get_user)]
