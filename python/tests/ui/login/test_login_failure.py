"""ログイン異常系テスト"""

import pytest
from playwright.sync_api import Page

from data.users import USERS
from flows.login_flow import LoginFlow
from utils.ui_assertions.login_assertions import expect_login_error


class TestLoginFailure:
    """ログイン異常系確認"""

    @pytest.mark.parametrize(
        "user_key",
        ["wrong_username_only", "wrong_password_only"],
    )
    def test_single_field_wrong(self, page: Page, user_key: str) -> None:
        """TC-LOGIN-005/006: ユーザー名・パスワードのどちらか片方のみ誤り。"""
        login_flow = LoginFlow(page)

        login_flow.login(USERS[user_key]["username"], USERS[user_key]["password"])

        expect_login_error(login_flow)

    def test_missing_username(self, page: Page) -> None:
        """ID未入力。"""
        login_flow = LoginFlow(page)

        login_flow.login("", USERS["standard"]["password"])

        expect_login_error(login_flow)

    def test_missing_password(self, page: Page) -> None:
        """PW未入力。"""
        login_flow = LoginFlow(page)

        login_flow.login(USERS["standard"]["username"], "")

        expect_login_error(login_flow)

    def test_missing_username_and_password(self, page: Page) -> None:
        """ID・PW未入力。"""
        login_flow = LoginFlow(page)

        login_flow.login("", "")

        expect_login_error(login_flow)

    def test_locked_out_user(self, page: Page) -> None:
        """locked_out_user。"""
        login_flow = LoginFlow(page)

        login_flow.login(USERS["locked"]["username"], USERS["locked"]["password"])

        expect_login_error(login_flow)
