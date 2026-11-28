"""ログイン画面の表示や状態を確かめる関数。

テストからは画面の部品を直接呼ばず、ログインの操作の単位を通して確かめる。
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
