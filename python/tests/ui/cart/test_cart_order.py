"""カート画面の並び順のテスト。

追加の操作そのものを確かめるため、前提の状態はブラウザの保存領域への書き込みではなく、商品一覧画面での操作で作る。
"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.cart_assertions import expect_cart_item_names_in_order
from utils.ui_assertions.inventory_assertions import expect_on_cart_page


class TestCartOrder:
    """並び順を確かめる。"""

    def test_items_listed_in_added_order(self, logged_page: Page) -> None:
        """TC-CART-003: カートに追加した順に表示されること。"""
        inventory_flow = InventoryFlow(logged_page)
        cart_flow = CartFlow(logged_page)
        # 商品名の順（昇順・降順）にも、商品の番号の順（昇順・降順）にもならない並びにして、
        # 追加した順で並んでいることを区別できるようにする（商品の番号では 0→4→2）
        added_order = [
            PRODUCTS["bike_light"]["name"],
            PRODUCTS["backpack"]["name"],
            PRODUCTS["onesie"]["name"],
        ]

        for product_name in added_order:
            inventory_flow.add_to_cart(product_name)
        inventory_flow.open_cart()
        expect_on_cart_page(inventory_flow)

        expect_cart_item_names_in_order(cart_flow, added_order)
