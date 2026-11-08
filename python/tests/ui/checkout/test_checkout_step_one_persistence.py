"""Checkout Step One画面 入力値の保持テスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_checkout_error_message,
    expect_checkout_info_values,
    expect_no_checkout_error,
)

_POSTAL_CODE_REQUIRED_MESSAGE = "Error: Postal Code is required"


class TestCheckoutStepOnePersistence:
    """入力値の保持確認"""

    def test_values_kept_after_error_and_close(self, logged_page: Page) -> None:
        """TC-CO1-007: エラー表示後、入力値が保持され、エラー表示を閉じても保持されること。"""
        checkout_flow = CheckoutFlow(logged_page)
        first_name = CHECKOUT_DATA["first_name"]
        last_name = CHECKOUT_DATA["last_name"]

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 業務操作（名と姓だけ入力して Continue）
        checkout_flow.fill_checkout_info(first_name, last_name, "")
        checkout_flow.proceed_to_overview_step()

        # 検証（業務レベル：エラー表示中）
        expect_checkout_error_message(checkout_flow, _POSTAL_CODE_REQUIRED_MESSAGE)
        expect_checkout_info_values(checkout_flow, first_name, last_name, "")

        # 業務操作（エラー表示を閉じる）
        checkout_flow.close_error()

        # 検証（業務レベル：エラー表示を閉じた後）
        expect_no_checkout_error(checkout_flow)
        expect_checkout_info_values(checkout_flow, first_name, last_name, "")

    def test_values_cleared_after_reload(self, logged_page: Page) -> None:
        """TC-CO1-011: 再読み込みすると、入力値が空に戻ること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態（Backpack のみ）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 業務操作（3項目を入力して再読み込み）
        checkout_flow.fill_checkout_info(
            CHECKOUT_DATA["first_name"], CHECKOUT_DATA["last_name"], CHECKOUT_DATA["postal_code"]
        )
        checkout_flow.reload_step_one()

        # 検証（業務レベル）
        expect_checkout_info_values(checkout_flow, "", "", "")
