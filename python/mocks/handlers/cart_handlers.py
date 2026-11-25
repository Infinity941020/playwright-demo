"""Cart Mock Handlers（TS版 mocks/handlers/cartHandlers.ts に対応）

カートの中身と id の連番は、create_cart_handlers() を呼ぶたびに新しく作られる。
モックサーバーはテストごとに新しく立ち上げるため、状態はテストをまたがない
（TS版の resetCartMock に相当する処理は不要。decisions.md 論点5-a）。
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

        # 本文がない場合（TS版は本文の読み取りエラーになり、この分岐に届かない。api_spec.md 参照）
        if body is None:
            return MockResponse(400, {"error": _INVALID_PAYLOAD_ERROR})

        # productId が指定されていない場合（TS版の !body.productId と同じく、0 も指定なしとみなす）
        if not isinstance(body, dict) or not body.get("productId"):
            return MockResponse(400, {"error": _INVALID_PAYLOAD_ERROR})

        item = {
            "id": next_id,
            "productId": body["productId"],
            # quantity が指定されていなければ 1 にする（TS版の ?? 1 と同じく、null も指定なしとみなす）
            "quantity": body["quantity"] if body.get("quantity") is not None else 1,
        }
        next_id += 1
        cart.append(item)
        return MockResponse(201, item)

    def delete_cart(request: MockRequest) -> MockResponse:
        cart_id = to_number(request.params["id"])
        # 存在しない id でも 200 を返す（TS版と同じ。意図された仕様か不具合かを判断できない挙動）
        cart[:] = [item for item in cart if item["id"] != cart_id]
        return MockResponse(200, {"success": True})

    return [
        Handler("GET", "/api/cart", get_cart),
        Handler("POST", "/api/cart", add_cart),
        Handler("DELETE", "/api/cart/{id}", delete_cart),
    ]
