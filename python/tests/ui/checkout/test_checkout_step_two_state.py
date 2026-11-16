"""Checkout Step Two画面 状態テスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.checkout_assertions import (
    expect_badge_count,
    expect_step_two_amounts,
    expect_step_two_item_count,
    expect_step_two_item_listed,
)
from utils.ui_assertions.inventory_assertions import (
    expect_add_to_cart_button_shown,
    expect_remove_button_shown,
)


class TestCheckoutStepTwoState:
    """Finish・Cancel・再読み込みの後の状態を確かめる。"""

    def test_cart_emptied_after_finish(self, logged_page: Page) -> None:
        """TC-CO2-011: Finish を押すと、カートが空になること。"""
        checkout_flow = CheckoutFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れる）
        checkout_flow.open_step_two_with([backpack, bike_light], CHECKOUT_DATA)

        # Finish を押す
        checkout_flow.complete_purchase()

        # バッジが表示されないことを検証する
        expect_badge_count(checkout_flow, 0)

        # Products画面を URL で開く（Complete画面での操作は、Complete画面の仕様で扱う）
        inventory_flow.access_inventory_directly()

        # Products画面のボタンの表示を検証する
        expect_add_to_cart_button_shown(inventory_flow, backpack["name"])
        expect_add_to_cart_button_shown(inventory_flow, bike_light["name"])

    def test_cart_unchanged_after_cancel(self, logged_page: Page) -> None:
        """TC-CO2-012: Cancel を押しても、カートの中身が変わらないこと。"""
        checkout_flow = CheckoutFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れる）
        checkout_flow.open_step_two_with([backpack, bike_light], CHECKOUT_DATA)

        # Cancel を押す
        checkout_flow.cancel_from_step_two()

        # Products画面のボタンの表示とバッジを検証する
        expect_remove_button_shown(inventory_flow, backpack["name"])
        expect_remove_button_shown(inventory_flow, bike_light["name"])
        expect_badge_count(checkout_flow, 2)

    def test_display_kept_after_reload(self, logged_page: Page) -> None:
        """TC-CO2-013: 再読み込みしても、商品・金額・バッジの表示が変わらないこと。"""
        checkout_flow = CheckoutFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れる）
        checkout_flow.open_step_two_with([backpack, bike_light], CHECKOUT_DATA)

        # 画面を再読み込みする
        checkout_flow.reload_step_two()

        # 結果を検証する（並び順は TC-CO2-003 で確かめるため、ここでは問わない）
        expect_step_two_item_count(checkout_flow, 2)
        expect_step_two_item_listed(checkout_flow, backpack["name"])
        expect_step_two_item_listed(checkout_flow, bike_light["name"])
        expect_step_two_amounts(checkout_flow, "Item total: $39.98", "Tax: $3.20", "Total: $43.18")
        expect_badge_count(checkout_flow, 2)
