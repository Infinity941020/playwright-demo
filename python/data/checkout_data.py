"""購入者情報（Checkout画面）

値は両版共通の shared/data/checkout.json に置いている（両版で同じ値を使うため）。
"""

from data.shared_data import load_shared_data

# 値は checkout_step_one_testcases.md の「入力に使う値」と同じにする
CHECKOUT_DATA = load_shared_data("checkout.json")
