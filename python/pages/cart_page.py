"""カート画面の操作と、画面の表示の確認をまとめる。

- 商品ごとの部分（ボタン・価格など）は、商品名でカートの行を探してから、その中で探す
- 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示を確かめる処理も呼ぶ
"""

import json
import re

from playwright.sync_api import Locator, Page, expect

from utils.urls import URLS


class CartPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.title: Locator = page.locator('[data-test="title"]')
        self.quantity_label: Locator = page.locator('[data-test="cart-quantity-label"]')
        self.description_label: Locator = page.locator('[data-test="cart-desc-label"]')
        self.continue_shopping_button: Locator = page.locator('[data-test="continue-shopping"]')
        self.checkout_button: Locator = page.locator('[data-test="checkout"]')
        # 削除した行は、見えない要素として画面に残るため、テスト用の属性で商品の行と決められている要素だけを数える
        self.cart_items: Locator = page.locator('[data-test="inventory-item"]')
        self.item_names: Locator = self.cart_items.locator('[data-test="inventory-item-name"]')

    def _item(self, product_name: str) -> Locator:
        """商品名が完全に一致するカートの行。"""
        name_pattern = re.compile(rf"^{re.escape(product_name)}$")
        return self.cart_items.filter(
            has=self.page.locator('[data-test="inventory-item-name"]', has_text=name_pattern)
        )

    def _remove_button(self, product_name: str) -> Locator:
        return self._item(product_name).get_by_role("button", name="Remove", exact=True)

    def goto(self) -> None:
        self.page.goto(URLS["cart"])

    def reload(self) -> None:
        self.page.reload()

    def set_cart_contents(self, product_ids: list[int]) -> None:
        """カートの中身を、ブラウザの保存領域に直接書き込む（テストの前提の状態を作るために使う）。

        SauceDemo が中で使っている保存名（cart-contents）と形（商品の番号の配列）に頼るため、書き込む処理はここだけに置く。
        保存領域はサイトごとに分かれるため、SauceDemo の画面を開いた状態で呼ぶ
        （ログイン済みの画面は、商品一覧画面を開いた状態で始まる）。
        """
        self.page.evaluate(
            "(value) => localStorage.setItem('cart-contents', value)",
            json.dumps(product_ids),
        )

    def remove_from_cart(self, product_name: str) -> None:
        self._remove_button(product_name).click()

    def click_continue_shopping(self) -> None:
        self.continue_shopping_button.click()

    def click_checkout(self) -> None:
        self.checkout_button.click()

    def click_product_name(self, product_name: str) -> None:
        self._item(product_name).locator('[data-test="inventory-item-name"]').click()

    def expect_on_page(self) -> None:
        """カート画面が表示されていることを確かめる。"""
        expect(self.page).to_have_url(URLS["cart"])
        expect(self.continue_shopping_button).to_be_visible()

    def expect_page_layout(self) -> None:
        """商品の有無に関係なく表示される項目（タイトル・一覧の見出し・ボタン）を確かめる。"""
        expect(self.title).to_have_text("Your Cart")
        expect(self.quantity_label).to_have_text("QTY")
        expect(self.description_label).to_have_text("Description")
        expect(self.continue_shopping_button).to_be_visible()
        expect(self.checkout_button).to_be_visible()

    def expect_item_count(self, count: int) -> None:
        expect(self.cart_items).to_have_count(count)

    def expect_all_item_elements_visible(self) -> None:
        """すべての行に、数量（1）・商品名・説明・価格・Remove ボタンが表示されていることを確かめる。"""
        expect(self.cart_items.first).to_be_visible()
        for item in self.cart_items.all():
            expect(item.locator('[data-test="item-quantity"]')).to_have_text("1")
            expect(item.locator('[data-test="inventory-item-name"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-desc"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-price"]')).to_be_visible()
            expect(item.get_by_role("button", name="Remove", exact=True)).to_be_visible()

    def expect_item_price(self, product_name: str, price: str) -> None:
        expect(self._item(product_name).locator('[data-test="inventory-item-price"]')).to_have_text(
            price
        )

    def expect_item_names(self, product_names: list[str]) -> None:
        """商品名が、渡した順に並んでいることを確かめる。"""
        expect(self.item_names).to_have_text(product_names)

    def expect_item_listed(self, product_name: str) -> None:
        expect(self._item(product_name)).to_have_count(1)
