"""Cart画面 Products画面との連動テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import (
    expect_add_to_cart_button_shown,
    expect_remove_button_shown,
)


class TestCartSync:
    """Products画面との連動を確かめる。"""

    def test_remove_reflected_on_products_page(self, logged_page: Page) -> None:
        """TC-CART-009: Cart画面での削除が、Products画面の表示に反映されること。"""
        cart_flow = CartFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れる）
        cart_flow.open_cart_with([backpack, bike_light])

        # Backpack を削除し、Products画面へ戻る
        cart_flow.remove_from_cart(backpack["name"])
        cart_flow.continue_shopping()

        # Products画面のボタンの表示を検証する
        expect_add_to_cart_button_shown(inventory_flow, backpack["name"])
        expect_remove_button_shown(inventory_flow, bike_light["name"])
