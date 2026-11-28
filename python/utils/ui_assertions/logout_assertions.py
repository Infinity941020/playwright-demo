"""左上のメニューの表示や状態を確かめる関数。

テストからは画面の部品を直接呼ばず、メニューの操作の単位を通して確かめる。
"""

from flows.logout_flow import LogoutFlow


def expect_menu_closed(logout_flow: LogoutFlow) -> None:
    logout_flow.expect_menu_closed()


def expect_menu_items(logout_flow: LogoutFlow, item_names: list[str]) -> None:
    logout_flow.expect_menu_items(item_names)


def expect_on_inventory_page(logout_flow: LogoutFlow) -> None:
    logout_flow.expect_on_inventory_page()
