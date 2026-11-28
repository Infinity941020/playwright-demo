"""Checkout の API の返事を確かめる。"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_CREATED = 201
_STATUS_BAD_REQUEST = 400


def expect_checkout_success(
    response: APIResponse, cart_id: int, user_id: int, total_price: int
) -> None:
    """購入できたことを確かめる（201、success が true、checkoutId が整数、ほかの項目が送った値と同じ）。"""
    expect_status(response, _STATUS_CREATED)
    body = response.json()
    assert body["success"] is True
    # Python では真偽値も整数として扱われるため、真偽値は除く
    assert isinstance(body["checkoutId"], int) and not isinstance(body["checkoutId"], bool)
    assert body["cartId"] == cart_id
    assert body["userId"] == user_id
    assert body["totalPrice"] == total_price


def expect_checkout_bad_request(response: APIResponse, error: str) -> None:
    """購入できなかったことを確かめる（400、エラーの文言が期待値と同じ）。"""
    expect_status(response, _STATUS_BAD_REQUEST)
    assert response.json()["error"] == error
