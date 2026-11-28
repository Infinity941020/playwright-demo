"""ログイン済みの画面（商品一覧画面を開いた状態）をテストに渡す。

standard_user でログインした状態（Cookie などの保存内容）を、テストの実行全体で1回だけ作ってファイルに保存し、
各テストで読み込む。テストのたびに画面からログインすると遅くなるため。
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
    """standard_user でログインした状態を、テストの実行全体で1回だけ作って保存し、そのファイルの場所を渡す。"""
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
    """standard_user でログイン済みの画面を渡す。

    閲覧環境は、pytest-playwright が用意する作り方で作る。
    実行のときに指定した、画面の保存・記録（トレース）・録画の設定を、このテストにも効かせるため。
    """
    context = new_context(storage_state=str(standard_user_storage_state))
    page = context.new_page()

    inventory_page = InventoryPage(page)
    inventory_page.goto()
    inventory_page.expect_on_page()

    yield page
