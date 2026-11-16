"""python/ 直下の conftest（pytest がテストの前に読み込む設定）

責務:
    - fixture を定義したモジュールを登録する
    - APIの確認関数（utils/api_assertions/）の assert を、失敗時に値が表示される形にする
"""

import pytest

# utils/api_assertions/ は assert で値を直接確かめる（decisions.md 論点6・9）。
# テストファイル以外の assert は pytest の書き換えの対象外で、失敗時に値が表示されないため、
# import される前に書き換えの対象として登録する。
pytest.register_assert_rewrite("utils.api_assertions")

pytest_plugins = ["fixtures.login_fixture", "fixtures.api_fixture"]
