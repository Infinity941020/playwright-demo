"""Logout UI Assertions

責務:
    - Logout機能（左上のメニュー）のUI検証
    - Flow経由で業務レベル検証を実施
"""

from flows.logout_flow import LogoutFlow


def expect_menu_closed(logout_flow: LogoutFlow) -> None:
    logout_flow.expect_menu_closed()


def expect_menu_items(logout_flow: LogoutFlow, item_names: list[str]) -> None:
    logout_flow.expect_menu_items(item_names)


def expect_on_inventory_page(logout_flow: LogoutFlow) -> None:
    logout_flow.expect_on_inventory_page()
