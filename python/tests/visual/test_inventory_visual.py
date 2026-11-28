"""Products画面の見た目を、基準画像と比べるテスト"""

import pytest
from playwright.sync_api import Page

from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestInventoryVisual:
    """Products画面の見た目を確かめる。"""

    def test_inventory_page_matches_snapshot(self, logged_page: Page) -> None:
        """TC-VIS-002: Products画面の見た目が、基準画像と一致すること。

        ログイン済みの画面は、Products画面を開いて表示を確かめた状態（カートは空）で始まる。
        """
        expect_screenshot_matches(logged_page, "inventory-page.png", max_diff_ratio=0.02)
