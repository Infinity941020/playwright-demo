"""各画面からログアウトしたときのテスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from flows.checkout_flow import CheckoutFlow
from flows.login_flow import LoginFlow
from flows.logout_flow import LogoutFlow
from utils.ui_assertions.login_assertions import (
    expect_login_inputs_empty,
    expect_no_login_error,
    expect_on_login_page,
)


def _stay_on_products_page(page: Page) -> None:
    """何もしない（ログイン済みの画面は、Products画面を開いた状態で始まる）。"""


def _open_cart_page(page: Page) -> None:
    CartFlow(page).open_cart_with([])


def _open_complete_page(page: Page) -> None:
    CheckoutFlow(page).open_complete_with([PRODUCTS["backpack"]], CHECKOUT_DATA)


class TestLogoutSuccess:
    """ログアウトを確かめる。"""

    @pytest.mark.parametrize(
        "open_start_page",
        [_stay_on_products_page, _open_cart_page, _open_complete_page],
        ids=["TC-LOGOUT-004", "TC-LOGOUT-005", "TC-LOGOUT-006"],
    )
    def test_logout_to_empty_login_page(
        self, logged_page: Page, open_start_page: Callable[[Page], None]
    ) -> None:
        """TC-LOGOUT-004/005/006: 各画面からログアウトすると、空の Login画面へ遷移すること。"""
        logout_flow = LogoutFlow(logged_page)
        login_flow = LoginFlow(logged_page)

        open_start_page(logged_page)

        logout_flow.logout()

        expect_on_login_page(login_flow)
        expect_login_inputs_empty(login_flow)
        expect_no_login_error(login_flow)
