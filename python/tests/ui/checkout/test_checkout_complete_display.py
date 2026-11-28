"""Checkout Complete画面の表示のテスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_badge_count,
    expect_checkout_complete_page_layout,
)


class TestCheckoutCompleteDisplay:
    """Checkout Complete画面の表示を確かめる。"""

    def test_page_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CO3-001: 購入直後に、画面が仕様どおりに表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        checkout_flow.open_complete_with(
            [PRODUCTS["backpack"], PRODUCTS["bike_light"]], CHECKOUT_DATA
        )

        expect_checkout_complete_page_layout(checkout_flow)
        expect_badge_count(checkout_flow, 0)
