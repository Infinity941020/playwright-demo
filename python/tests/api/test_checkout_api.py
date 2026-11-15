"""Checkout APIテスト"""

import pytest
from playwright.sync_api import APIRequestContext

from data.api.api_checkout import API_CHECKOUT
from utils.api_assertions.checkout_assertions import (
    expect_checkout_bad_request,
    expect_checkout_success,
)
from utils.api_helper import execute_checkout_api

# エラー文言（api_spec.md「Checkout API」の表のとおり）
_INVALID_PAYLOAD_MESSAGE = "invalid payload"


class TestCheckoutApi:
    """Checkout API の確認"""

    def test_checkout_success(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CHECKOUT-001: 正しい内容で購入すると、送った内容が返ること。"""
        payload = API_CHECKOUT["valid_checkout"]

        # 操作
        response = execute_checkout_api(api_request_context, payload)

        # 検証
        expect_checkout_success(
            response, payload["cartId"], payload["userId"], payload["totalPrice"]
        )

    @pytest.mark.parametrize(
        "payload",
        [
            API_CHECKOUT["input_patterns"]["missing_cart_id"],
            API_CHECKOUT["input_patterns"]["missing_user_id"],
            API_CHECKOUT["input_patterns"]["missing_total_price"],
            None,
        ],
        ids=[
            "TC-API-CHECKOUT-002",
            "TC-API-CHECKOUT-003",
            "TC-API-CHECKOUT-004",
            "TC-API-CHECKOUT-005",
        ],
    )
    def test_checkout_bad_request(
        self, api_request_context: APIRequestContext, payload: dict | None
    ) -> None:
        """TC-API-CHECKOUT-002〜005: 必須項目のどれかがない、または本文がないと、400 とエラーが返ること。"""
        # 操作（None のときは本文なしで送る）
        response = execute_checkout_api(api_request_context, payload)

        # 検証
        expect_checkout_bad_request(response, _INVALID_PAYLOAD_MESSAGE)
