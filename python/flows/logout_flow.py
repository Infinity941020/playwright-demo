"""LogoutFlow

責務:
    - 「ログインする」「カートに入れる」など、利用者の操作の単位でまとめた処理だけを提供する
    - テストから画面の細かい操作（ロケータなど）を直接扱わずに済むようにする
    - MenuPage・LoginPage・InventoryPage の呼び出しは Flow の中で行う
"""

from playwright.sync_api import Page

from pages.inventory_page import InventoryPage
from pages.login_page import LoginPage
from pages.menu_page import MenuPage


class LogoutFlow:
    def __init__(self, page: Page) -> None:
        self._menu_page = MenuPage(page)
        self._login_page = LoginPage(page)
        # 操作の後に移る商品一覧画面の表示を確かめるために使う
        self._inventory_page = InventoryPage(page)

    # 利用者の操作の単位で、画面を操作する。

    def open_menu(self) -> None:
        """メニューを開き、開いたことを確認する（aria-hidden と最初の項目の表示で判定。decisions.md 論点17）。"""
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
        """メニューを開いて Logout を押し、Login画面へ戻ったことを確認する。"""
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

    # 画面の状態を検証する。

    def expect_menu_closed(self) -> None:
        self._menu_page.expect_menu_closed()

    def expect_menu_items(self, item_names: list[str]) -> None:
        self._menu_page.expect_menu_items(item_names)

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()
