"""Checkout Mock Handlers（TS版 mocks/handlers/checkoutHandlers.ts に対応）

呼び出し回数は、create_checkout_handlers() を呼ぶたびに 0 から数え直す。
モックサーバーはテストごとに新しく立ち上げるため、回数はテストをまたがない。
"""

import time

from mocks.handler_types import Handler, MockRequest, MockResponse
from mocks.mock_data import MOCK_DATA

_CHECKOUT = MOCK_DATA["checkout"]


def create_checkout_handlers() -> list[Handler]:
    checkout_count = 0

    def checkout(request: MockRequest) -> MockResponse:
        nonlocal checkout_count
        body = request.json()

        checkout_count += 1

        # 呼び出し回数の上限を定める（この挙動は、意図された仕様か不具合か判断できないため、モックではそのまま再現し、テストでは確かめない。specs/api_spec.md の「モックにある、意図された仕様か判断できない挙動」）
        if checkout_count >= _CHECKOUT["call_limit"]:
            return MockResponse(
                401,
                {"error": _CHECKOUT["call_limit_error"], "message": _CHECKOUT["call_limit_message"]},
            )

        # 本文がないときは、値がないとして 400 を返す
        if body is None:
            return MockResponse(400, {"error": _CHECKOUT["invalid_payload_error"]})

        # 必須項目がそろっているかを確かめる（0 も指定なしとみなす。specs/api_spec.md「判断できない挙動」）
        if (
            not isinstance(body, dict)
            or not body.get("cartId")
            or not body.get("userId")
            or not body.get("totalPrice")
        ):
            return MockResponse(400, {"error": _CHECKOUT["invalid_payload_error"]})

        return MockResponse(
            201,
            {
                "success": True,
                # 呼び出した時刻をミリ秒で入れる（意図された仕様か不具合かを判断できない挙動）
                "checkoutId": int(time.time() * 1000),
                "cartId": body["cartId"],
                "userId": body["userId"],
                "totalPrice": body["totalPrice"],
            },
        )

    return [Handler("POST", "/api/checkout", checkout)]
