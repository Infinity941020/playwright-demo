"""Login UI Assertions

責務:
    - Login機能の表示や状態を検証する関数を提供する
    - 検証は Flow を通して行う（テストから Page Object を直接呼ばない）
"""

from flows.login_flow import LoginFlow


def expect_login_success(login_flow: LoginFlow) -> None:
    login_flow.expect_login_success()


def expect_login_error_message(login_flow: LoginFlow, message: str) -> None:
    login_flow.expect_login_error_message(message)


def expect_on_login_page(login_flow: LoginFlow) -> None:
    login_flow.expect_on_login_page()


def expect_username_retained(login_flow: LoginFlow, username: str) -> None:
    login_flow.expect_username_retained(username)


def expect_no_login_error(login_flow: LoginFlow) -> None:
    login_flow.expect_no_login_error()


def expect_login_inputs_empty(login_flow: LoginFlow) -> None:
    login_flow.expect_login_inputs_empty()
