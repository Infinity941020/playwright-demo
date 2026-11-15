"""logged_page fixture（storage_state再利用）の動作確認

論点1（storageState未配線）の決定に基づき、storage_stateの再利用が
実際に機能していることを検証する。ログイン済みの状態を前提とする
各画面のテストは、この fixture を使用している。
"""

from playwright.sync_api import Page

from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import expect_on_inventory_page


class TestLoggedPageFixture:
    """logged_page fixture の動作確認"""

    def test_logged_page_starts_on_inventory_page(self, logged_page: Page) -> None:
        """TC対象外（logged_page fixture の動作確認用）: 事前ログイン操作なしで商品一覧ページに到達していること。"""
        inventory_flow = InventoryFlow(logged_page)

        # 検証（業務レベル）
        expect_on_inventory_page(inventory_flow)
