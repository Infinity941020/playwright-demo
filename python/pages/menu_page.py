"""サイドメニューのUI操作（Page Object）

責務:
    - 要素取得
    - 単体操作
    - 開閉状態・項目の検証

メニューの開閉は aria-hidden 属性で判定する（decisions.md 論点17）。
URLで開いた直後は、閉じているメニューの項目も「表示されている」と判定されるため、
表示の有無では開閉を判定できない。
"""

from playwright.sync_api import Locator, Page, expect


class MenuPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.menu_button: Locator = page.locator("#react-burger-menu-btn")
        self.close_button: Locator = page.locator("#react-burger-cross-btn")
        # メニュー領域には id・data-test がないため、CSS クラスで特定する
        self.menu_area: Locator = page.locator(".bm-menu-wrap")
        # Dynamic Catalog の子項目（data-test が -link で終わる）は含まない
        self.menu_items: Locator = page.locator('[data-test$="-sidebar-link"]')
        self.all_items_link: Locator = page.locator('[data-test="inventory-sidebar-link"]')
        self.logout_link: Locator = page.locator('[data-test="logout-sidebar-link"]')

    # 単体操作

    def click_menu_button(self) -> None:
        self.menu_button.click()

    def click_close_button(self) -> None:
        self.close_button.click()

    def press_escape(self) -> None:
        self.page.keyboard.press("Escape")

    def click_all_items(self) -> None:
        self.all_items_link.click()

    def click_logout(self) -> None:
        self.logout_link.click()

    # 検証

    def expect_menu_opened(self) -> None:
        expect(self.menu_area).to_have_attribute("aria-hidden", "false")

    def expect_menu_closed(self) -> None:
        expect(self.menu_area).to_have_attribute("aria-hidden", "true")

    def expect_menu_items(self, item_names: list[str]) -> None:
        """メニューの項目の並び順検証。"""
        expect(self.menu_items).to_have_text(item_names)
