"""Login UI Assertions

責務:
    - Login機能のUI検証
    - Flow経由で業務レベル検証を実施
"""

from flows.login_flow import LoginFlow


def expect_login_success(login_flow: LoginFlow) -> None:
    login_flow.expect_login_success()


def expect_login_error(login_flow: LoginFlow) -> None:
    login_flow.expect_login_error()


def expect_on_login_page(login_flow: LoginFlow) -> None:
    login_flow.expect_on_login_page()
