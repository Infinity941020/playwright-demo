"""商品一覧画面のUI操作（Page Object）

責務:
    - 要素取得
    - 単体操作
    - 画面レベルの検証
"""

import re

from playwright.sync_api import Locator, Page, expect

from utils.urls import URLS


class InventoryPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.inventory_list: Locator = page.locator('[data-test="inventory-list"]')
        self.inventory_items: Locator = page.locator('[data-test="inventory-item"]')
        self.item_names: Locator = page.locator('[data-test="inventory-item-name"]')
        self.item_prices: Locator = page.locator('[data-test="inventory-item-price"]')
        self.sort_select: Locator = page.locator('[data-test="product-sort-container"]')
        self.active_sort_option: Locator = page.locator('[data-test="active-option"]')

    # 商品ごとに変わる部品（商品名で特定する）

    def _item(self, product_name: str) -> Locator:
        """商品名に完全一致する商品カードを返す。"""
        name_pattern = re.compile(rf"^{re.escape(product_name)}$")
        return self.inventory_items.filter(
            has=self.page.locator('[data-test="inventory-item-name"]', has_text=name_pattern)
        )

    def _add_to_cart_button(self, product_name: str) -> Locator:
        return self._item(product_name).get_by_role("button", name="Add to cart", exact=True)

    def _remove_button(self, product_name: str) -> Locator:
        return self._item(product_name).get_by_role("button", name="Remove", exact=True)

    # 単体操作

    def goto(self) -> None:
        """商品一覧画面へ遷移する（表示確認は呼び出し側で expect_on_page() を呼ぶ）。"""
        self.page.goto(URLS["inventory"])

    def reload(self) -> None:
        self.page.reload()

    def select_sort(self, option_label: str) -> None:
        self.sort_select.select_option(label=option_label)

    def add_to_cart(self, product_name: str) -> None:
        self._add_to_cart_button(product_name).click()

    def remove_from_cart(self, product_name: str) -> None:
        self._remove_button(product_name).click()

    def click_product_name(self, product_name: str) -> None:
        self._item(product_name).locator('[data-test="inventory-item-name"]').click()

    def click_product_image(self, product_name: str) -> None:
        self._item(product_name).locator('a[data-test$="-img-link"]').click()

    # 画面レベルの検証

    def expect_on_page(self) -> None:
        """商品一覧画面表示確認。"""
        expect(self.page).to_have_url(URLS["inventory"])
        expect(self.inventory_list).to_be_visible()

    def expect_product_count(self, count: int) -> None:
        expect(self.inventory_items).to_have_count(count)

    def expect_all_product_elements_visible(self) -> None:
        """全商品に「画像／商品名／説明／価格／Add to cartボタン」が表示されていること。"""
        for item in self.inventory_items.all():
            expect(item.locator("img.inventory_item_img")).to_be_visible()
            expect(item.locator('[data-test="inventory-item-name"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-desc"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-price"]')).to_be_visible()
            expect(item.get_by_role("button", name="Add to cart", exact=True)).to_be_visible()

    def expect_product_price(self, product_name: str, price: str) -> None:
        expect(self._item(product_name).locator('[data-test="inventory-item-price"]')).to_have_text(
            price
        )

    def expect_product_names(self, product_names: list[str]) -> None:
        """商品名の並び順検証。"""
        expect(self.item_names).to_have_text(product_names)

    def expect_product_prices(self, prices: list[str]) -> None:
        """価格の並び順検証。"""
        expect(self.item_prices).to_have_text(prices)

    def expect_selected_sort(self, option_label: str) -> None:
        expect(self.active_sort_option).to_have_text(option_label)

    def expect_add_to_cart_button(self, product_name: str) -> None:
        expect(self._add_to_cart_button(product_name)).to_be_visible()

    def expect_remove_button(self, product_name: str) -> None:
        expect(self._remove_button(product_name)).to_be_visible()

    def expect_on_product_detail_page(self, product_id: int) -> None:
        """商品詳細画面への遷移確認（画面の中身は対象外）。"""
        expect(self.page).to_have_url(f"{URLS['inventory_item']}?id={product_id}")

    def expect_on_cart_page(self) -> None:
        """カート画面への遷移確認。"""
        expect(self.page).to_have_url(URLS["cart"])
