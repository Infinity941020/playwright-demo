"""ログイン機能の正常系テスト（業務フロー単位でのE2Eテスト）"""

from playwright.sync_api import Page

from data.users import USERS
from flows.login_flow import LoginFlow
from utils.ui_assertions.login_assertions import expect_login_success


def test_login_success_shows_inventory(page: Page) -> None:
    """TC-LOGIN-001: 正しいユーザー名・パスワードでログインできること。"""
    login_flow = LoginFlow(page)

    # 業務操作（ログイン実行）
    login_flow.login(USERS["standard"]["username"], USERS["standard"]["password"])

    # 検証（業務レベル）
    expect_login_success(login_flow)
