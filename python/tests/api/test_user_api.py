"""User APIテスト"""

from playwright.sync_api import APIRequestContext

from utils.api_assertions.user_assertions import expect_single_user_response, expect_user_not_found
from utils.api_helper import execute_get_user_api

# api_spec.md「User API」の表のとおり
_EXPECTED_USER = {
    "id": 2,
    "email": "janet.weaver@reqres.in",
    "first_name": "Janet",
    "last_name": "Weaver",
    "avatar": "https://reqres.in/img/faces/2-image.jpg",
}


class TestUserApi:
    """User API の確認"""

    def test_get_existing_user(self, api_request_context: APIRequestContext) -> None:
        """TC-API-USER-001: 存在するユーザーの情報が返ること。"""
        # 操作
        response = execute_get_user_api(api_request_context, 2)

        # 検証
        expect_single_user_response(response, _EXPECTED_USER)

    def test_get_missing_user(self, api_request_context: APIRequestContext) -> None:
        """TC-API-USER-002: 存在しないユーザーで 404 が返ること。"""
        # 操作
        response = execute_get_user_api(api_request_context, 9999)

        # 検証
        expect_user_not_found(response)
