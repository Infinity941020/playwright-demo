"""サイドメニューの Page Object

責務:
    - 画面の要素（ロケータ）を定義する
    - ボタンを押す・キーを押すなど、要素1つに対する操作を提供する
    - メニューの開閉状態と項目を検証する

メニューの開閉は aria-hidden 属性で判定する（decisions.md 論点17）。
URLで開いた直後は、閉じているメニューの項目も「表示されている」と判定されるため、
表示の有無では開閉を判定できない。
"""

from playwright.sync_api import Locator, Page, expect


class MenuPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        # 開閉ボタン自体には data-test がないため、id で特定する
        self.menu_button: Locator = page.locator("#react-burger-menu-btn")
        self.close_button: Locator = page.locator("#react-burger-cross-btn")
        # メニュー領域には id・data-test がないため、CSS クラスで特定する
        self.menu_area: Locator = page.locator(".bm-menu-wrap")
        # data-test が -sidebar-link で終わる項目のみを対象とする。Dynamic Catalog を
        # 開くと表示される子項目（dynamic-catalog-lazy-load-link 等）は末尾が
        # -sidebar-link ではないため含まない
        self.menu_items: Locator = page.locator('[data-test$="-sidebar-link"]')
        self.all_items_link: Locator = page.locator('[data-test="inventory-sidebar-link"]')
        self.logout_link: Locator = page.locator('[data-test="logout-sidebar-link"]')

    # 画面の要素1つに対する操作（押す・入力するなど）を行う。

    def wait_until_menu_closed(self) -> None:
        """閉じたメニューの項目が見えなくなるまで待つ。

        画面を開いた直後の、メニューが閉じる動きの間に開くと、開いた扱いなのに
        項目が隠れたままになるため（decisions.md 論点17）。
        """
        expect(self.menu_items.first).to_be_hidden()

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

    # メニューの開閉状態や項目を検証する。

    def expect_menu_opened(self) -> None:
        """メニューが開いていることを、aria-hidden と最初の項目の表示の両方で確かめる。"""
        expect(self.menu_area).to_have_attribute("aria-hidden", "false")
        expect(self.menu_items.first, "メニューは開いた扱いだが項目が表示されない（logout_spec.md の判断できない挙動）").to_be_visible()

    def expect_menu_closed(self) -> None:
        expect(self.menu_area).to_have_attribute("aria-hidden", "true")

    def expect_menu_items(self, item_names: list[str]) -> None:
        """メニューの項目が指定した順に並び、すべて表示されていることを確かめる。"""
        expect(self.menu_items).to_have_text(item_names)
        for item in self.menu_items.all():
            expect(item).to_be_visible()
