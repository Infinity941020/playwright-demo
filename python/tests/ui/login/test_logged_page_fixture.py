"""ログイン済みの画面を用意する部品が、正しく動くことを確かめるテスト（テストケースの件数には含めない）。

ログイン済みの状態から始める各画面のテストは、この部品を使っている。
"""

from playwright.sync_api import Page

from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import expect_on_inventory_page


class TestLoggedPageFixture:
    """ログイン済みの画面を用意する部品の動作を確かめる。"""

    def test_logged_page_starts_on_inventory_page(self, logged_page: Page) -> None:
        """テストケースの件数に含めない: ログインの操作をしなくても、商品一覧画面が開いていること。"""
        inventory_flow = InventoryFlow(logged_page)

        expect_on_inventory_page(inventory_flow)
