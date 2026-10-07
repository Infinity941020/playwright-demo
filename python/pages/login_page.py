"""ログイン画面のUI操作（Page Object）

責務:
    - 要素取得
    - 単体操作
    - 画面レベルの検証
"""

import re

from playwright.sync_api import Locator, Page, expect

from utils.urls import URLS


class LoginPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.username_input: Locator = page.locator("#user-name")
        self.password_input: Locator = page.locator("#password")
        self.login_button: Locator = page.locator("#login-button")
        self.error_message_locator: Locator = page.locator('[data-test="error"]')

    def goto(self) -> None:
        """ログイン画面へ遷移する（表示確認は呼び出し側で expect_on_login_page() を呼ぶ）。"""
        self.page.goto(URLS["login"])

    def enter_username(self, username: str) -> None:
        self.username_input.fill(username)

    def enter_password(self, password: str) -> None:
        self.password_input.fill(password)

    def click_login(self) -> None:
        self.login_button.click()

    def login(self, username: str, password: str) -> None:
        """ログイン実行（業務単位）。"""
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()

    def expect_error_message(self, message: str) -> None:
        """エラー文言検証。"""
        expect(self.error_message_locator).to_have_text(message)

    def expect_username_value(self, username: str) -> None:
        """ユーザー名入力欄の値検証。"""
        expect(self.username_input).to_have_value(username)

    def expect_on_inventory_page(self) -> None:
        """ログイン成功後（商品一覧ページ）。"""
        expect(self.page).to_have_url(re.compile(r"inventory\.html"))
        expect(self.page.locator(".inventory_list")).to_be_visible()

    def expect_on_login_page(self) -> None:
        """ログイン画面表示確認。"""
        expect(self.page).to_have_url(URLS["login"])
        expect(self.login_button).to_be_visible()
        expect(self.username_input).to_be_visible()
        expect(self.password_input).to_be_visible()
