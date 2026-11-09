"""LogoutFlow

責務:
    - 業務単位の操作のみ提供
    - specからUI詳細を隠蔽
    - MenuPage / LoginPage / InventoryPage依存をFlowで吸収
"""

from playwright.sync_api import Page

from pages.inventory_page import InventoryPage
from pages.login_page import LoginPage
from pages.menu_page import MenuPage


class LogoutFlow:
    def __init__(self, page: Page) -> None:
        self._menu_page = MenuPage(page)
        self._login_page = LoginPage(page)
        # 遷移先（商品一覧）の表示確認用
        self._inventory_page = InventoryPage(page)

    # 業務操作

    def open_menu(self) -> None:
        """メニューを開き、開いたことを確認する（aria-hidden で判定。decisions.md 論点17）。"""
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

    # 検証（業務レベル）

    def expect_menu_closed(self) -> None:
        self._menu_page.expect_menu_closed()

    def expect_menu_items(self, item_names: list[str]) -> None:
        self._menu_page.expect_menu_items(item_names)

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()
