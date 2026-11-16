"""各画面に共通のヘッダーの部品（Component）

責務:
    - カートアイコンとカートのバッジの要素（ロケータ）を定義する
    - カートアイコンを押す操作を提供する
    - バッジの件数を検証する
"""

from playwright.sync_api import Locator, Page, expect


class HeaderComponent:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.cart_link: Locator = page.locator('[data-test="shopping-cart-link"]')
        self.cart_badge: Locator = page.locator('[data-test="shopping-cart-badge"]')

    def click_cart_icon(self) -> None:
        self.cart_link.click()

    def expect_badge_count(self, count: int) -> None:
        """カートのバッジの件数を検証する（0件のときは、バッジが表示されていないことを確かめる）。"""
        if count == 0:
            expect(self.cart_badge).to_have_count(0)
        else:
            expect(self.cart_badge).to_have_text(str(count))
