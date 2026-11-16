"""Cart画面 状態保持テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from utils.ui_assertions.cart_assertions import (
    expect_badge_count,
    expect_cart_item_count,
    expect_in_cart,
)


class TestCartPersistence:
    """再読み込みした後も、状態が保持されることを確かめる。"""

    def test_cart_kept_after_reload(self, logged_page: Page) -> None:
        """TC-CART-010: 再読み込み後も、カートの内容が保持されること。"""
        cart_flow = CartFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れる）
        cart_flow.open_cart_with([backpack, bike_light])

        # 画面を再読み込みする
        cart_flow.reload_cart()

        # 結果を検証する（並び順は TC-CART-003 で確かめるため、ここでは問わない）
        expect_cart_item_count(cart_flow, 2)
        expect_in_cart(cart_flow, backpack["name"])
        expect_in_cart(cart_flow, bike_light["name"])
        expect_badge_count(cart_flow, 2)
