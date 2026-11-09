"""Logout（メニュー） メニューの表示・開閉テスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from flows.logout_flow import LogoutFlow
from utils.ui_assertions.logout_assertions import expect_menu_closed, expect_menu_items

_MENU_ITEMS = ["All Items", "Dynamic Catalog", "About", "Logout", "Reset App State"]


class TestLogoutMenu:
    """メニューの表示・開閉確認"""

    def test_menu_items_displayed_in_order(self, logged_page: Page) -> None:
        """TC-LOGOUT-001: メニューを開くと、5つの項目が仕様どおりの並び順で表示されること。"""
        logout_flow = LogoutFlow(logged_page)

        # 業務操作（メニューを開く。logged_page は Products画面を開いた状態で始まる）
        logout_flow.open_menu()

        # 検証（業務レベル）
        expect_menu_items(logout_flow, _MENU_ITEMS)

    @pytest.mark.parametrize(
        "close_menu",
        [LogoutFlow.close_menu_with_button, LogoutFlow.close_menu_with_escape],
        ids=["TC-LOGOUT-002", "TC-LOGOUT-003"],
    )
    def test_menu_closed(
        self, logged_page: Page, close_menu: Callable[[LogoutFlow], None]
    ) -> None:
        """TC-LOGOUT-002/003: ×ボタン・Esc キーを押すと、メニューが閉じること。"""
        logout_flow = LogoutFlow(logged_page)

        # 業務操作（メニューを開いて閉じる）
        logout_flow.open_menu()
        close_menu(logout_flow)

        # 検証（業務レベル）
        expect_menu_closed(logout_flow)
