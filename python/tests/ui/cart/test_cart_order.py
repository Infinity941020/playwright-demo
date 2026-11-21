"""Cart画面 並び順テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.cart_assertions import expect_cart_item_names_in_order
from utils.ui_assertions.inventory_assertions import expect_on_cart_page


class TestCartOrder:
    """並び順を確かめる。"""

    def test_items_listed_in_added_order(self, logged_page: Page) -> None:
        """TC-CART-003: カートに追加した順に表示されること。

        追加操作そのものを確認するため、前提状態はブラウザの保存領域への書き込みではなく
        Products画面での画面操作で作り、カートアイコンからカート画面を開く。
        """
        inventory_flow = InventoryFlow(logged_page)
        cart_flow = CartFlow(logged_page)
        # 商品名の順にも商品IDの順にもならない並びにする（商品IDでは 0→4→2）
        added_order = [
            PRODUCTS["bike_light"]["name"],
            PRODUCTS["backpack"]["name"],
            PRODUCTS["onesie"]["name"],
        ]

        # Products画面で商品を追加し、カートアイコンからカート画面を開く
        for product_name in added_order:
            inventory_flow.add_to_cart(product_name)
        inventory_flow.open_cart()
        expect_on_cart_page(inventory_flow)

        # 結果を検証する
        expect_cart_item_names_in_order(cart_flow, added_order)
