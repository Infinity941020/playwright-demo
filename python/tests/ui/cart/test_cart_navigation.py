"""Cart画面 画面遷移テスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from utils.ui_assertions.cart_assertions import (
    expect_on_checkout_step_one_page,
    expect_on_inventory_page,
    expect_on_product_detail_page,
)


class TestCartNavigation:
    """画面遷移を確かめる。"""

    @pytest.mark.parametrize(
        ("press_button", "expect_destination"),
        [
            (CartFlow.continue_shopping, expect_on_inventory_page),
            (CartFlow.checkout, expect_on_checkout_step_one_page),
        ],
        ids=["TC-CART-006", "TC-CART-007"],
    )
    def test_button_navigation(
        self,
        logged_page: Page,
        press_button: Callable[[CartFlow], None],
        expect_destination: Callable[[CartFlow], None],
    ) -> None:
        """TC-CART-006/007: Continue Shopping・Checkout を押すと、それぞれの画面へ遷移すること。"""
        cart_flow = CartFlow(logged_page)

        # 前提状態を作る（カートには Backpack のみを入れる）
        cart_flow.open_cart_with([PRODUCTS["backpack"]])

        # ボタンを押す
        press_button(cart_flow)

        # 結果を検証する
        expect_destination(cart_flow)

    def test_open_product_detail(self, logged_page: Page) -> None:
        """TC-CART-008: 商品名を押すと、商品詳細画面へ遷移すること。"""
        cart_flow = CartFlow(logged_page)
        bike_light = PRODUCTS["bike_light"]

        # 前提状態を作る（カートには Bike Light のみを入れる）
        cart_flow.open_cart_with([bike_light])

        # 商品名を押す
        cart_flow.open_product_detail(bike_light["name"])

        # 結果を検証する
        expect_on_product_detail_page(cart_flow, bike_light["id"])
