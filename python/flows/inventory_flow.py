"""商品一覧画面での操作と、その結果の確認を、利用者の操作の単位でまとめる。

テストから画面の細かい操作を直接扱わずに済むようにする。
"""

from typing import Literal

from playwright.sync_api import Page

from pages.cart_page import CartPage
from pages.header_component import HeaderComponent
from pages.inventory_page import InventoryPage


class InventoryFlow:
    def __init__(self, page: Page) -> None:
        self._inventory_page = InventoryPage(page)
        self._header = HeaderComponent(page)
        # 操作の後に移るカート画面の表示を確かめるために使う
        self._cart_page = CartPage(page)

    def access_inventory_directly(self) -> None:
        """商品一覧画面の URL を開く（表示は確かめないので、確かめるときは続けて表示を確かめる処理も呼ぶ）。"""
        self._inventory_page.goto()

    def access_product_detail_directly(self, product_id: int) -> None:
        """商品詳細画面の URL を開く（表示は確かめないので、確かめるときは続けて表示を確かめる処理も呼ぶ）。"""
        self._inventory_page.goto_product_detail(product_id)

    def reload_inventory(self) -> None:
        """再読み込みして、商品一覧画面のままであることを確かめる。"""
        self._inventory_page.reload()
        self._inventory_page.expect_on_page()

    def sort_by(self, option_label: str) -> None:
        self._inventory_page.select_sort(option_label)

    def add_to_cart(self, product_name: str) -> None:
        self._inventory_page.add_to_cart(product_name)

    def remove_from_cart(self, product_name: str) -> None:
        self._inventory_page.remove_from_cart(product_name)

    def open_product_detail(self, product_name: str, via: Literal["name", "image"]) -> None:
        """商品名または商品画像から、商品詳細画面を開く。"""
        if via == "name":
            self._inventory_page.click_product_name(product_name)
        else:
            self._inventory_page.click_product_image(product_name)

    def open_cart(self) -> None:
        """カートアイコンからカート画面を開く。"""
        self._header.click_cart_icon()

    def expect_products_displayed(self, products: list[dict]) -> None:
        """商品一覧の表示を確かめる（件数、各商品の表示項目、商品名と価格の組み合わせ）。"""
        self._inventory_page.expect_product_count(len(products))
        self._inventory_page.expect_all_product_elements_visible()
        for product in products:
            self._inventory_page.expect_product_price(product["name"], product["price"])

    def expect_product_names_in_order(self, product_names: list[str]) -> None:
        self._inventory_page.expect_product_names(product_names)

    def expect_product_prices_in_order(self, prices: list[str]) -> None:
        self._inventory_page.expect_product_prices(prices)

    def expect_selected_sort(self, option_label: str) -> None:
        self._inventory_page.expect_selected_sort(option_label)

    def expect_remove_button_shown(self, product_name: str) -> None:
        """渡した商品のボタンが Remove と表示されていることを確かめる（カートに追加済みの状態）。"""
        self._inventory_page.expect_remove_button(product_name)

    def expect_add_to_cart_button_shown(self, product_name: str) -> None:
        """渡した商品のボタンが Add to cart と表示されていることを確かめる（カートに追加していない状態）。"""
        self._inventory_page.expect_add_to_cart_button(product_name)

    def expect_badge_count(self, count: int) -> None:
        self._header.expect_badge_count(count)

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()

    def expect_on_product_detail_page(self, product_id: int) -> None:
        self._inventory_page.expect_on_product_detail_page(product_id)

    def expect_on_cart_page(self) -> None:
        self._cart_page.expect_on_page()
