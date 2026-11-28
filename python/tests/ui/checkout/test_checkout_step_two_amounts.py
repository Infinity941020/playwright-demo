"""Checkout Step Two画面の小計・税・合計のテスト。

期待する金額は、計算で作らず、テストケースと同じ値を書く（テストの計算が画面と同じ誤りをしても気づけるように）。
"""

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import expect_step_two_amounts


class TestCheckoutStepTwoAmounts:
    """小計・税・合計を確かめる。"""

    @pytest.mark.parametrize(
        ("products", "item_total", "tax", "total"),
        [
            ([PRODUCTS["onesie"]], "Item total: $7.99", "Tax: $0.64", "Total: $8.63"),
            (
                [PRODUCTS["backpack"], PRODUCTS["bike_light"]],
                "Item total: $39.98",
                "Tax: $3.20",
                "Total: $43.18",
            ),
            (list(PRODUCTS.values()), "Item total: $129.94", "Tax: $10.40", "Total: $140.34"),
        ],
        ids=["TC-CO2-004", "TC-CO2-005", "TC-CO2-006"],
    )
    def test_amounts_displayed(
        self, logged_page: Page, products: list[dict], item_total: str, tax: str, total: str
    ) -> None:
        """TC-CO2-004/005/006: 小計・税・合計が、実機で確認した値どおりに表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        checkout_flow.open_step_two_with(products, CHECKOUT_DATA)

        expect_step_two_amounts(checkout_flow, item_total, tax, total)
