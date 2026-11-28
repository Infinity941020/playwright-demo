"""テストの前に pytest が読み込む設定。

- テストの準備の部品（ログイン済みの画面、API のモックのサーバー）を登録する
- API の返事の確認が失敗したときに、比べた値が表示されるようにする
- 見た目の比較の基準画像を撮るオプション（--update-snapshots）を足す
"""

import pytest

from utils.visual_assertions.screenshot_assertions import set_update_snapshots

# API の返事の確認（utils/api_assertions/）は、値を直接比べて確かめる。
# pytest は、失敗したときに比べた値を表示する仕組みを、テストのファイルや conftest など、
# pytest が自分で読み込むものにしか入れないため、読み込まれる前に対象に加える
pytest.register_assert_rewrite("utils.api_assertions")

pytest_plugins = ["fixtures.login_fixture", "fixtures.api_fixture"]


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--update-snapshots",
        action="store_true",
        default=False,
        help="見た目の比較で、比べずに撮って、基準画像（shared/visual/）に書く",
    )


def pytest_configure(config: pytest.Config) -> None:
    # 見た目の比較の部品はテストから直接呼ばれ、pytest の設定を受け取らないため、ここで指定を渡す
    set_update_snapshots(config.getoption("--update-snapshots"))
