"""Products画面 表示テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import expect_products_displayed


class TestInventoryDisplay:
    """商品一覧の表示確認"""

    def test_products_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-PROD-001: 商品一覧が仕様どおりに表示されること。"""
        inventory_flow = InventoryFlow(logged_page)

        # 検証（業務レベル）
        expect_products_displayed(inventory_flow, list(PRODUCTS.values()))
