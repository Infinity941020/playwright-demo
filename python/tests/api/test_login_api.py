"""Login APIテスト"""

from playwright.sync_api import APIRequestContext

from data.api.api_users import API_USERS
from utils.api_assertions.login_assertions import expect_login_bad_request, expect_login_success
from utils.api_helper import execute_login_api


class TestLoginApi:
    """Login API の確認"""

    def test_login_success(self, api_request_context: APIRequestContext) -> None:
        """TC-API-LOGIN-001: 正しい認証情報でログインすると、トークンが返ること。"""
        # 操作
        response = execute_login_api(api_request_context, API_USERS["valid_user"])

        # 検証
        expect_login_success(response, "mock-token")

    def test_login_failure(self, api_request_context: APIRequestContext) -> None:
        """TC-API-LOGIN-002: 誤った認証情報でログインすると、400 とエラーが返ること。"""
        # 操作
        response = execute_login_api(api_request_context, API_USERS["invalid_user"])

        # 検証
        expect_login_bad_request(response, "user not found")
