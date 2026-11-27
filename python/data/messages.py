"""画面に表示されるエラー文言

値は両版共通の shared/data/messages.json に置いている（両版で同じ値を使うため）。
文言は、各画面の testcases.md の期待結果と同じにする。

login の not_logged_in は、画面のパスを {path} に差し込んで使う
（例：MESSAGES["login"]["not_logged_in"].format(path="/cart.html")）。
"""

from data.shared_data import load_shared_data

MESSAGES = load_shared_data("messages.json")
