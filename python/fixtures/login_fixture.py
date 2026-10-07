"""ログインfixture

責務:
    - standard_userのstorage_stateをセッション内で1回だけ生成する
    - ログイン済みPageをテストへ提供する

論点1（storageState未配線）の決定に基づき、TS版とは異なりstorage_state
を正式に配線する。詳細は python/decisions.md の論点1を参照。
"""

from pathlib import Path
from typing import Iterator

import pytest
from playwright.sync_api import Browser, Page, expect

from data.users import USERS
from pages.login_page import LoginPage
from utils.urls import URLS

_STORAGE_STATE_PATH = Path(__file__).resolve().parent.parent / ".auth" / "standard_user.json"


@pytest.fixture(scope="session")
def standard_user_storage_state(browser: Browser) -> Iterator[Path]:
    """standard_userでログイン済みのstorage_stateをセッション内で1回だけ生成する。"""
    _STORAGE_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)

    context = browser.new_context()
    page = context.new_page()

    login_page = LoginPage(page)
    login_page.goto()
    login_page.login(USERS["standard"]["username"], USERS["standard"]["password"])
    login_page.expect_on_inventory_page()

    context.storage_state(path=str(_STORAGE_STATE_PATH))
    context.close()

    yield _STORAGE_STATE_PATH


@pytest.fixture
def logged_page(browser: Browser, standard_user_storage_state: Path) -> Iterator[Page]:
    """standard_userでログイン済みのPageを返す。

    storage_stateはCookie/localStorageのみを復元し、遷移先URLまでは
    復元しないため、生成直後に商品一覧ページへ明示的に遷移させる。
    """
    context = browser.new_context(storage_state=str(standard_user_storage_state))
    page = context.new_page()

    page.goto(URLS["inventory"])
    expect(page.locator(".inventory_list")).to_be_visible()

    yield page

    context.close()
