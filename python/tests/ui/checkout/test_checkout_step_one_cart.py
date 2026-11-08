"""Checkout Step One画面 カートとの関係テスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_cart_item_count,
    expect_checkout_badge_count,
    expect_in_cart,
)


class TestCheckoutStepOneCart:
    """カートとの関係確認"""

    def test_cart_unchanged_after_cancel(self, logged_page: Page) -> None:
        """TC-CO1-012: Cancel で Cart画面へ戻っても、カートの内容とバッジが変わらないこと。"""
        checkout_flow = CheckoutFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態（Backpack → Bike Light の順）
        checkout_flow.open_step_one_with([backpack, bike_light])

        # 業務操作（3項目を入力して Cancel）
        checkout_flow.fill_checkout_info(
            CHECKOUT_DATA["first_name"], CHECKOUT_DATA["last_name"], CHECKOUT_DATA["postal_code"]
        )
        checkout_flow.cancel_from_step_one()

        # 検証（業務レベル：並び順は TC-CART-003 で確認するため問わない）
        expect_cart_item_count(checkout_flow, 2)
        expect_in_cart(checkout_flow, backpack["name"])
        expect_in_cart(checkout_flow, bike_light["name"])
        expect_checkout_badge_count(checkout_flow, 2)
