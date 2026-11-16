"""Checkout Complete画面 見た目の比較テスト（TS版 checkout-complete-visual.spec.ts に対応）"""

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
        """TC-VIS-006: Checkout Complete画面の見た目が、基準画像と一致すること。

        画像は見出しの表示時点で読み込みが終わっていない場合があるため、
        撮影前に画像の読み込み完了を待つ（expect_screenshot_matches の中で待つ）。
        """
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態を作る（Backpack をカートに入れ、Step One画面・Step Two画面を経て購入を完了する）
        checkout_flow.open_complete_with([PRODUCTS["backpack"]], CHECKOUT_DATA)

        # 見た目を基準画像と比べて検証する
        expect_screenshot_matches(
            logged_page, "checkout-complete-page.png", max_diff_ratio=0.01
        )
