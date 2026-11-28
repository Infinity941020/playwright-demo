"""ログインに使うユーザー名とパスワード。

値は両版共通の shared/data/users.json にある。
"""

from data.shared_data import load_shared_data

# 次の4つの組を持つ（左は JSON の鍵の名前）
# - standard：ログインに成功するユーザー
# - locked：ロックされていて、ログインできないユーザー
# - wrong_username_only：ユーザー名だけが誤っている組（存在しないユーザー名と、正しいパスワード）
# - wrong_password_only：パスワードだけが誤っている組（正しいユーザー名と、誤ったパスワード）
USERS = load_shared_data("users.json")
