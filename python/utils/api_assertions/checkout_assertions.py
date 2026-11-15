"""Checkout API Assertions（TS版 utils/apiAssertions/checkoutAssertions.ts に対応）"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_CREATED = 201
_STATUS_BAD_REQUEST = 400


def expect_checkout_success(
    response: APIResponse, cart_id: int, user_id: int, total_price: int
) -> None:
    """Checkout成功（201、success が true、checkoutId が数値、送った値と一致）。"""
    expect_status(response, _STATUS_CREATED)
    body = response.json()
    assert body["success"] is True
    assert isinstance(body["checkoutId"], int) and not isinstance(body["checkoutId"], bool)
    assert body["cartId"] == cart_id
    assert body["userId"] == user_id
    assert body["totalPrice"] == total_price


def expect_checkout_bad_request(response: APIResponse, error: str) -> None:
    """Checkout失敗（400、error が期待値と一致）。"""
    expect_status(response, _STATUS_BAD_REQUEST)
    assert response.json()["error"] == error
