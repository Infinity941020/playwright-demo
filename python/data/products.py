"""商品情報（Products画面）

値は両版共通の shared/data/products.json に置いている。
"""

from data.shared_data import load_shared_data

_PRODUCTS_DATA = load_shared_data("products.json")

# 仕様書「表示商品」の表の順（初期表示 = Name (A to Z) の並び）で定義している。
# 商品IDは商品詳細画面のURL（inventory-item.html?id=）で実機確認済み（2026-10-07）。
PRODUCTS = _PRODUCTS_DATA["products"]

# ソートの選択肢を、画面に表示される文言で定義している
SORT_OPTIONS = _PRODUCTS_DATA["sort_options"]
