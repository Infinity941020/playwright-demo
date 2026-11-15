"""Logout APIテスト"""

from playwright.sync_api import APIRequestContext

from utils.api_assertions.logout_assertions import (
    expect_logout_bad_request,
    expect_logout_success,
    expect_logout_unauthorized,
)
from utils.api_helper import execute_logout_api

# Authorization ヘッダーの値（TS版と同じ。モックはヘッダーの有無だけを見る）
_TOKEN = "Bearer mock-token"


class TestLogoutApi:
    """Logout API の確認"""

    def test_logout_success(self, api_request_context: APIRequestContext) -> None:
        """TC-API-LOGOUT-001: トークンがあり本文が空なら、ログアウトできること。"""
        # 操作（本文なし）
        response = execute_logout_api(api_request_context, token=_TOKEN)

        # 検証
        expect_logout_success(response)

    def test_logout_without_token(self, api_request_context: APIRequestContext) -> None:
        """TC-API-LOGOUT-002: トークンがないと、401 とエラーが返ること。"""
        # 操作（ヘッダーなし、本文なし）
        response = execute_logout_api(api_request_context)

        # 検証
        expect_logout_unauthorized(response, "unauthorized")

    def test_logout_with_body(self, api_request_context: APIRequestContext) -> None:
        """TC-API-LOGOUT-003: 本文が空でないと、400 とエラーが返ること。"""
        # 操作
        response = execute_logout_api(
            api_request_context, body={"invalid": "data"}, token=_TOKEN
        )

        # 検証
        expect_logout_bad_request(response, "invalid request")
