"""Products画面に表示される商品と、ソートの選択肢。

値は両版共通の shared/data/products.json にある。
"""

from data.shared_data import load_shared_data

_PRODUCTS_DATA = load_shared_data("products.json")

# specs/products_spec.md の「表示商品（初期表示順）」の表の順（初期表示の Name (A to Z) の並び）。
# 各商品の番号は、商品詳細画面の URL（inventory-item.html?id=）に付く番号
PRODUCTS = _PRODUCTS_DATA["products"]

# ソートの選択肢（画面に表示される文言）
SORT_OPTIONS = _PRODUCTS_DATA["sort_options"]
