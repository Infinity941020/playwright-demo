"""Cart の API のテストで送る値。

値は specs/api_testcases.md の操作の値と同じにする。productId などに 0 を使わない
（モックは 0 を「値がない」とみなすため。specs/api_spec.md の「モックにある、意図された仕様か判断できない挙動」）。
"""

API_CARTS = {
    # 正しい内容で追加する値（TC-API-CART-001）
    "valid_cart": {"productId": 4, "quantity": 2},
    # 項目を省いて送る値（TC-API-CART-002・004）
    "input_patterns": {
        "missing_product_id": {"quantity": 1},
        "missing_quantity": {"productId": 4},
    },
    # 一覧を確かめるために追加する行（TC-API-CART-005）
    "list_items": [
        {"productId": 4, "quantity": 1},
        {"productId": 1, "quantity": 3},
    ],
    # 削除を確かめるために追加する行（TC-API-CART-006）
    "delete_items": [
        {"productId": 4, "quantity": 1},
        {"productId": 1, "quantity": 1},
    ],
}
