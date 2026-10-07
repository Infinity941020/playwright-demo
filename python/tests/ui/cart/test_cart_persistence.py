"""Cart画面 状態保持テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from utils.ui_assertions.cart_assertions import (
    expect_cart_badge_count,
    expect_cart_item_count,
    expect_in_cart,
)


class TestCartPersistence:
    """再読み込み後の状態保持確認"""

    def test_cart_kept_after_reload(self, logged_page: Page) -> None:
        """TC-CART-010: 再読み込み後も、カートの内容が保持されること。"""
        cart_flow = CartFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態（Backpack → Bike Light の順）
        cart_flow.open_cart_with([backpack, bike_light])

        # 業務操作（再読み込み）
        cart_flow.reload_cart()

        # 検証（業務レベル：並び順は TC-CART-003 で確認するため問わない）
        expect_cart_item_count(cart_flow, 2)
        expect_in_cart(cart_flow, backpack["name"])
        expect_in_cart(cart_flow, bike_light["name"])
        expect_cart_badge_count(cart_flow, 2)
