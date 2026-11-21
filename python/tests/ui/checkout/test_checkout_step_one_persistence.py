"""Checkout Step One画面 入力値の保持テスト"""

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

        # 前提状態を作る（カートには Backpack のみを入れる）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 名と姓だけを入力して Continue を押す
        checkout_flow.fill_checkout_info(first_name, last_name, "")
        checkout_flow.proceed_to_overview_step()

        # エラーが表示されている間の入力値を検証する
        expect_checkout_error_message(checkout_flow, _POSTAL_CODE_REQUIRED_MESSAGE)
        expect_checkout_info_values(checkout_flow, first_name, last_name, "")

        # エラー表示を閉じる
        checkout_flow.close_error()

        # エラー表示を閉じた後の入力値を検証する
        expect_no_checkout_error(checkout_flow)
        expect_checkout_info_values(checkout_flow, first_name, last_name, "")

    def test_values_cleared_after_reload(self, logged_page: Page) -> None:
        """TC-CO1-011: 再読み込みすると、入力値が空に戻ること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態を作る（カートには Backpack のみを入れる）
        checkout_flow.open_step_one_with([PRODUCTS["backpack"]])

        # 3項目を入力してから、再読み込みする
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

        # 結果を検証する
        expect_checkout_info_values(checkout_flow, "", "", "")
