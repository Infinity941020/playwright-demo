"""商品一覧画面の操作と、画面の表示の確認をまとめる。

- 商品ごとの部分（ボタン・価格など）は、並べ替えで並び順が変わっても同じ商品を操作できるように、
  商品名で商品のカードを探してから、その中で探す
- 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示を確かめる処理も呼ぶ
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

    def _item(self, product_name: str) -> Locator:
        """商品名が完全に一致する商品のカード。"""
        name_pattern = re.compile(rf"^{re.escape(product_name)}$")
        return self.inventory_items.filter(
            has=self.page.locator('[data-test="inventory-item-name"]', has_text=name_pattern)
        )

    def _add_to_cart_button(self, product_name: str) -> Locator:
        return self._item(product_name).get_by_role("button", name="Add to cart", exact=True)

    def _remove_button(self, product_name: str) -> Locator:
        return self._item(product_name).get_by_role("button", name="Remove", exact=True)

    def goto(self) -> None:
        self.page.goto(URLS["inventory"])

    def goto_product_detail(self, product_id: int) -> None:
        self.page.goto(f"{URLS['inventory_item']}?id={product_id}")

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

    def expect_on_page(self) -> None:
        """商品一覧画面が表示されていることを確かめる。"""
        expect(self.page).to_have_url(URLS["inventory"])
        expect(self.inventory_list).to_be_visible()

    def expect_product_count(self, count: int) -> None:
        expect(self.inventory_items).to_have_count(count)

    def expect_all_product_elements_visible(self) -> None:
        """すべての商品に、画像・商品名・説明・価格・Add to cart ボタンが表示されていることを確かめる。"""
        expect(self.inventory_items.first).to_be_visible()
        for item in self.inventory_items.all():
            expect(item.locator('img[data-test$="-img"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-name"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-desc"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-price"]')).to_be_visible()
            expect(item.get_by_role("button", name="Add to cart", exact=True)).to_be_visible()

    def expect_product_price(self, product_name: str, price: str) -> None:
        expect(self._item(product_name).locator('[data-test="inventory-item-price"]')).to_have_text(
            price
        )

    def expect_product_names(self, product_names: list[str]) -> None:
        """商品名が、渡した順に並んでいることを確かめる。"""
        expect(self.item_names).to_have_text(product_names)

    def expect_product_prices(self, prices: list[str]) -> None:
        """価格が、渡した順に並んでいることを確かめる。"""
        expect(self.item_prices).to_have_text(prices)

    def expect_selected_sort(self, option_label: str) -> None:
        expect(self.active_sort_option).to_have_text(option_label)

    def expect_add_to_cart_button(self, product_name: str) -> None:
        expect(self._add_to_cart_button(product_name)).to_be_visible()

    def expect_remove_button(self, product_name: str) -> None:
        expect(self._remove_button(product_name)).to_be_visible()

    def expect_on_product_detail_page(self, product_id: int) -> None:
        """商品詳細画面へ移ったことを確かめる（画面の中身は確かめない）。"""
        expect(self.page).to_have_url(f"{URLS['inventory_item']}?id={product_id}")
