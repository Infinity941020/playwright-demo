"""Logout（メニュー） ログアウト後のアクセス制限テスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.inventory_flow import InventoryFlow
from flows.login_flow import LoginFlow
from flows.logout_flow import LogoutFlow
from utils.ui_assertions.login_assertions import expect_login_error_message, expect_on_login_page

_INVENTORY_NOT_LOGGED_IN_MESSAGE = (
    "Epic sadface: You can only access '/inventory.html' when you are logged in."
)
# クエリ「?id=4」は文言に含まれない
_PRODUCT_DETAIL_NOT_LOGGED_IN_MESSAGE = (
    "Epic sadface: You can only access '/inventory-item.html' when you are logged in."
)


def _access_backpack_detail(inventory_flow: InventoryFlow) -> None:
    inventory_flow.access_product_detail_directly(PRODUCTS["backpack"]["id"])


class TestLogoutAccess:
    """ログアウト後のアクセス制限確認"""

    @pytest.mark.parametrize(
        ("access_directly", "error_message"),
        [
            (InventoryFlow.access_inventory_directly, _INVENTORY_NOT_LOGGED_IN_MESSAGE),
            (_access_backpack_detail, _PRODUCT_DETAIL_NOT_LOGGED_IN_MESSAGE),
        ],
        ids=["TC-LOGOUT-007", "TC-LOGOUT-008"],
    )
    def test_direct_access_after_logout(
        self,
        logged_page: Page,
        access_directly: Callable[[InventoryFlow], None],
        error_message: str,
    ) -> None:
        """TC-LOGOUT-007/008: ログアウト後に直接アクセスすると、Login画面へ戻されること。"""
        logout_flow = LogoutFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        login_flow = LoginFlow(logged_page)

        # 業務操作（ログアウトして、URLで直接開く）
        logout_flow.logout()
        access_directly(inventory_flow)

        # 検証（業務レベル）
        expect_login_error_message(login_flow, error_message)
        expect_on_login_page(login_flow)

    def test_browser_back_after_logout(self, logged_page: Page) -> None:
        """TC-LOGOUT-009: ログアウト後にブラウザの「戻る」を押しても、ログイン後の画面に戻れないこと。"""
        logout_flow = LogoutFlow(logged_page)
        login_flow = LoginFlow(logged_page)

        # 業務操作（ログアウトして、ブラウザの「戻る」を押す）
        logout_flow.logout()
        logout_flow.go_back_in_browser()

        # 検証（業務レベル：戻された後のエラーを確かめてから URL を確認する）
        expect_login_error_message(login_flow, _INVENTORY_NOT_LOGGED_IN_MESSAGE)
        expect_on_login_page(login_flow)
