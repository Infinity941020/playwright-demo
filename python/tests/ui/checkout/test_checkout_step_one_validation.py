"""Checkout Step One画面 入力チェックテスト"""

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_checkout_error_message,
    expect_on_checkout_step_one_page,
    expect_on_checkout_step_two_page,
)

# エラー文言（checkout_step_one_testcases.md の期待結果どおり）
_FIRST_NAME_REQUIRED_MESSAGE = "Error: First Name is required"
_LAST_NAME_REQUIRED_MESSAGE = "Error: Last Name is required"
_POSTAL_CODE_REQUIRED_MESSAGE = "Error: Postal Code is required"


class TestCheckoutStepOneValidation:
    """入力チェック確認"""

    def test_all_fields_blank(self, logged_page: Page) -> None:
        """TC-CO1-002: 3項目すべて未入力のとき、名のエラーだけが表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 業務操作（3項目とも空欄のまま Continue）
        checkout_flow.proceed_to_overview_step()

        # 検証（業務レベル）
        expect_checkout_error_message(checkout_flow, _FIRST_NAME_REQUIRED_MESSAGE)
        expect_on_checkout_step_one_page(checkout_flow)

    @pytest.mark.parametrize(
        ("first_name", "last_name", "postal_code", "error_message"),
        [
            (
                "",
                CHECKOUT_DATA["last_name"],
                CHECKOUT_DATA["postal_code"],
                _FIRST_NAME_REQUIRED_MESSAGE,
            ),
            (
                CHECKOUT_DATA["first_name"],
                "",
                CHECKOUT_DATA["postal_code"],
                _LAST_NAME_REQUIRED_MESSAGE,
            ),
            (
                CHECKOUT_DATA["first_name"],
                CHECKOUT_DATA["last_name"],
                "",
                _POSTAL_CODE_REQUIRED_MESSAGE,
            ),
        ],
        ids=["TC-CO1-003", "TC-CO1-004", "TC-CO1-005"],
    )
    def test_single_field_blank(
        self,
        logged_page: Page,
        first_name: str,
        last_name: str,
        postal_code: str,
        error_message: str,
    ) -> None:
        """TC-CO1-003/004/005: 1項目だけ未入力のとき、その項目のエラーが表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 業務操作（1項目だけ空欄で Continue）
        checkout_flow.fill_checkout_info(first_name, last_name, postal_code)
        checkout_flow.proceed_to_overview_step()

        # 検証（業務レベル）
        expect_checkout_error_message(checkout_flow, error_message)
        expect_on_checkout_step_one_page(checkout_flow)

    def test_error_switches_until_all_fields_filled(self, logged_page: Page) -> None:
        """TC-CO1-006: 再度 Continue を押すと、エラーが切り替わり、すべて入力すれば次の画面へ進めること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 業務操作（3項目とも空欄のまま Continue。この時点のエラーは本テストでは検証しない）
        checkout_flow.proceed_to_overview_step()

        # 業務操作（名だけ入力して再度 Continue）
        checkout_flow.fill_checkout_info(CHECKOUT_DATA["first_name"], "", "")
        checkout_flow.proceed_to_overview_step()

        # 検証（業務レベル）
        expect_checkout_error_message(checkout_flow, _LAST_NAME_REQUIRED_MESSAGE)
        expect_on_checkout_step_one_page(checkout_flow)

        # 業務操作（姓と郵便番号も入力して再度 Continue）
        checkout_flow.fill_checkout_info(
            CHECKOUT_DATA["first_name"], CHECKOUT_DATA["last_name"], CHECKOUT_DATA["postal_code"]
        )
        checkout_flow.proceed_to_overview_step()

        # 検証（業務レベル）
        expect_on_checkout_step_two_page(checkout_flow)
