"""Checkout Complete画面 画面遷移テスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import expect_on_cart_page, expect_on_inventory_page


class TestCheckoutCompleteNavigation:
    """画面遷移確認"""

    @pytest.mark.parametrize(
        ("press_button", "expect_destination"),
        [
            (CheckoutFlow.back_home, expect_on_inventory_page),
            (CheckoutFlow.open_cart, expect_on_cart_page),
        ],
        ids=["TC-CO3-002", "TC-CO3-003"],
    )
    def test_button_navigation(
        self,
        logged_page: Page,
        press_button: Callable[[CheckoutFlow], None],
        expect_destination: Callable[[CheckoutFlow], None],
    ) -> None:
        """TC-CO3-002/003: Back Home・カートアイコンを押すと、それぞれの画面へ遷移すること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack をカートに入れて購入を完了）
        checkout_flow.open_complete_with([PRODUCTS["backpack"]], CHECKOUT_DATA)

        # 業務操作（ボタン押下）
        press_button(checkout_flow)

        # 検証（業務レベル）
        expect_destination(checkout_flow)
