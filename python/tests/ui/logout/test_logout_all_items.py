"""Logout（メニュー） All Items テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from flows.inventory_flow import InventoryFlow
from flows.logout_flow import LogoutFlow
from utils.ui_assertions.inventory_assertions import expect_badge_count, expect_remove_button_shown
from utils.ui_assertions.logout_assertions import expect_menu_closed, expect_on_inventory_page


class TestLogoutAllItems:
    """All Items の動作を確かめる。"""

    def test_all_items_from_cart(self, logged_page: Page) -> None:
        """TC-LOGOUT-010: Cart画面で All Items を押すと、Products画面へ遷移し、カートが変わらないこと。"""
        logout_flow = LogoutFlow(logged_page)
        cart_flow = CartFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れる）
        cart_flow.open_cart_with([backpack, bike_light])

        # メニューを開いて All Items を押す
        logout_flow.open_all_items()

        # 結果を検証する
        expect_on_inventory_page(logout_flow)
        expect_menu_closed(logout_flow)
        expect_badge_count(inventory_flow, 2)
        expect_remove_button_shown(inventory_flow, backpack["name"])
        expect_remove_button_shown(inventory_flow, bike_light["name"])
