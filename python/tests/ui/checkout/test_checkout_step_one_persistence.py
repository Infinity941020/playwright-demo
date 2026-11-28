"""Checkout Step One画面で、入力値が保たれること・消えることのテスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.messages import MESSAGES
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_checkout_error_message,
    expect_checkout_info_values,
    expect_no_checkout_error,
)

_POSTAL_CODE_REQUIRED_MESSAGE = MESSAGES["checkout"]["postal_code_required"]


class TestCheckoutStepOnePersistence:
    """入力値が保持されることを確かめる。"""

    def test_values_kept_after_error_and_close(self, logged_page: Page) -> None:
        """TC-CO1-007: エラー表示後、入力値が保持され、エラー表示を閉じても保持されること。"""
        checkout_flow = CheckoutFlow(logged_page)
        first_name = CHECKOUT_DATA["first_name"]
        last_name = CHECKOUT_DATA["last_name"]

        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        checkout_flow.fill_checkout_info(first_name, last_name, "")
        checkout_flow.proceed_to_overview_step()

        # 入力欄の値は Continue を押す前から同じため、先にエラーの文言で、先へ進めなかったことを確かめる
        expect_checkout_error_message(checkout_flow, _POSTAL_CODE_REQUIRED_MESSAGE)
        expect_checkout_info_values(checkout_flow, first_name, last_name, "")

        checkout_flow.close_error()

        expect_no_checkout_error(checkout_flow)
        expect_checkout_info_values(checkout_flow, first_name, last_name, "")

    def test_values_cleared_after_reload(self, logged_page: Page) -> None:
        """TC-CO1-011: 再読み込みすると、入力値が空に戻ること。"""
        checkout_flow = CheckoutFlow(logged_page)

        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        checkout_flow.fill_checkout_info(
            CHECKOUT_DATA["first_name"], CHECKOUT_DATA["last_name"], CHECKOUT_DATA["postal_code"]
        )
        expect_checkout_info_values(
            checkout_flow,
            CHECKOUT_DATA["first_name"],
            CHECKOUT_DATA["last_name"],
            CHECKOUT_DATA["postal_code"],
        )
        checkout_flow.reload_step_one()

        expect_checkout_info_values(checkout_flow, "", "", "")
