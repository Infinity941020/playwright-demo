"""Checkout の API のテストで送る値。

値は specs/api_testcases.md の操作の値と同じにする。値に 0 を使わない
（モックは 0 を「値がない」とみなすため。specs/api_spec.md の「モックにある、意図された仕様か判断できない挙動」）。
"""

API_CHECKOUT = {
    # 正しい内容で購入する値（TC-API-CHECKOUT-001）
    "valid_checkout": {"cartId": 1, "userId": 2, "totalPrice": 3000},
    # 必須項目を1つずつ省いて送る値（TC-API-CHECKOUT-002〜004）
    "input_patterns": {
        "missing_cart_id": {"userId": 2, "totalPrice": 3000},
        "missing_user_id": {"cartId": 1, "totalPrice": 3000},
        "missing_total_price": {"cartId": 1, "userId": 2},
    },
}
