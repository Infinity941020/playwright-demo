"""Cart の API のテスト"""

import pytest
from playwright.sync_api import APIRequestContext

from data.api.api_carts import API_CARTS
from utils.api_assertions.cart_assertions import (
    expect_add_cart_success,
    expect_cart_bad_request,
    expect_delete_cart_success,
    expect_get_cart_list_success,
)
from utils.api_helper import (
    execute_add_cart_api,
    execute_delete_cart_api,
    execute_get_cart_api,
)

# エラーの文言は、specs/api_testcases.md の期待結果と同じ値を書く
_INVALID_PAYLOAD_MESSAGE = "invalid payload"


class TestCartApi:
    """Cart API を確かめる。"""

    def test_add_cart(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-001: カートに追加すると、送った内容で行が作られること。"""
        payload = API_CARTS["valid_cart"]

        response = execute_add_cart_api(api_request_context, payload)

        expect_add_cart_success(response, payload["productId"], payload["quantity"])

    @pytest.mark.parametrize(
        "payload",
        [API_CARTS["input_patterns"]["missing_product_id"], None],
        ids=["TC-API-CART-002", "TC-API-CART-003"],
    )
    def test_add_cart_bad_request(
        self, api_request_context: APIRequestContext, payload: dict | None
    ) -> None:
        """TC-API-CART-002/003: productId がない、または本文がないと、400 とエラーが返ること。"""
        # 送る値が None のときは、本文なしで送る
        response = execute_add_cart_api(api_request_context, payload)

        expect_cart_bad_request(response, _INVALID_PAYLOAD_MESSAGE)

    def test_add_cart_without_quantity(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-004: quantity を省略すると、quantity が 1 になること。"""
        payload = API_CARTS["input_patterns"]["missing_quantity"]

        response = execute_add_cart_api(api_request_context, payload)

        expect_add_cart_success(response, payload["productId"], 1)

    def test_get_cart_list(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-005: 一覧に、追加した行だけが返ること。"""
        items = API_CARTS["list_items"]

        for item in items:
            execute_add_cart_api(api_request_context, item)
        response = execute_get_cart_api(api_request_context)

        # ほかのテストで追加した行が含まれないことも、行の数で確かめる
        expect_get_cart_list_success(response, items)

    def test_delete_cart(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-006: 削除すると、一覧からその行がなくなること。"""
        first_item, second_item = API_CARTS["delete_items"]

        first_id = execute_add_cart_api(api_request_context, first_item).json()["id"]
        execute_add_cart_api(api_request_context, second_item)
        delete_response = execute_delete_cart_api(api_request_context, first_id)
        list_response = execute_get_cart_api(api_request_context)

        expect_delete_cart_success(delete_response)
        expect_get_cart_list_success(list_response, [{"productId": second_item["productId"]}])
