"""Checkout Step One画面で入力する購入者情報（名・姓・郵便番号）。

値は両版共通の shared/data/checkout.json にある。
"""

from data.shared_data import load_shared_data

# 値は specs/checkout_step_one_testcases.md の「入力に使う値」と同じにする
CHECKOUT_DATA = load_shared_data("checkout.json")
