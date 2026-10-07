"""InventoryFlow

責務:
    - 業務単位の操作のみ提供
    - specからUI詳細を隠蔽
    - InventoryPage / HeaderComponent依存をFlowで吸収
"""

from typing import Literal

from playwright.sync_api import Page

from pages.header_component import HeaderComponent
from pages.inventory_page import InventoryPage


class InventoryFlow:
    def __init__(self, page: Page) -> None:
        self._inventory_page = InventoryPage(page)
        self._header = HeaderComponent(page)

    # 業務操作

    def access_inventory_directly(self) -> None:
        """商品一覧画面のURLへ直接アクセスする（表示確認なし。未ログイン時の検証用）。"""
        self._inventory_page.goto()

    def reload_inventory(self) -> None:
        """商品一覧画面を再読み込みする。"""
        self._inventory_page.reload()
        self._inventory_page.expect_on_page()

    def sort_by(self, option_label: str) -> None:
        self._inventory_page.select_sort(option_label)

    def add_to_cart(self, product_name: str) -> None:
        self._inventory_page.add_to_cart(product_name)

    def remove_from_cart(self, product_name: str) -> None:
        self._inventory_page.remove_from_cart(product_name)

    def open_product_detail(self, product_name: str, via: Literal["name", "image"]) -> None:
        """商品名または商品画像から商品詳細画面を開く。"""
        if via == "name":
            self._inventory_page.click_product_name(product_name)
        else:
            self._inventory_page.click_product_image(product_name)

    def open_cart(self) -> None:
        """カートアイコンからカート画面を開く。"""
        self._header.click_cart_icon()

    # 検証（業務レベル）

    def expect_products_displayed(self, products: list[dict]) -> None:
        """商品一覧の表示検証（件数・各商品の表示項目・商品名と価格の組み合わせ）。"""
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

    def expect_in_cart(self, product_name: str) -> None:
        """カート追加済み（ボタンがRemove）であること。"""
        self._inventory_page.expect_remove_button(product_name)

    def expect_not_in_cart(self, product_name: str) -> None:
        """カート未追加（ボタンがAdd to cart）であること。"""
        self._inventory_page.expect_add_to_cart_button(product_name)

    def expect_badge_count(self, count: int) -> None:
        self._header.expect_badge_count(count)

    def expect_on_product_detail_page(self, product_id: int) -> None:
        self._inventory_page.expect_on_product_detail_page(product_id)

    def expect_on_cart_page(self) -> None:
        self._inventory_page.expect_on_cart_page()
