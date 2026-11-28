"""ログインの操作と、その結果の確認を、利用者の操作の単位でまとめる。

テストから画面の細かい操作を直接扱わずに済むようにする。
"""

from playwright.sync_api import Page

from pages.inventory_page import InventoryPage
from pages.login_page import LoginPage


class LoginFlow:
    def __init__(self, page: Page) -> None:
        self._login_page = LoginPage(page)
        # ログインに成功した後に移る、商品一覧画面の表示を確かめるために使う
        self._inventory_page = InventoryPage(page)

    def login(self, username: str, password: str) -> None:
        """ログイン画面を開いて表示を確かめてから、ログインする。"""
        self._login_page.goto()
        self._login_page.expect_on_login_page()
        self._login_page.login(username, password)

    def open_login_page(self) -> None:
        """ログイン画面を開いて、表示を確かめる（ログインはしない）。"""
        self._login_page.goto()
        self._login_page.expect_on_login_page()

    def expect_login_error_message(self, message: str) -> None:
        self._login_page.expect_error_message(message)

    def expect_username_retained(self, username: str) -> None:
        """ログインに失敗した後も、ユーザー名の入力値が残っていることを確かめる。"""
        self._login_page.expect_username_value(username)

    def expect_no_login_error(self) -> None:
        self._login_page.expect_no_error()

    def expect_login_inputs_empty(self) -> None:
        self._login_page.expect_inputs_empty()

    def expect_login_success(self) -> None:
        """ログインに成功し、商品一覧画面へ移っていることを確かめる。"""
        self._inventory_page.expect_on_page()

    def expect_on_login_page(self) -> None:
        self._login_page.expect_on_login_page()
