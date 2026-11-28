"""ログインに使うユーザー名とパスワード。

値は両版共通の shared/data/users.json にある。
"""

from data.shared_data import load_shared_data

# 次の4つの組を持つ
# - ログインに成功するユーザー（standard_user）
# - ロックされていて、ログインできないユーザー（locked_out_user）
# - ユーザー名だけが誤っている組（存在しないユーザー名と、正しいパスワード）
# - パスワードだけが誤っている組（standard_user と、誤ったパスワード）
USERS = load_shared_data("users.json")
