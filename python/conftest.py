"""テストの前に pytest が読み込む設定。

- テストの準備の部品（ログイン済みの画面、API のモックのサーバー）を登録する
- API の返事の確認が失敗したときに、比べた値が表示されるようにする
"""

import pytest

# API の返事の確認（utils/api_assertions/）は、値を直接比べて確かめる。
# pytest は、失敗したときに比べた値を表示する仕組みを、テストのファイルとして集めたもの以外には入れないため、
# 読み込まれる前に対象に加える
pytest.register_assert_rewrite("utils.api_assertions")

pytest_plugins = ["fixtures.login_fixture", "fixtures.api_fixture"]
