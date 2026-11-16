"""Products画面 見た目の比較テスト（TS版 inventory-visual.spec.ts に対応）"""

import pytest
from playwright.sync_api import Page

from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestInventoryVisual:
    """Products画面の見た目を確かめる。"""

    def test_inventory_page_matches_snapshot(self, logged_page: Page) -> None:
        """TC-VIS-002: Products画面の見た目が、基準画像と一致すること。

        logged_page は Products画面を開いて表示を確認した状態で始まる（カートは空）。
        """
        # 見た目を基準画像と比べて検証する
        expect_screenshot_matches(logged_page, "inventory-page.png", max_diff_ratio=0.02)
