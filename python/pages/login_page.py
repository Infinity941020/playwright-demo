"""ログイン画面の入力欄・ボタンへの操作と、画面の表示の確認をまとめる。

- 画面を開く操作は、ほかの画面の開く操作とそろえて、表示までは見ない。表示は、呼び出す側で別に確かめる
- ログアウトした後のブラウザの「戻る」も、ここで押す
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
        self.page.goto(URLS["login"])

    def go_back(self) -> None:
        self.page.go_back()

    def enter_username(self, username: str) -> None:
        self.username_input.fill(username)

    def enter_password(self, password: str) -> None:
        self.password_input.fill(password)

    def click_login(self) -> None:
        self.login_button.click()

    def login(self, username: str, password: str) -> None:
        """ユーザー名とパスワードを入力して、ログインボタンを押す（空文字を渡すと、その欄は空になる）。"""
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()

    def expect_error_message(self, message: str) -> None:
        expect(self.error_message_locator).to_have_text(message)

    def expect_no_error(self) -> None:
        """エラー表示の要素そのものが画面にないことを確かめる。"""
        expect(self.error_message_locator).to_have_count(0)

    def expect_username_value(self, username: str) -> None:
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
