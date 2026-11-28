"""カート画面での操作と、その結果の確認を、利用者の操作の単位でまとめる。

テストから画面の細かい操作を直接扱わずに済むようにする。
"""

from playwright.sync_api import Page

from pages.cart_page import CartPage
from pages.checkout_page import CheckoutStepOnePage
from pages.header_component import HeaderComponent
from pages.inventory_page import InventoryPage


class CartFlow:
    def __init__(self, page: Page) -> None:
        self._cart_page = CartPage(page)
        self._header = HeaderComponent(page)
        # 操作の後に移る Products画面・商品詳細画面の表示を確かめるために使う
        self._inventory_page = InventoryPage(page)
        # 操作の後に移る Checkout Step One画面の表示を確かめるために使う
        self._checkout_step_one_page = CheckoutStepOnePage(page)

    def open_cart_with(self, products: list[dict]) -> None:
        """渡した商品が、渡した順にカートに入った状態で、カート画面を開く。

        前提の状態は、ブラウザの保存領域への直接書き込みで作る
        （Products画面の不具合で、カート画面のテストまで失敗しないようにするため）。
        開いた後に、行の数が入れた件数と同じことを確かめる
        （書き込みが効かずに、空のカートのままテストが進まないように）。
        商品は、data/products.py にある商品（1商品分のまとまり）を渡す。
        """
        self._cart_page.set_cart_contents([product["id"] for product in products])
        self._cart_page.goto()
        self._cart_page.expect_on_page()
        self._cart_page.expect_item_count(len(products))

    def access_cart_directly(self) -> None:
        """カート画面の URL を開く。

        ログインしていないときの確認に使う。ログインしていないと Login画面が出るため、表示は確かめない。
        """
        self._cart_page.goto()

    def reload_cart(self) -> None:
        """再読み込みして、カート画面のままであることを確かめる。"""
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

    def expect_cart_page_layout(self) -> None:
        """タイトル・一覧の見出し・Continue Shopping・Checkout が表示されていることを確かめる。"""
        self._cart_page.expect_page_layout()

    def expect_item_count(self, count: int) -> None:
        self._cart_page.expect_item_count(count)

    def expect_items_displayed(self, products: list[dict]) -> None:
        """カートの表示を確かめる（行数、各行の表示項目、商品名と価格の組み合わせ）。"""
        self._cart_page.expect_item_count(len(products))
        self._cart_page.expect_all_item_elements_visible()
        for product in products:
            self._cart_page.expect_item_price(product["name"], product["price"])

    def expect_item_names_in_order(self, product_names: list[str]) -> None:
        self._cart_page.expect_item_names(product_names)

    def expect_in_cart(self, product_name: str) -> None:
        """カートに、渡した商品の行があることを確かめる（並び順は問わない）。"""
        self._cart_page.expect_item_listed(product_name)

    def expect_badge_count(self, count: int) -> None:
        self._header.expect_badge_count(count)

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()

    def expect_on_checkout_step_one_page(self) -> None:
        self._checkout_step_one_page.expect_on_page()

    def expect_on_product_detail_page(self, product_id: int) -> None:
        self._inventory_page.expect_on_product_detail_page(product_id)
