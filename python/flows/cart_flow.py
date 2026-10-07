"""CartFlow

責務:
    - 業務単位の操作のみ提供
    - specからUI詳細を隠蔽
    - CartPage / HeaderComponent / InventoryPage依存をFlowで吸収
"""

from playwright.sync_api import Page

from pages.cart_page import CartPage
from pages.header_component import HeaderComponent
from pages.inventory_page import InventoryPage


class CartFlow:
    def __init__(self, page: Page) -> None:
        self._cart_page = CartPage(page)
        self._header = HeaderComponent(page)
        # 遷移先（商品一覧・商品詳細）の表示確認用
        self._inventory_page = InventoryPage(page)

    # 業務操作

    def open_cart_with(self, products: list[dict]) -> None:
        """指定した商品が、指定した順にカートに入った状態でカート画面を開く。

        前提状態はブラウザの保存領域への直接書き込みで作る（decisions.md 論点15）。
        商品は data/products.py の PRODUCTS の要素を渡す。
        """
        self._cart_page.set_cart_contents([product["id"] for product in products])
        self._cart_page.goto()
        self._cart_page.expect_on_page()

    def access_cart_directly(self) -> None:
        """カート画面のURLへ直接アクセスする（表示確認なし。未ログイン時の検証用）。"""
        self._cart_page.goto()

    def reload_cart(self) -> None:
        """カート画面を再読み込みする。"""
        self._cart_page.reload()
        self._cart_page.expect_on_page()

    def remove_from_cart(self, product_name: str) -> None:
        self._cart_page.remove_from_cart(product_name)

    def continue_shopping(self) -> None:
        self._cart_page.click_continue_shopping()

    def checkout(self) -> None:
        self._cart_page.click_checkout()

    def open_product_detail(self, product_name: str) -> None:
        self._cart_page.click_product_name(product_name)

    # 検証（業務レベル）

    def expect_cart_page_layout(self) -> None:
        """タイトル・一覧の見出し・Continue Shopping・Checkout が表示されていること。"""
        self._cart_page.expect_page_layout()

    def expect_item_count(self, count: int) -> None:
        self._cart_page.expect_item_count(count)

    def expect_items_displayed(self, products: list[dict]) -> None:
        """カート内の表示検証（行数・各行の表示項目・商品名と価格の組み合わせ）。"""
        self._cart_page.expect_item_count(len(products))
        self._cart_page.expect_all_item_elements_visible()
        for product in products:
            self._cart_page.expect_item_price(product["name"], product["price"])

    def expect_item_names_in_order(self, product_names: list[str]) -> None:
        self._cart_page.expect_item_names(product_names)

    def expect_in_cart(self, product_name: str) -> None:
        """カート内に指定した商品の行があること（並び順は問わない）。"""
        self._cart_page.expect_item_listed(product_name)

    def expect_badge_count(self, count: int) -> None:
        self._header.expect_badge_count(count)

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()

    def expect_on_checkout_step_one_page(self) -> None:
        self._cart_page.expect_on_checkout_step_one_page()

    def expect_on_product_detail_page(self, product_id: int) -> None:
        self._inventory_page.expect_on_product_detail_page(product_id)
