"""Checkout Complete画面 表示テスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_checkout_badge_count,
    expect_checkout_complete_page_layout,
)


class TestCheckoutCompleteDisplay:
    """Checkout Complete画面の表示確認"""

    def test_page_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CO3-001: 購入直後に、画面が仕様どおりに表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack → Bike Light の順でカートに入れて購入を完了）
        checkout_flow.open_complete_with(
            [PRODUCTS["backpack"], PRODUCTS["bike_light"]], CHECKOUT_DATA
        )

        # 検証（業務レベル）
        expect_checkout_complete_page_layout(checkout_flow)
        expect_checkout_badge_count(checkout_flow, 0)
