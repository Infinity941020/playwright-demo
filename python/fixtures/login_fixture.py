"""ログイン状態を用意する fixture

責務:
    - standard_user でログインした状態（storage_state）を、テストの実行全体で1回だけ作る
    - ログイン済みの Page をテストへ渡す

保存したログイン状態（storage_state）を各テストで読み込んで使う。
テストのたびに画面からログインせずに済み、実行が速くなるため。
"""

from pathlib import Path
from typing import Iterator

import pytest
from playwright.sync_api import Browser, Page
from pytest_playwright import CreateContextCallback

from data.users import USERS
from pages.inventory_page import InventoryPage
from pages.login_page import LoginPage

_STORAGE_STATE_PATH = Path(__file__).resolve().parent.parent / ".auth" / "standard_user.json"


@pytest.fixture(scope="session")
def standard_user_storage_state(browser: Browser) -> Iterator[Path]:
    """standard_user でログインした状態（storage_state）を、テストの実行全体で1回だけ作る。"""
    _STORAGE_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)

    context = browser.new_context()
    page = context.new_page()

    login_page = LoginPage(page)
    login_page.goto()
    login_page.expect_on_login_page()
    login_page.login(USERS["standard"]["username"], USERS["standard"]["password"])
    InventoryPage(page).expect_on_page()

    context.storage_state(path=str(_STORAGE_STATE_PATH))
    context.close()

    yield _STORAGE_STATE_PATH


@pytest.fixture
def logged_page(
    new_context: CreateContextCallback, standard_user_storage_state: Path
) -> Iterator[Page]:
    """standard_user でログイン済みの Page を返す。

    pytest-playwrightのnew_context fixture経由で生成するため、
    --screenshot / --tracing / --video 等の設定が適用される。
    contextのクローズもnew_context fixture側で行われる。

    storage_stateはCookie/localStorageのみを復元し、遷移先URLまでは
    復元しないため、生成直後に商品一覧ページへ明示的に遷移させる。
    """
    context = new_context(storage_state=str(standard_user_storage_state))
    page = context.new_page()

    inventory_page = InventoryPage(page)
    inventory_page.goto()
    inventory_page.expect_on_page()

    yield page
