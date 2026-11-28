"""Checkout Complete画面から移った後の、カートの状態のテスト。

バッジがないことや行が0件であることは、移る前の Complete画面でも成り立つため、先に移った先の画面であることを確かめる。
"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.checkout_assertions import (
    expect_badge_count,
    expect_cart_item_count,
    expect_on_cart_page,
    expect_on_inventory_page,
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

        checkout_flow.open_complete_with([backpack, bike_light], CHECKOUT_DATA)

        checkout_flow.back_home()

        expect_on_inventory_page(checkout_flow)
        expect_add_to_cart_button_shown(inventory_flow, backpack["name"])
        expect_add_to_cart_button_shown(inventory_flow, bike_light["name"])
        expect_badge_count(checkout_flow, 0)

    def test_cart_empty_after_cart_icon(self, logged_page: Page) -> None:
        """TC-CO3-005: カートアイコンで Cart画面へ移っても、カートが空のままであること。"""
        checkout_flow = CheckoutFlow(logged_page)

        checkout_flow.open_complete_with(
            [PRODUCTS["backpack"], PRODUCTS["bike_light"]], CHECKOUT_DATA
        )

        checkout_flow.open_cart()

        expect_on_cart_page(checkout_flow)
        expect_cart_item_count(checkout_flow, 0)
        expect_badge_count(checkout_flow, 0)
