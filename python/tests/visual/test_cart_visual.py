"""Cart画面の見た目を、基準画像と比べるテスト"""

import pytest
from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestCartVisual:
    """Cart画面の見た目を確かめる。"""

    def test_cart_page_matches_snapshot(self, logged_page: Page) -> None:
        """TC-VIS-003: Cart画面の見た目が、基準画像と一致すること。"""
        cart_flow = CartFlow(logged_page)

        cart_flow.open_cart_with([PRODUCTS["backpack"]])

        expect_screenshot_matches(logged_page, "cart-page.png", max_diff_ratio=0.01)
