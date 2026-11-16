"""Logout UI Assertions

責務:
    - Logout機能（左上のメニュー）の表示や状態を検証する関数を提供する
    - 検証は Flow を通して行う（テストから Page Object を直接呼ばない）
"""

from flows.logout_flow import LogoutFlow


def expect_menu_closed(logout_flow: LogoutFlow) -> None:
    logout_flow.expect_menu_closed()


def expect_menu_items(logout_flow: LogoutFlow, item_names: list[str]) -> None:
    logout_flow.expect_menu_items(item_names)


def expect_on_inventory_page(logout_flow: LogoutFlow) -> None:
    logout_flow.expect_on_inventory_page()
