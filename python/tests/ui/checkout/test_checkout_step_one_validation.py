"""Checkout Step One画面 入力チェックテスト"""

import pytest
from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.messages import MESSAGES
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_checkout_error_message,
    expect_on_checkout_step_one_page,
    expect_on_checkout_step_two_page,
)

# エラーの文言（shared/data/messages.json）は、checkout_step_one_testcases.md の期待結果と同じにする
_FIRST_NAME_REQUIRED_MESSAGE = MESSAGES["checkout"]["first_name_required"]
_LAST_NAME_REQUIRED_MESSAGE = MESSAGES["checkout"]["last_name_required"]
_POSTAL_CODE_REQUIRED_MESSAGE = MESSAGES["checkout"]["postal_code_required"]


class TestCheckoutStepOneValidation:
    """入力チェックを確かめる。"""

    def test_all_fields_blank(self, logged_page: Page) -> None:
        """TC-CO1-002: 3項目すべて未入力のとき、名のエラーだけが表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態を作る（カートには Backpack のみを入れる）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 3項目とも空欄のまま Continue を押す
        checkout_flow.proceed_to_overview_step()

        # 結果を検証する
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

        # 前提状態を作る（カートには Backpack のみを入れる）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 1項目だけを空欄にして Continue を押す
        checkout_flow.fill_checkout_info(first_name, last_name, postal_code)
        checkout_flow.proceed_to_overview_step()

        # 結果を検証する
        expect_checkout_error_message(checkout_flow, error_message)
        expect_on_checkout_step_one_page(checkout_flow)

    def test_error_switches_until_all_fields_filled(self, logged_page: Page) -> None:
        """TC-CO1-006: 再度 Continue を押すと、エラーが切り替わり、すべて入力すれば次の画面へ進めること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態を作る（カートには Backpack のみを入れる）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 3項目とも空欄のまま Continue を押す（この時点のエラーは、このテストでは検証しない）
        checkout_flow.proceed_to_overview_step()

        # 名だけを入力して、もう一度 Continue を押す
        checkout_flow.fill_checkout_info(CHECKOUT_DATA["first_name"], "", "")
        checkout_flow.proceed_to_overview_step()

        # 結果を検証する
        expect_checkout_error_message(checkout_flow, _LAST_NAME_REQUIRED_MESSAGE)
        expect_on_checkout_step_one_page(checkout_flow)

        # 姓と郵便番号も入力して、もう一度 Continue を押す
        checkout_flow.fill_checkout_info(
            CHECKOUT_DATA["first_name"], CHECKOUT_DATA["last_name"], CHECKOUT_DATA["postal_code"]
        )
        checkout_flow.proceed_to_overview_step()

        # 結果を検証する
        expect_on_checkout_step_two_page(checkout_flow)
