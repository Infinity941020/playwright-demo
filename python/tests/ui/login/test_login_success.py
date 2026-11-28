"""ログインの正常系のテスト（ログインの手順を、画面で最初から最後まで通す）"""

from playwright.sync_api import Page

from data.users import USERS
from flows.login_flow import LoginFlow
from utils.ui_assertions.login_assertions import expect_login_success


class TestLoginSuccess:
    """ログインの正常系を確かめる。"""

    def test_login_success_shows_inventory(self, page: Page) -> None:
        """TC-LOGIN-001: 正しいユーザー名・パスワードでログインできること。"""
        login_flow = LoginFlow(page)

        login_flow.login(USERS["standard"]["username"], USERS["standard"]["password"])

        expect_login_success(login_flow)
