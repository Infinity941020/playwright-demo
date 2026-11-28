"""左上のメニューでの操作（開閉・ログアウト・All Items）と、その結果の確認を、利用者の操作の単位でまとめる。

- メニューの項目を押す操作は、必ずメニューを開き、開いたことを確かめてから押す
- ログアウトする操作は、ログイン画面へ戻ったことまで確かめる。ほかの押す操作は、移った先の画面を確かめない
"""

from playwright.sync_api import Page

from pages.inventory_page import InventoryPage
from pages.login_page import LoginPage
from pages.menu_page import MenuPage


class LogoutFlow:
    def __init__(self, page: Page) -> None:
        self._menu_page = MenuPage(page)
        self._login_page = LoginPage(page)
        # All Items を押した後に移る、商品一覧画面の表示を確かめるために使う
        self._inventory_page = InventoryPage(page)

    def open_menu(self) -> None:
        """メニューを開き、開いたことを、aria-hidden 属性と最初の項目の表示の両方で確かめる。

        開いた扱い（aria-hidden 属性が false）でも、項目が隠れたままのことがあるため
        （specs/logout_spec.md の「実機で確認したが、意図された仕様か不具合かを判断できない挙動」）。
        """
        self._menu_page.wait_until_menu_closed()
        self._menu_page.click_menu_button()
        self._menu_page.expect_menu_opened()

    def close_menu_with_button(self) -> None:
        """×ボタンでメニューを閉じる。"""
        self._menu_page.click_close_button()

    def close_menu_with_escape(self) -> None:
        """Esc キーでメニューを閉じる。"""
        self._menu_page.press_escape()

    def logout(self) -> None:
        """メニューを開いて Logout を押し、ログイン画面へ戻ったことを確かめる。"""
        self.open_menu()
        self._menu_page.click_logout()
        self._login_page.expect_on_login_page()

    def open_all_items(self) -> None:
        """メニューを開いて All Items を押す。"""
        self.open_menu()
        self._menu_page.click_all_items()

    def go_back_in_browser(self) -> None:
        """ログアウト後に、ブラウザの「戻る」を押す。"""
        self._login_page.go_back()

    def expect_menu_closed(self) -> None:
        self._menu_page.expect_menu_closed()

    def expect_menu_items(self, item_names: list[str]) -> None:
        self._menu_page.expect_menu_items(item_names)

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()
