"""Cart APIテスト"""

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

# エラー文言（api_testcases.md の期待結果どおり）
_INVALID_PAYLOAD_MESSAGE = "invalid payload"


class TestCartApi:
    """Cart API の確認"""

    def test_add_cart(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-001: カートに追加すると、送った内容で行が作られること。"""
        payload = API_CARTS["valid_cart"]

        # 操作
        response = execute_add_cart_api(api_request_context, payload)

        # 検証
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
        # 操作（None のときは本文なしで送る）
        response = execute_add_cart_api(api_request_context, payload)

        # 検証
        expect_cart_bad_request(response, _INVALID_PAYLOAD_MESSAGE)

    def test_add_cart_without_quantity(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-004: quantity を省略すると、quantity が 1 になること。"""
        payload = API_CARTS["input_patterns"]["missing_quantity"]

        # 操作
        response = execute_add_cart_api(api_request_context, payload)

        # 検証
        expect_add_cart_success(response, payload["productId"], 1)

    def test_get_cart_list(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-005: 一覧に、追加した行だけが返ること。"""
        items = API_CARTS["list_items"]

        # 操作（2行追加してから一覧を取得）
        for item in items:
            execute_add_cart_api(api_request_context, item)
        response = execute_get_cart_api(api_request_context)

        # 検証（ほかのテストで追加した行が含まれないことも、件数で確かめる）
        expect_get_cart_list_success(response, items)

    def test_delete_cart(self, api_request_context: APIRequestContext) -> None:
        """TC-API-CART-006: 削除すると、一覧からその行がなくなること。"""
        first_item, second_item = API_CARTS["delete_items"]

        # 操作（2行追加し、1行目を削除してから一覧を取得）
        first_id = execute_add_cart_api(api_request_context, first_item).json()["id"]
        execute_add_cart_api(api_request_context, second_item)
        delete_response = execute_delete_cart_api(api_request_context, first_id)
        list_response = execute_get_cart_api(api_request_context)

        # 検証
        expect_delete_cart_success(delete_response)
        expect_get_cart_list_success(list_response, [{"productId": second_item["productId"]}])
