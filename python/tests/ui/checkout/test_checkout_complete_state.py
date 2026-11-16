"""Checkout Complete画面 状態テスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.checkout_assertions import (
    expect_badge_count,
    expect_cart_item_count,
    expect_on_cart_page,
)
from utils.ui_assertions.inventory_assertions import expect_add_to_cart_button_shown


class TestCheckoutCompleteState:
    """Complete画面から移った後のカートの状態を確かめる。"""

    def test_cart_empty_after_back_home(self, logged_page: Page) -> None:
        """TC-CO3-004: Back Home で Products画面へ移っても、カートが空のままであること。"""
        checkout_flow = CheckoutFlow(logged_page)
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れ、購入を完了する）
        checkout_flow.open_complete_with([backpack, bike_light], CHECKOUT_DATA)

        # Back Home を押す
        checkout_flow.back_home()

        # Products画面の表示を確かめてから、バッジを検証する
        expect_add_to_cart_button_shown(inventory_flow, backpack["name"])
        expect_add_to_cart_button_shown(inventory_flow, bike_light["name"])
        expect_badge_count(checkout_flow, 0)

    def test_cart_empty_after_cart_icon(self, logged_page: Page) -> None:
        """TC-CO3-005: カートアイコンで Cart画面へ移っても、カートが空のままであること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れ、購入を完了する）
        checkout_flow.open_complete_with(
            [PRODUCTS["backpack"], PRODUCTS["bike_light"]], CHECKOUT_DATA
        )

        # カートアイコンを押す
        checkout_flow.open_cart()

        # 行が0件であることは画面が移る前でも成り立つため、先に Cart画面の表示を確かめてから検証する
        expect_on_cart_page(checkout_flow)
        expect_cart_item_count(checkout_flow, 0)
        expect_badge_count(checkout_flow, 0)
