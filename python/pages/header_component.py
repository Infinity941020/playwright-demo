"""ヘッダー共通部品（Component）

責務:
    - カートアイコン・カートバッジの要素取得
    - 単体操作
    - バッジ件数の検証
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
        """カートバッジ件数検証（0件時は非表示）。"""
        if count == 0:
            expect(self.cart_badge).to_have_count(0)
        else:
            expect(self.cart_badge).to_have_text(str(count))
