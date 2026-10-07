"""ログイン異常系テスト"""

import pytest
from playwright.sync_api import Page

from data.users import USERS
from flows.login_flow import LoginFlow
from utils.ui_assertions.login_assertions import (
    expect_login_error_message,
    expect_on_login_page,
    expect_username_retained,
)

# エラー文言（login_testcases.md の期待結果どおり）
_USERNAME_REQUIRED_MESSAGE = "Epic sadface: Username is required"
_PASSWORD_REQUIRED_MESSAGE = "Epic sadface: Password is required"
_CREDENTIALS_MISMATCH_MESSAGE = (
    "Epic sadface: Username and password do not match any user in this service"
)
_LOCKED_OUT_MESSAGE = "Epic sadface: Sorry, this user has been locked out."


class TestLoginFailure:
    """ログイン異常系確認"""

    def test_missing_username(self, page: Page) -> None:
        """TC-LOGIN-002: ユーザー名未入力でログイン失敗すること。"""
        login_flow = LoginFlow(page)

        # 業務操作（ユーザー名未入力でログイン）
        login_flow.login("", USERS["standard"]["password"])

        # 検証（業務レベル）
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _USERNAME_REQUIRED_MESSAGE)

    def test_missing_password(self, page: Page) -> None:
        """TC-LOGIN-003: パスワード未入力でログイン失敗すること。"""
        login_flow = LoginFlow(page)

        # 業務操作（パスワード未入力でログイン）
        login_flow.login(USERS["standard"]["username"], "")

        # 検証（業務レベル）
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _PASSWORD_REQUIRED_MESSAGE)

    def test_missing_username_and_password(self, page: Page) -> None:
        """TC-LOGIN-004: ユーザー名・パスワード両方未入力でログイン失敗すること（ユーザー名側優先）。"""
        login_flow = LoginFlow(page)

        # 業務操作（両方未入力でログイン）
        login_flow.login("", "")

        # 検証（業務レベル）
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _USERNAME_REQUIRED_MESSAGE)

    @pytest.mark.parametrize(
        "user_key",
        ["wrong_username_only", "wrong_password_only"],
        ids=["TC-LOGIN-005", "TC-LOGIN-006"],
    )
    def test_single_field_wrong(self, page: Page, user_key: str) -> None:
        """TC-LOGIN-005/006: ユーザー名・パスワードのどちらか片方のみ誤りでログイン失敗すること。"""
        login_flow = LoginFlow(page)

        # 業務操作（片方のみ誤りでログイン）
        login_flow.login(USERS[user_key]["username"], USERS[user_key]["password"])

        # 検証（業務レベル）
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _CREDENTIALS_MISMATCH_MESSAGE)

    def test_locked_out_user(self, page: Page) -> None:
        """TC-LOGIN-007: ロック済みユーザーでログイン失敗すること。"""
        login_flow = LoginFlow(page)

        # 業務操作（ロック済みユーザーでログイン）
        login_flow.login(USERS["locked"]["username"], USERS["locked"]["password"])

        # 検証（業務レベル）
        expect_on_login_page(login_flow)
        expect_login_error_message(login_flow, _LOCKED_OUT_MESSAGE)

    def test_username_retained_after_failure(self, page: Page) -> None:
        """TC-LOGIN-008: ログイン失敗後、ユーザー名の入力値が保持されること。"""
        login_flow = LoginFlow(page)
        username = USERS["standard"]["username"]

        # 業務操作（パスワード未入力でログイン）
        login_flow.login(username, "")

        # 検証（業務レベル）
        expect_username_retained(login_flow, username)
