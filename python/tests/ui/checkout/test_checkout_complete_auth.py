"""Checkout Complete画面 認証テスト"""

from playwright.sync_api import Page

from flows.checkout_flow import CheckoutFlow
from flows.login_flow import LoginFlow
from utils.ui_assertions.login_assertions import expect_login_error_message, expect_on_login_page

_NOT_LOGGED_IN_MESSAGE = (
    "Epic sadface: You can only access '/checkout-complete.html' when you are logged in."
)


class TestCheckoutCompleteAuth:
    """未ログイン時のアクセス確認"""

    def test_redirect_to_login_when_not_logged_in(self, page: Page) -> None:
        """TC-CO3-006: 未ログインで直接アクセスすると、Login画面へ戻されること。

        ログイン状態を引き継がないよう、logged_pageではなく通常のpageを使用する。
        """
        checkout_flow = CheckoutFlow(page)
        login_flow = LoginFlow(page)

        # 業務操作（未ログインで直接アクセス）
        checkout_flow.access_complete_directly()

        # 検証（業務レベル）
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _NOT_LOGGED_IN_MESSAGE)
