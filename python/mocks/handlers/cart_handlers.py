"""カートの API（一覧・追加・削除）。

カートの中身と id の連番は、ハンドラーを作るたびに新しく作る。
サーバーはテストごとに新しく立てるため、状態はテストをまたがない。
"""

from mocks.handler_types import Handler, MockRequest, MockResponse, to_number
from mocks.mock_data import MOCK_DATA

_INVALID_PAYLOAD_ERROR = MOCK_DATA["cart"]["invalid_payload_error"]


def create_cart_handlers() -> list[Handler]:
    cart: list[dict] = []
    next_id = 1

    def get_cart(request: MockRequest) -> MockResponse:
        return MockResponse(200, {"items": cart})

    def add_cart(request: MockRequest) -> MockResponse:
        nonlocal next_id
        body = request.json()

        # 本文がないときは、値がないとして 400 を返す
        if body is None:
            return MockResponse(400, {"error": _INVALID_PAYLOAD_ERROR})

        # productId が指定されていないときは 400 を返す
        # （0 も指定なしとみなす。specs/api_spec.md の「モックにある、意図された仕様か判断できない挙動」）
        if not isinstance(body, dict) or not body.get("productId"):
            return MockResponse(400, {"error": _INVALID_PAYLOAD_ERROR})

        item = {
            "id": next_id,
            "productId": body["productId"],
            # quantity が指定されていなければ 1 にする（null も指定なしとみなす）
            "quantity": body["quantity"] if body.get("quantity") is not None else 1,
        }
        next_id += 1
        cart.append(item)
        return MockResponse(201, item)

    def delete_cart(request: MockRequest) -> MockResponse:
        cart_id = to_number(request.params["id"])
        # 存在しない id でも 200 を返す。意図された仕様か不具合か判断できないため、
        # モックではそのまま再現し、テストでは確かめない
        # （specs/api_spec.md の「モックにある、意図された仕様か判断できない挙動」）
        cart[:] = [item for item in cart if item["id"] != cart_id]
        return MockResponse(200, {"success": True})

    return [
        Handler("GET", "/api/cart", get_cart),
        Handler("POST", "/api/cart", add_cart),
        Handler("DELETE", "/api/cart/{id}", delete_cart),
    ]
