"""左上のメニューの操作と、メニューの開閉・項目の確認をまとめる。

URL で開いた直後は、メニューが閉じる動きが終わるまで、閉じている項目も表示されていると判定されるため、
開閉はメニュー領域の aria-hidden 属性で判定する。
"""

from playwright.sync_api import Locator, Page, expect


class MenuPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        # 開くボタンと閉じるボタンには data-test 属性がないため、id 属性で探す
        self.menu_button: Locator = page.locator("#react-burger-menu-btn")
        self.close_button: Locator = page.locator("#react-burger-cross-btn")
        # メニュー領域には id 属性も data-test 属性もないため、class 属性の値で探す
        self.menu_area: Locator = page.locator(".bm-menu-wrap")
        # Dynamic Catalog を開くと出る子の項目を含めないように、
        # data-test 属性の値が「-sidebar-link」で終わる項目だけを探す
        self.menu_items: Locator = page.locator('[data-test$="-sidebar-link"]')
        self.all_items_link: Locator = page.locator('[data-test="inventory-sidebar-link"]')
        self.logout_link: Locator = page.locator('[data-test="logout-sidebar-link"]')

    def wait_until_menu_closed(self) -> None:
        """閉じたメニューの項目が見えなくなるまで待つ。

        画面を開いた直後の、メニューが閉じる動きの間に開くと、開いた扱いなのに項目が隠れたままになるため。
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

    def expect_menu_opened(self) -> None:
        """メニューが開いていることを、aria-hidden 属性と最初の項目の表示の両方で確かめる。

        開いた扱い（aria-hidden 属性が false）でも、項目が隠れたままのことがあるため
        （specs/logout_spec.md の「実機で確認したが、意図された仕様か不具合かを判断できない挙動」）。
        """
        expect(self.menu_area).to_have_attribute("aria-hidden", "false")
        expect(
            self.menu_items.first,
            "メニューは開いた扱いだが項目が表示されない（logout_spec.md の判断できない挙動）",
        ).to_be_visible()

    def expect_menu_closed(self) -> None:
        expect(self.menu_area).to_have_attribute("aria-hidden", "true")

    def expect_menu_items(self, item_names: list[str]) -> None:
        """メニューの項目が、渡した順に並び、すべて見えていることを確かめる。"""
        expect(self.menu_items).to_have_text(item_names)
        for item in self.menu_items.all():
            expect(item).to_be_visible()
