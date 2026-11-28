"""Checkout Complete画面を、ログインせずに開いたときのテスト。

ログインした状態を引き継がないように、ログイン済みの画面を用意する部品は使わない。
"""

from playwright.sync_api import Page

from data.messages import MESSAGES
from flows.checkout_flow import CheckoutFlow
from flows.login_flow import LoginFlow
from utils.ui_assertions.login_assertions import expect_login_error_message, expect_on_login_page

_NOT_LOGGED_IN_MESSAGE = MESSAGES["login"]["not_logged_in"].format(path="/checkout-complete.html")


class TestCheckoutCompleteAuth:
    """未ログイン時のアクセスを確かめる。"""

    def test_redirect_to_login_when_not_logged_in(self, page: Page) -> None:
        """TC-CO3-006: 未ログインで直接アクセスすると、Login画面へ戻されること。"""
        checkout_flow = CheckoutFlow(page)
        login_flow = LoginFlow(page)

        checkout_flow.access_complete_directly()

        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _NOT_LOGGED_IN_MESSAGE)
