"""Checkout Step Two画面 画面遷移テスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_on_cart_page,
    expect_on_checkout_complete_page,
    expect_on_inventory_page,
    expect_on_product_detail_page,
)


class TestCheckoutStepTwoNavigation:
    """画面遷移を確かめる。"""

    @pytest.mark.parametrize(
        ("press_button", "expect_destination"),
        [
            (CheckoutFlow.complete_purchase, expect_on_checkout_complete_page),
            (CheckoutFlow.cancel_from_step_two, expect_on_inventory_page),
            (CheckoutFlow.open_cart, expect_on_cart_page),
        ],
        ids=["TC-CO2-007", "TC-CO2-008", "TC-CO2-009"],
    )
    def test_button_navigation(
        self,
        logged_page: Page,
        press_button: Callable[[CheckoutFlow], None],
        expect_destination: Callable[[CheckoutFlow], None],
    ) -> None:
        """TC-CO2-007/008/009: Finish・Cancel・カートアイコンを押すと、それぞれの画面へ遷移すること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態を作る（カートには Backpack のみを入れる）
        checkout_flow.open_step_two_with([PRODUCTS["backpack"]], CHECKOUT_DATA)

        # ボタンを押す
        press_button(checkout_flow)

        # 結果を検証する
        expect_destination(checkout_flow)

    def test_open_product_detail(self, logged_page: Page) -> None:
        """TC-CO2-010: 商品名を押すと、商品詳細画面へ遷移すること。"""
        checkout_flow = CheckoutFlow(logged_page)
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（カートには Bike Light のみを入れる）
        checkout_flow.open_step_two_with([bike_light], CHECKOUT_DATA)

        # 商品名を押す
        checkout_flow.open_product_detail(bike_light["name"])

        # 結果を検証する
        expect_on_product_detail_page(checkout_flow, bike_light["id"])
