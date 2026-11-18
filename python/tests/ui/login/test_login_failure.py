"""ログイン異常系テスト"""

import pytest
from playwright.sync_api import Page

from data.messages import MESSAGES
from data.users import USERS
from flows.login_flow import LoginFlow
from utils.ui_assertions.login_assertions import (
    expect_login_error_message,
    expect_on_login_page,
    expect_username_retained,
)

# エラーの文言（shared/data/messages.json）は、login_testcases.md の期待結果と同じにする
_USERNAME_REQUIRED_MESSAGE = MESSAGES["login"]["username_required"]
_PASSWORD_REQUIRED_MESSAGE = MESSAGES["login"]["password_required"]
_CREDENTIALS_MISMATCH_MESSAGE = MESSAGES["login"]["credentials_mismatch"]
_LOCKED_OUT_MESSAGE = MESSAGES["login"]["locked_out"]


class TestLoginFailure:
    """ログインの異常系を確かめる。"""

    def test_missing_username(self, page: Page) -> None:
        """TC-LOGIN-002: ユーザー名を入力せずにログインすると、失敗すること。"""
        login_flow = LoginFlow(page)

        # ユーザー名を入力せずにログインする
        login_flow.login("", USERS["standard"]["password"])

        # 結果を検証する
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _USERNAME_REQUIRED_MESSAGE)

    def test_missing_password(self, page: Page) -> None:
        """TC-LOGIN-003: パスワードを入力せずにログインすると、失敗すること。"""
        login_flow = LoginFlow(page)

        # パスワードを入力せずにログインする
        login_flow.login(USERS["standard"]["username"], "")

        # 結果を検証する
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _PASSWORD_REQUIRED_MESSAGE)

    def test_missing_username_and_password(self, page: Page) -> None:
        """TC-LOGIN-004: ユーザー名・パスワードの両方が空だと、ユーザー名のエラーでログインに失敗すること。"""
        login_flow = LoginFlow(page)

        # ユーザー名もパスワードも入力せずにログインする
        login_flow.login("", "")

        # 結果を検証する
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _USERNAME_REQUIRED_MESSAGE)

    @pytest.mark.parametrize(
        "user_key",
        ["wrong_username_only", "wrong_password_only"],
        ids=["TC-LOGIN-005", "TC-LOGIN-006"],
    )
    def test_single_field_wrong(self, page: Page, user_key: str) -> None:
        """TC-LOGIN-005/006: ユーザー名・パスワードのどちらか片方だけが誤っていると、ログインに失敗すること。"""
        login_flow = LoginFlow(page)

        # ユーザー名かパスワードの片方だけを誤って、ログインする
        login_flow.login(USERS[user_key]["username"], USERS[user_key]["password"])

        # 結果を検証する
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _CREDENTIALS_MISMATCH_MESSAGE)

    def test_locked_out_user(self, page: Page) -> None:
        """TC-LOGIN-007: ロックされたユーザーでは、ログインに失敗すること。"""
        login_flow = LoginFlow(page)

        # ロックされたユーザーでログインする
        login_flow.login(USERS["locked"]["username"], USERS["locked"]["password"])

        # 結果を検証する
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _LOCKED_OUT_MESSAGE)

    def test_username_retained_after_failure(self, page: Page) -> None:
        """TC-LOGIN-008: ログイン失敗後、ユーザー名の入力値が保持されること。"""
        login_flow = LoginFlow(page)
        username = USERS["standard"]["username"]

        # パスワードを入力せずにログインする
        login_flow.login(username, "")

        # ログインの失敗を確かめてから、入力値を検証する
        expect_login_error_message(login_flow, _PASSWORD_REQUIRED_MESSAGE)
        expect_username_retained(login_flow, username)
