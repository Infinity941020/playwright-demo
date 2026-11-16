"""Login画面 見た目の比較テスト（TS版 login-visual.spec.ts に対応）"""

import pytest
from playwright.sync_api import Page

from flows.login_flow import LoginFlow
from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestLoginVisual:
    """Login画面の見た目を確かめる。"""

    def test_login_page_matches_snapshot(self, page: Page) -> None:
        """TC-VIS-001: Login画面の見た目が、基準画像と一致すること。

        ログイン状態を引き継がないよう、logged_pageではなく通常のpageを使用する。
        """
        login_flow = LoginFlow(page)

        # 前提状態を作る（Login画面を開き、表示を確かめる）
        login_flow.open_login_page()

        # 見た目を基準画像と比べて検証する
        expect_screenshot_matches(page, "login-page.png", max_diff_ratio=0.01)
