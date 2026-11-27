"""ログインユーザー情報

値は両版共通の shared/data/users.json に置いている（両版で同じ値を使うため）。
"""

from data.shared_data import load_shared_data

# 次のユーザーを定義している
#   standard：ログインに成功するユーザー
#   locked：ロックされていて、ログインできないユーザー
#   wrong_username_only：異常系のテストに使う（ユーザー名だけが誤り）
#   wrong_password_only：異常系のテストに使う（パスワードだけが誤り）
USERS = load_shared_data("users.json")
