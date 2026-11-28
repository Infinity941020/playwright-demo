"""画面に表示されるエラーの文言。

値は両版共通の shared/data/messages.json にある。文言は、各画面のテストケースの期待結果と同じにする。
ログインせずに画面を開いたときの文言は、{path} の部分に、開いた画面のパス（例：/cart.html）を入れて使う。
"""

from data.shared_data import load_shared_data

MESSAGES = load_shared_data("messages.json")
