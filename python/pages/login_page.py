"""ログイン画面の Page Object

責務:
    - 画面の要素（ロケータ）を定義する
    - ボタンを押す・入力するなど、要素1つに対する操作を提供する
    - 画面の表示や状態を検証する
"""

from playwright.sync_api import Locator, Page, expect

from utils.urls import URLS


class LoginPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.username_input: Locator = page.locator('[data-test="username"]')
        self.password_input: Locator = page.locator('[data-test="password"]')
        self.login_button: Locator = page.locator('[data-test="login-button"]')
        self.error_message_locator: Locator = page.locator('[data-test="error"]')

    def goto(self) -> None:
        """ログイン画面へ遷移する（表示の確認は、呼び出す側で expect_on_login_page() を呼んで行う）。"""
        self.page.goto(URLS["login"])

    def go_back(self) -> None:
        """ブラウザの「戻る」を押す。"""
        self.page.go_back()

    def enter_username(self, username: str) -> None:
        self.username_input.fill(username)

    def enter_password(self, password: str) -> None:
        self.password_input.fill(password)

    def click_login(self) -> None:
        self.login_button.click()

    def login(self, username: str, password: str) -> None:
        """ユーザー名とパスワードを入力し、ログインボタンを押す。"""
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()

    def expect_error_message(self, message: str) -> None:
        """エラーの文言を検証する。"""
        expect(self.error_message_locator).to_have_text(message)

    def expect_no_error(self) -> None:
        """エラーが表示されていないことを確かめる。"""
        expect(self.error_message_locator).to_have_count(0)

    def expect_username_value(self, username: str) -> None:
        """ユーザー名の入力欄の値を検証する。"""
        expect(self.username_input).to_have_value(username)

    def expect_inputs_empty(self) -> None:
        """ユーザー名・パスワードの入力欄が空であることを確かめる。"""
        expect(self.username_input).to_have_value("")
        expect(self.password_input).to_have_value("")

    def expect_on_login_page(self) -> None:
        """ログイン画面が表示されていることを確かめる。"""
        expect(self.page).to_have_url(URLS["login"])
        expect(self.login_button).to_be_visible()
        expect(self.username_input).to_be_visible()
        expect(self.password_input).to_be_visible()
