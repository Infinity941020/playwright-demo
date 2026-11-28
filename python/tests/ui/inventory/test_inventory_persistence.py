"""Products画面を再読み込みした後も、状態が保たれることのテスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS, SORT_OPTIONS
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import (
    expect_badge_count,
    expect_product_names_in_order,
    expect_remove_button_shown,
    expect_selected_sort,
)


class TestInventoryPersistence:
    """再読み込みした後も、状態が保持されることを確かめる。"""

    def test_cart_kept_after_reload(self, logged_page: Page) -> None:
        """TC-PROD-012: 再読み込み後も、カートの内容が保持されること。"""
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]["name"]

        inventory_flow.add_to_cart(backpack)
        inventory_flow.reload_inventory()

        expect_remove_button_shown(inventory_flow, backpack)
        expect_badge_count(inventory_flow, 1)

    def test_sort_reset_after_reload(self, logged_page: Page) -> None:
        """TC-PROD-013: 再読み込み後、ソートが Name (A to Z) に戻ること。"""
        inventory_flow = InventoryFlow(logged_page)

        inventory_flow.sort_by(SORT_OPTIONS["price_desc"])
        expect_selected_sort(inventory_flow, SORT_OPTIONS["price_desc"])
        inventory_flow.reload_inventory()

        expect_selected_sort(inventory_flow, SORT_OPTIONS["name_asc"])
        expect_product_names_in_order(
            inventory_flow, [product["name"] for product in PRODUCTS.values()]
        )
