"""Checkout Step Two画面 見た目の比較テスト（TS版 checkout-step-two-visual.spec.ts に対応）"""

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestCheckoutStepTwoVisual:
    """Checkout Step Two画面の見た目の確認"""

    def test_checkout_step_two_page_matches_snapshot(self, logged_page: Page) -> None:
        """TC-VIS-005: Checkout Step Two画面の見た目が、基準画像と一致すること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack をカートに入れ、Step One で購入者情報を入力して Step Two を開く）
        checkout_flow.open_step_two_with([PRODUCTS["backpack"]], CHECKOUT_DATA)

        # 検証（見た目）
        expect_screenshot_matches(
            logged_page, "checkout-step-two-page.png", max_diff_ratio=0.01
        )
