"""Cart画面 削除テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from utils.ui_assertions.cart_assertions import (
    expect_badge_count,
    expect_cart_item_count,
    expect_cart_item_names_in_order,
    expect_cart_page_layout,
)


class TestCartRemove:
    """カート内の商品の削除を確かめる。"""

    def test_remove_only_selected_item(self, logged_page: Page) -> None:
        """TC-CART-004: Remove を押すと、その商品の行だけが消え、バッジが1減ること。"""
        cart_flow = CartFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]
        onesie = PRODUCTS["onesie"]

        # 前提状態を作る（Backpack → Bike Light → Onesie の順にカートに入れる）
        cart_flow.open_cart_with([backpack, bike_light, onesie])

        # 2行目の商品を削除する
        cart_flow.remove_from_cart(bike_light["name"])

        # 結果を検証する
        expect_cart_item_names_in_order(cart_flow, [backpack["name"], onesie["name"]])
        expect_badge_count(cart_flow, 2)

    def test_remove_last_item(self, logged_page: Page) -> None:
        """TC-CART-005: 最後の1件を Remove すると、商品の行とバッジがなくなること。"""
        cart_flow = CartFlow(logged_page)
        backpack = PRODUCTS["backpack"]

        # 前提状態を作る（カートには Backpack のみを入れる）
        cart_flow.open_cart_with([backpack])

        # 最後の1件を削除する
        cart_flow.remove_from_cart(backpack["name"])

        # 結果を検証する
        expect_cart_item_count(cart_flow, 0)
        expect_badge_count(cart_flow, 0)
        expect_cart_page_layout(cart_flow)
