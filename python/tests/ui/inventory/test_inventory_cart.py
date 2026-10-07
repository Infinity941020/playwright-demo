"""Products画面 カート操作テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import (
    expect_cart_badge_count,
    expect_cart_badge_hidden,
    expect_in_cart,
    expect_not_in_cart,
)


class TestInventoryCart:
    """カートへの追加・削除確認"""

    def test_add_to_cart_changes_button_and_badge(self, logged_page: Page) -> None:
        """TC-PROD-006: Add to cart を押すと、ボタンが Remove に変わり、バッジが1になること。"""
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]["name"]

        # 業務操作（カート追加）
        inventory_flow.add_to_cart(backpack)

        # 検証（業務レベル）
        expect_in_cart(inventory_flow, backpack)
        expect_cart_badge_count(inventory_flow, 1)

    def test_remove_keeps_other_items(self, logged_page: Page) -> None:
        """TC-PROD-007: Remove を押すと、ボタンが戻り、バッジが1減り、他の商品は影響を受けないこと。"""
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]["name"]
        bike_light = PRODUCTS["bike_light"]["name"]

        # 業務操作（2件追加後、1件削除）
        inventory_flow.add_to_cart(backpack)
        inventory_flow.add_to_cart(bike_light)
        inventory_flow.remove_from_cart(backpack)

        # 検証（業務レベル）
        expect_not_in_cart(inventory_flow, backpack)
        expect_in_cart(inventory_flow, bike_light)
        expect_cart_badge_count(inventory_flow, 1)

    def test_badge_hidden_when_cart_empty(self, logged_page: Page) -> None:
        """TC-PROD-008: カートが0件になると、バッジが表示されなくなること。"""
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]["name"]

        # 業務操作（追加後、同じ商品を削除）
        inventory_flow.add_to_cart(backpack)
        inventory_flow.remove_from_cart(backpack)

        # 検証（業務レベル）
        expect_cart_badge_hidden(inventory_flow)
