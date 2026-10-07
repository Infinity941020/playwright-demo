"""商品情報（Products画面）"""

# 仕様書「表示商品」の表の順（初期表示 = Name (A to Z) の並び）で定義する。
# 商品IDは商品詳細画面のURL（inventory-item.html?id=）で実機確認済み（2026-10-07）。
PRODUCTS = {
    "backpack": {
        "name": "Sauce Labs Backpack",
        "price": "$29.99",
        "id": 4,
    },
    "bike_light": {
        "name": "Sauce Labs Bike Light",
        "price": "$9.99",
        "id": 0,
    },
    "bolt_t_shirt": {
        "name": "Sauce Labs Bolt T-Shirt",
        "price": "$15.99",
        "id": 1,
    },
    "fleece_jacket": {
        "name": "Sauce Labs Fleece Jacket",
        "price": "$49.99",
        "id": 5,
    },
    "onesie": {
        "name": "Sauce Labs Onesie",
        "price": "$7.99",
        "id": 2,
    },
    "red_t_shirt": {
        "name": "Test.allTheThings() T-Shirt (Red)",
        "price": "$15.99",
        "id": 3,
    },
}

# ソート選択肢（画面の表示文言）
SORT_OPTIONS = {
    "name_asc": "Name (A to Z)",
    "name_desc": "Name (Z to A)",
    "price_asc": "Price (low to high)",
    "price_desc": "Price (high to low)",
}
