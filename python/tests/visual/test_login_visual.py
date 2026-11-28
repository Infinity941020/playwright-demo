"""Login画面の見た目を、基準画像と比べるテスト。

ログインした状態を引き継がないように、ログイン済みの画面を用意する部品は使わない。
"""

import pytest
from playwright.sync_api import Page

from flows.login_flow import LoginFlow
from utils.visual_assertions.screenshot_assertions import expect_screenshot_matches

pytestmark = pytest.mark.visual


class TestLoginVisual:
    """Login画面の見た目を確かめる。"""

    def test_login_page_matches_snapshot(self, page: Page) -> None:
        """TC-VIS-001: Login画面の見た目が、基準画像と一致すること。"""
        login_flow = LoginFlow(page)

        login_flow.open_login_page()

        expect_screenshot_matches(page, "login-page.png", max_diff_ratio=0.01)
