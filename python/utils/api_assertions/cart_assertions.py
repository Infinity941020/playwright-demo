"""Cart API Assertions（TS版 utils/apiAssertions/cartAssertions.ts に対応）"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_OK = 200
_STATUS_CREATED = 201
_STATUS_BAD_REQUEST = 400


def expect_add_cart_success(response: APIResponse, product_id: int, quantity: int) -> None:
    """カート追加成功（201、id が数値、productId・quantity が期待値と一致）。"""
    expect_status(response, _STATUS_CREATED)
    body = response.json()
    assert isinstance(body["id"], int) and not isinstance(body["id"], bool)
    assert body["productId"] == product_id
    assert body["quantity"] == quantity


def expect_cart_bad_request(response: APIResponse, error: str) -> None:
    """カート追加エラー（400、error が期待値と一致）。"""
    expect_status(response, _STATUS_BAD_REQUEST)
    assert response.json()["error"] == error


def expect_get_cart_list_success(response: APIResponse, expected_items: list[dict]) -> None:
    """カート一覧取得成功（200、items の件数と、各行の指定した項目の値が期待値と一致）。

    expected_items の各要素には、確かめたい項目だけを書く（例：{"productId": 1}）。
    行の並びは追加した順。
    """
    expect_status(response, _STATUS_OK)
    items = response.json()["items"]
    assert len(items) == len(expected_items)
    for item, expected in zip(items, expected_items):
        assert {key: item[key] for key in expected} == expected


def expect_delete_cart_success(response: APIResponse) -> None:
    """カート削除成功（200、success が true）。"""
    expect_status(response, _STATUS_OK)
    assert response.json()["success"] is True
