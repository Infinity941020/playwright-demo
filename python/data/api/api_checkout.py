"""Checkout APIテストデータ（TS版 data/apiCheckout.ts に対応）

値は api_testcases.md の操作の値と同じにする。値に 0 を使わない
（モックは 0 を「値がない」とみなすため。api_spec.md「判断できない挙動」参照）。
"""

API_CHECKOUT = {
    # 正常系のテストに使う（TC-API-CHECKOUT-001）
    "valid_checkout": {"cartId": 1, "userId": 2, "totalPrice": 3000},
    # 入力の組み合わせを変えるテストに使う（TC-API-CHECKOUT-002〜004）
    "input_patterns": {
        "missing_cart_id": {"userId": 2, "totalPrice": 3000},
        "missing_user_id": {"cartId": 1, "totalPrice": 3000},
        "missing_total_price": {"cartId": 1, "userId": 2},
    },
}
