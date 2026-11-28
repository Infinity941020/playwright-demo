"""ログインに使うユーザー名とパスワード。

値は両版共通の shared/data/users.json にある。
"""

from data.shared_data import load_shared_data

# ログインに成功するユーザー、ロックされていてログインできないユーザー、
# ユーザー名だけが誤っている組、パスワードだけが誤っている組を持つ
USERS = load_shared_data("users.json")
