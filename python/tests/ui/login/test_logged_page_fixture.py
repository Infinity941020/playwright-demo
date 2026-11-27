"""logged_page fixture（保存したログイン状態の再利用）の動作を確かめるテスト

保存したログイン状態（storage_state）の再利用が実際に機能していることを検証する。
ログイン済みの状態から始める各画面のテストは、この fixture を使っている。
"""

from playwright.sync_api import Page

from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import expect_on_inventory_page


class TestLoggedPageFixture:
    """logged_page fixture の動作を確かめる。"""

    def test_logged_page_starts_on_inventory_page(self, logged_page: Page) -> None:
        """テストケース外（fixture の動作確認用）: ログインの操作をしなくても、商品一覧画面が開いていること。"""
        inventory_flow = InventoryFlow(logged_page)

        # 結果を検証する
        expect_on_inventory_page(inventory_flow)
