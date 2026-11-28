"""カート画面を再読み込みした後も、カートの内容が保たれることのテスト。

画面で追加した内容が保存されない不具合も見つけられるように、前提の状態はブラウザの保存領域への書き込みではなく、
商品一覧画面での操作で作る。
"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import expect_on_cart_page
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
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        inventory_flow.add_to_cart(backpack["name"])
        inventory_flow.add_to_cart(bike_light["name"])
        inventory_flow.open_cart()
        expect_on_cart_page(inventory_flow)
        expect_cart_item_count(cart_flow, 2)

        cart_flow.reload_cart()

        # 並び順は TC-CART-003 で確かめるため、ここでは問わない
        expect_cart_item_count(cart_flow, 2)
        expect_in_cart(cart_flow, backpack["name"])
        expect_in_cart(cart_flow, bike_light["name"])
        expect_badge_count(cart_flow, 2)
