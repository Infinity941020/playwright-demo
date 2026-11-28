"""Checkout Step One画面の表示のテスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_badge_count,
    expect_checkout_step_one_page_layout,
    expect_no_checkout_error,
)


class TestCheckoutStepOneDisplay:
    """Checkout Step One画面の表示を確かめる。"""

    def test_page_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CO1-001: 画面が仕様どおりに表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        expect_checkout_step_one_page_layout(checkout_flow)
        expect_badge_count(checkout_flow, 1)
        expect_no_checkout_error(checkout_flow)
