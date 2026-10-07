"""LoginFlow

責務:
    - 業務単位の操作のみ提供
    - specからUI詳細を隠蔽
    - LoginPage依存をFlowで吸収
"""

from playwright.sync_api import Page

from pages.login_page import LoginPage


class LoginFlow:
    def __init__(self, page: Page) -> None:
        self._login_page = LoginPage(page)

    # 業務操作

    def login(self, username: str, password: str) -> None:
        """ログイン実行（業務操作）。"""
        self._login_page.goto()
        self._login_page.login(username, password)

    # 検証（業務レベル）

    def expect_login_error(self) -> None:
        """ログイン失敗検証。"""
        self._login_page.expect_error_visible()

    def expect_login_success(self) -> None:
        """ログイン成功検証。"""
        self._login_page.expect_on_inventory_page()

    def expect_on_login_page(self) -> None:
        """ログイン画面表示確認。"""
        self._login_page.expect_on_login_page()
