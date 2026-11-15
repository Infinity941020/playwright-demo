"""LoginFlow

責務:
    - 業務単位の操作のみ提供
    - specからUI詳細を隠蔽
    - LoginPage / InventoryPage依存をFlowで吸収
"""

from playwright.sync_api import Page

from pages.inventory_page import InventoryPage
from pages.login_page import LoginPage


class LoginFlow:
    def __init__(self, page: Page) -> None:
        self._login_page = LoginPage(page)
        # 遷移先（商品一覧）の表示確認用
        self._inventory_page = InventoryPage(page)

    # 業務操作

    def login(self, username: str, password: str) -> None:
        """ログイン実行（業務操作）。"""
        self._login_page.goto()
        self._login_page.expect_on_login_page()
        self._login_page.login(username, password)

    # 検証（業務レベル）

    def expect_login_error_message(self, message: str) -> None:
        """ログイン画面のエラー文言検証。"""
        self._login_page.expect_error_message(message)

    def expect_username_retained(self, username: str) -> None:
        """ログイン失敗後のユーザー名入力値保持検証。"""
        self._login_page.expect_username_value(username)

    def expect_no_login_error(self) -> None:
        """ログイン画面にエラーが表示されていないこと。"""
        self._login_page.expect_no_error()

    def expect_login_inputs_empty(self) -> None:
        """ユーザー名・パスワードの入力欄が空であること。"""
        self._login_page.expect_inputs_empty()

    def expect_login_success(self) -> None:
        """ログイン成功検証（商品一覧画面へ遷移していること）。"""
        self._inventory_page.expect_on_page()

    def expect_on_login_page(self) -> None:
        """ログイン画面表示確認。"""
        self._login_page.expect_on_login_page()
