"""Checkout Mock Handlers（TS版 mocks/handlers/checkoutHandlers.ts に対応）

呼び出し回数は、create_checkout_handlers() を呼ぶたびに 0 から数え直す。
モックサーバーはテストごとに新しく立ち上げるため、回数はテストをまたがない
（TS版の resetCheckoutMock に相当する処理は不要。decisions.md 論点5-a）。
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

        # 呼び出し回数の上限を定める（TS版と同じ。意図された仕様か不具合かを判断できない挙動）
        if checkout_count >= _CHECKOUT["call_limit"]:
            return MockResponse(
                401,
                {"error": _CHECKOUT["call_limit_error"], "message": _CHECKOUT["call_limit_message"]},
            )

        # 本文がない場合（TS版は本文の読み取りエラーになり、この分岐に届かない。api_spec.md 参照）
        if body is None:
            return MockResponse(400, {"error": _CHECKOUT["invalid_payload_error"]})

        # 必須項目がそろっているかを確かめる（TS版の !body.xxx と同じく、0 も指定なしとみなす）
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
                # 呼び出した時刻をミリ秒で入れる
                # （TS版の Date.now() と同じ。意図された仕様か不具合かを判断できない挙動）
                "checkoutId": int(time.time() * 1000),
                "cartId": body["cartId"],
                "userId": body["userId"],
                "totalPrice": body["totalPrice"],
            },
        )

    return [Handler("POST", "/api/checkout", checkout)]
