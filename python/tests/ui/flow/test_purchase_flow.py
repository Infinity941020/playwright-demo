"""通しの購入のテスト

画面ごとのテストは前提の状態をブラウザの保存領域への書き込みや URL での直接表示で作り、
画面と画面のつなぎ目の不具合を見つけられないため、ログイン済みの画面を用意した後は、すべて画面の操作でつなぐ。
"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from flows.checkout_flow import CheckoutFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.cart_assertions import (
    expect_cart_item_names_in_order,
    expect_on_checkout_step_one_page,
)
from utils.ui_assertions.checkout_assertions import (
    expect_badge_count,
    expect_on_checkout_complete_page,
    expect_on_checkout_step_two_page,
    expect_step_two_amounts,
    expect_step_two_item_names_in_order,
)
from utils.ui_assertions.inventory_assertions import expect_on_cart_page


class TestPurchaseFlow:
    """商品の追加から購入完了までを、1本で通して確かめる。"""

    def test_purchase_completed_through_screens(self, logged_page: Page) -> None:
        """TC-FLOW-001: 商品の追加から購入完了まで、画面の操作だけで通して購入できること。"""
        inventory_flow = InventoryFlow(logged_page)
        cart_flow = CartFlow(logged_page)
        checkout_flow = CheckoutFlow(logged_page)

        # 商品名・商品の番号・価格のどの昇順・降順にもならない並びにして、
        # 追加した順のまま引き継がれていることを区別できるようにする（商品の番号では 0→4→2）
        added_order = [
            PRODUCTS["bike_light"]["name"],
            PRODUCTS["backpack"]["name"],
            PRODUCTS["onesie"]["name"],
        ]

        for product_name in added_order:
            inventory_flow.add_to_cart(product_name)
        expect_badge_count(checkout_flow, 3)

        # 失敗したときに、画面が移らなかったのか、移った先の中身が違うのかを区別できるように、
        # 画面が移るたびに、中身より先に、移った先の画面であることを確かめる
        inventory_flow.open_cart()
        expect_on_cart_page(inventory_flow)
        expect_cart_item_names_in_order(cart_flow, added_order)

        cart_flow.checkout()
        expect_on_checkout_step_one_page(cart_flow)

        checkout_flow.fill_checkout_info(
            CHECKOUT_DATA["first_name"], CHECKOUT_DATA["last_name"], CHECKOUT_DATA["postal_code"]
        )
        checkout_flow.proceed_to_overview_step()
        expect_on_checkout_step_two_page(checkout_flow)
        expect_step_two_item_names_in_order(checkout_flow, added_order)

        # 期待する金額は、確かめる側の計算と同じ誤りを持たないように、計算で作らず、
        # 画面で確かめた値（テストケースと同じ値）を書く
        expect_step_two_amounts(checkout_flow, "Item total: $47.97", "Tax: $3.84", "Total: $51.81")

        checkout_flow.complete_purchase()

        # バッジがないことは、Finish の後に Checkout Complete画面以外のバッジのない画面へ移っても成り立つため、
        # 先に Checkout Complete画面であることを確かめる
        expect_on_checkout_complete_page(checkout_flow)
        expect_badge_count(checkout_flow, 0)
