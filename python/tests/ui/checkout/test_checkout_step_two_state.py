"""Checkout Step Two画面 状態テスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.checkout_assertions import (
    expect_checkout_badge_count,
    expect_step_two_amounts,
    expect_step_two_item_count,
    expect_step_two_item_listed,
)
from utils.ui_assertions.inventory_assertions import expect_in_cart, expect_not_in_cart


class TestCheckoutStepTwoState:
    """Finish・Cancel・再読み込み後の状態確認"""

    def test_cart_emptied_after_finish(self, logged_page: Page) -> None:
        """TC-CO2-011: Finish を押すと、カートが空になること。"""
        checkout_flow = CheckoutFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態（Backpack → Bike Light の順）
        checkout_flow.open_step_two_with([backpack, bike_light], CHECKOUT_DATA)

        # 業務操作（Finish）
        checkout_flow.complete_purchase()

        # 検証（業務レベル：バッジが表示されない）
        expect_checkout_badge_count(checkout_flow, 0)

        # 業務操作（Products画面をURLで開く。Complete画面の操作は Complete画面の仕様で扱う）
        inventory_flow.access_inventory_directly()

        # 検証（業務レベル：Products画面のボタン表示）
        expect_not_in_cart(inventory_flow, backpack["name"])
        expect_not_in_cart(inventory_flow, bike_light["name"])

    def test_cart_unchanged_after_cancel(self, logged_page: Page) -> None:
        """TC-CO2-012: Cancel を押しても、カートの中身が変わらないこと。"""
        checkout_flow = CheckoutFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態（Backpack → Bike Light の順）
        checkout_flow.open_step_two_with([backpack, bike_light], CHECKOUT_DATA)

        # 業務操作（Cancel）
        checkout_flow.cancel_from_step_two()

        # 検証（業務レベル：Products画面のボタン表示とバッジ）
        expect_in_cart(inventory_flow, backpack["name"])
        expect_in_cart(inventory_flow, bike_light["name"])
        expect_checkout_badge_count(checkout_flow, 2)

    def test_display_kept_after_reload(self, logged_page: Page) -> None:
        """TC-CO2-013: 再読み込みしても、商品・金額・バッジの表示が変わらないこと。"""
        checkout_flow = CheckoutFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態（Backpack → Bike Light の順）
        checkout_flow.open_step_two_with([backpack, bike_light], CHECKOUT_DATA)

        # 業務操作（再読み込み）
        checkout_flow.reload_step_two()

        # 検証（業務レベル：並び順は TC-CO2-003 で確認するため問わない）
        expect_step_two_item_count(checkout_flow, 2)
        expect_step_two_item_listed(checkout_flow, backpack["name"])
        expect_step_two_item_listed(checkout_flow, bike_light["name"])
        expect_step_two_amounts(checkout_flow, "Item total: $39.98", "Tax: $3.20", "Total: $43.18")
        expect_checkout_badge_count(checkout_flow, 2)
