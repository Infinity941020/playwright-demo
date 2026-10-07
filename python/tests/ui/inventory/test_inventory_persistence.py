"""Products画面 状態保持テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS, SORT_OPTIONS
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import (
    expect_cart_badge_count,
    expect_in_cart,
    expect_product_names_in_order,
    expect_selected_sort,
)


class TestInventoryPersistence:
    """再読み込み後の状態保持確認"""

    def test_cart_kept_after_reload(self, logged_page: Page) -> None:
        """TC-PROD-012: 再読み込み後も、カートの内容が保持されること。"""
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]["name"]

        # 業務操作（カート追加後に再読み込み）
        inventory_flow.add_to_cart(backpack)
        inventory_flow.reload_inventory()

        # 検証（業務レベル）
        expect_in_cart(inventory_flow, backpack)
        expect_cart_badge_count(inventory_flow, 1)

    def test_sort_reset_after_reload(self, logged_page: Page) -> None:
        """TC-PROD-013: 再読み込み後、ソートが Name (A to Z) に戻ること。"""
        inventory_flow = InventoryFlow(logged_page)

        # 業務操作（ソート変更後に再読み込み）
        inventory_flow.sort_by(SORT_OPTIONS["price_desc"])
        inventory_flow.reload_inventory()

        # 検証（業務レベル）
        expect_selected_sort(inventory_flow, SORT_OPTIONS["name_asc"])
        expect_product_names_in_order(
            inventory_flow, [product["name"] for product in PRODUCTS.values()]
        )
