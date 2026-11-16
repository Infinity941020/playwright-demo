"""Checkout Step One画面 見た目の比較テスト（TS版 checkout-step-one-visual.spec.ts に対応）"""

import pytest
from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestCheckoutStepOneVisual:
    """Checkout Step One画面の見た目の確認"""

    def test_checkout_step_one_page_matches_snapshot(self, logged_page: Page) -> None:
        """TC-VIS-004: Checkout Step One画面の見た目が、基準画像と一致すること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack をカートに入れて Step One を開く。入力欄は空のまま）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 検証（見た目）
        expect_screenshot_matches(
            logged_page, "checkout-step-one-page.png", max_diff_ratio=0.01
        )
