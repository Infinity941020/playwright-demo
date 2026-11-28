"""Checkout Complete画面の見た目を、基準画像と比べるテスト"""

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestCheckoutCompleteVisual:
    """Checkout Complete画面の見た目を確かめる。"""

    def test_checkout_complete_page_matches_snapshot(self, logged_page: Page) -> None:
        """TC-VIS-006: Checkout Complete画面の見た目が、基準画像と一致すること。"""
        checkout_flow = CheckoutFlow(logged_page)

        checkout_flow.open_complete_with([PRODUCTS["backpack"]], CHECKOUT_DATA)

        expect_screenshot_matches(
            logged_page, "checkout-complete-page.png", max_diff_ratio=0.01
        )
