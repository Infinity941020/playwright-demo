"""Cart APIテストデータ（TS版 data/apiCarts.ts に対応）

値は api_testcases.md の操作の値と同じにする。productId などに 0 を使わない
（モックは 0 を「値がない」とみなすため。api_spec.md「判断できない挙動」参照）。
"""

API_CARTS = {
    # 正常系のテストに使う（TC-API-CART-001）
    "valid_cart": {"productId": 4, "quantity": 2},
    # 入力の組み合わせを変えるテストに使う（TC-API-CART-002・004）
    "input_patterns": {
        "missing_product_id": {"quantity": 1},
        "missing_quantity": {"productId": 4},
    },
    # 一覧を確かめるために追加する行を定義する（TC-API-CART-005）
    "list_items": [
        {"productId": 4, "quantity": 1},
        {"productId": 1, "quantity": 3},
    ],
    # 削除を確かめるために追加する行を定義する（TC-API-CART-006）
    "delete_items": [
        {"productId": 4, "quantity": 1},
        {"productId": 1, "quantity": 1},
    ],
}
