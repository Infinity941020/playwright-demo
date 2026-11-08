"""Checkout Step One画面 表示テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_checkout_badge_count,
    expect_checkout_step_one_page_layout,
    expect_no_checkout_error,
)


class TestCheckoutStepOneDisplay:
    """Checkout Step One画面の表示確認"""

    def test_page_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CO1-001: 画面が仕様どおりに表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 検証（業務レベル）
        expect_checkout_step_one_page_layout(checkout_flow)
        expect_checkout_badge_count(checkout_flow, 1)
        expect_no_checkout_error(checkout_flow)
