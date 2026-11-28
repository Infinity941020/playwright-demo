"""Products画面の表示のテスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import expect_products_displayed


class TestInventoryDisplay:
    """商品一覧の表示を確かめる。"""

    def test_products_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-PROD-001: 商品一覧が仕様どおりに表示されること。"""
        inventory_flow = InventoryFlow(logged_page)

        expect_products_displayed(inventory_flow, list(PRODUCTS.values()))
