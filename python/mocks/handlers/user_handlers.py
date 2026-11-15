"""User Mock Handlers（TS版 mocks/handlers/userHandlers.ts に対応）"""

from mocks.handler_types import Handler, MockRequest, MockResponse, to_number


def create_user_handlers() -> list[Handler]:
    def get_user(request: MockRequest) -> MockResponse:
        # 正常系：ユーザー取得成功
        if to_number(request.params["id"]) == 2:
            return MockResponse(
                200,
                {
                    "data": {
                        "id": 2,
                        "email": "janet.weaver@reqres.in",
                        "first_name": "Janet",
                        "last_name": "Weaver",
                        "avatar": "https://reqres.in/img/faces/2-image.jpg",
                    }
                },
            )

        # 異常系：存在しないユーザー
        return MockResponse(404, {})

    return [Handler("GET", "/api/users/{id}", get_user)]
