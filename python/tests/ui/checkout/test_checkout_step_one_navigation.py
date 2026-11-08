"""Checkout Step One画面 画面遷移テスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_on_cart_page,
    expect_on_checkout_step_two_page,
)


class TestCheckoutStepOneNavigation:
    """画面遷移確認"""

    def test_continue_to_step_two(self, logged_page: Page) -> None:
        """TC-CO1-008: 3項目を入力して Continue を押すと、Step Two画面へ遷移すること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 業務操作（3項目を入力して Continue）
        checkout_flow.fill_checkout_info(
            CHECKOUT_DATA["first_name"], CHECKOUT_DATA["last_name"], CHECKOUT_DATA["postal_code"]
        )
        checkout_flow.proceed_to_overview_step()

        # 検証（業務レベル）
        expect_on_checkout_step_two_page(checkout_flow)

    @pytest.mark.parametrize(
        "go_to_cart",
        [CheckoutFlow.cancel_from_step_one, CheckoutFlow.open_cart],
        ids=["TC-CO1-009", "TC-CO1-010"],
    )
    def test_navigation_to_cart(
        self, logged_page: Page, go_to_cart: Callable[[CheckoutFlow], None]
    ) -> None:
        """TC-CO1-009/010: Cancel・カートアイコンを押すと、Cart画面へ遷移すること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 業務操作（Cancel またはカートアイコンを押す）
        go_to_cart(checkout_flow)

        # 検証（業務レベル）
        expect_on_cart_page(checkout_flow)
