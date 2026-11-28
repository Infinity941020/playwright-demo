"""Checkout の画面での操作と、その結果の確認を、利用者の操作の単位でまとめる。

- ボタンやアイコンを押す操作は、移った先の画面までは見ない。移った先は、呼び出す側で別に確かめる
- 前提の状態を作る操作は、開いた画面が表示されたことまで確かめる
"""

from playwright.sync_api import Page

from pages.cart_page import CartPage
from pages.checkout_page import CheckoutCompletePage, CheckoutStepOnePage, CheckoutStepTwoPage
from pages.header_component import HeaderComponent
from pages.inventory_page import InventoryPage


class CheckoutFlow:
    def __init__(self, page: Page) -> None:
        self._step_one_page = CheckoutStepOnePage(page)
        self._step_two_page = CheckoutStepTwoPage(page)
        self._complete_page = CheckoutCompletePage(page)
        self._header = HeaderComponent(page)
        # 前提の状態を作るためと、操作の後に移るカート画面の表示を確かめるために使う
        self._cart_page = CartPage(page)
        # 操作の後に移る Products画面・商品詳細画面の表示を確かめるために使う
        self._inventory_page = InventoryPage(page)

    def open_step_one_with(self, products: list[dict]) -> None:
        """渡した商品がカートに入った状態で、Checkout Step One画面を URL で開く。

        カートの中身は、ブラウザの保存領域への直接書き込みで作る
        （Products画面の不具合で、Checkout画面のテストまで失敗しないようにするため）。
        Step One画面は URL で開く（カート画面からの遷移は、カート画面のテストで確かめているため）。
        開いた後に、バッジの件数が入れた件数と同じことを確かめる
        （この画面には商品の行がなく、カートが空でも先へ進めるため、書き込みが効いたことをバッジで見る）。
        商品は、data/products.py にある商品（1商品分のまとまり）を渡す。
        """
        self._cart_page.set_cart_contents([product["id"] for product in products])
        self._step_one_page.goto()
        self._step_one_page.expect_on_page()
        self._header.expect_badge_count(len(products))

    def access_step_one_directly(self) -> None:
        """Checkout Step One画面の URL を開く。

        ログインしていないときの確認に使う。ログインしていないと Login画面が出るため、表示は見ない。
        """
        self._step_one_page.goto()

    def reload_step_one(self) -> None:
        """再読み込みして、Checkout Step One画面のままであることを確かめる。"""
        self._step_one_page.reload()
        self._step_one_page.expect_on_page()

    def fill_checkout_info(self, first_name: str, last_name: str, postal_code: str) -> None:
        self._step_one_page.fill_info(first_name, last_name, postal_code)

    def proceed_to_overview_step(self) -> None:
        """Continue を押す（入力が足りないときは、画面は移らない）。"""
        self._step_one_page.click_continue()

    def cancel_from_step_one(self) -> None:
        self._step_one_page.click_cancel()

    def close_error(self) -> None:
        self._step_one_page.close_error()

    def expect_on_step_one_page(self) -> None:
        self._step_one_page.expect_on_page()

    def expect_step_one_page_layout(self) -> None:
        """タイトル・3つの入力欄のプレースホルダー・Cancel・Continue が表示されていることを確かめる。"""
        self._step_one_page.expect_page_layout()

    def expect_error_message(self, message: str) -> None:
        self._step_one_page.expect_error_message(message)

    def expect_no_error(self) -> None:
        self._step_one_page.expect_no_error()

    def expect_info_values(self, first_name: str, last_name: str, postal_code: str) -> None:
        self._step_one_page.expect_info_values(first_name, last_name, postal_code)

    def open_step_two_with(self, products: list[dict], checkout_info: dict) -> None:
        """渡した商品がカートに入った状態で、購入者情報を入れて Continue を押し、Checkout Step Two画面を開く。

        Step Two の URL を直接開けることは、意図された仕様か不具合かを判断できない挙動のため、
        前提の状態を作るときには使わない（specs/checkout_step_two_testcases.md の「前提状態の作り方」）。
        購入者情報は、data/checkout_data.py の値を渡す。
        """
        self.open_step_one_with(products)
        self.fill_checkout_info(
            checkout_info["first_name"], checkout_info["last_name"], checkout_info["postal_code"]
        )
        self.proceed_to_overview_step()
        self._step_two_page.expect_on_page()

    def access_step_two_directly(self) -> None:
        """Checkout Step Two画面の URL を開く。

        ログインしていないときの確認に使う。ログインしていないと Login画面が出るため、表示は見ない。
        """
        self._step_two_page.goto()

    def reload_step_two(self) -> None:
        """再読み込みして、Checkout Step Two画面のままであることを確かめる。"""
        self._step_two_page.reload()
        self._step_two_page.expect_on_page()

    def complete_purchase(self) -> None:
        """Finish を押して購入を確定する。"""
        self._step_two_page.click_finish()

    def cancel_from_step_two(self) -> None:
        self._step_two_page.click_cancel()

    def open_product_detail(self, product_name: str) -> None:
        self._step_two_page.click_product_name(product_name)

    def expect_on_step_two_page(self) -> None:
        self._step_two_page.expect_on_page()

    def expect_step_two_page_layout(self) -> None:
        """タイトル・見出し・支払い／配送情報・金額の見出し・Cancel・Finish が表示されていることを確かめる。"""
        self._step_two_page.expect_page_layout()

    def expect_step_two_items_displayed(self, products: list[dict]) -> None:
        """Checkout Step Two画面の商品の表示を確かめる（行数、各行の表示項目、商品名と価格の組み合わせ）。"""
        self._step_two_page.expect_item_count(len(products))
        self._step_two_page.expect_all_item_elements_visible()
        for product in products:
            self._step_two_page.expect_item_price(product["name"], product["price"])

    def expect_step_two_item_names_in_order(self, product_names: list[str]) -> None:
        self._step_two_page.expect_item_names(product_names)

    def expect_step_two_item_count(self, count: int) -> None:
        self._step_two_page.expect_item_count(count)

    def expect_step_two_item_listed(self, product_name: str) -> None:
        """Checkout Step Two画面に、渡した商品の行があることを確かめる（並び順は問わない）。"""
        self._step_two_page.expect_item_listed(product_name)

    def expect_step_two_amounts(self, item_total: str, tax: str, total: str) -> None:
        self._step_two_page.expect_amounts(item_total, tax, total)

    def open_complete_with(self, products: list[dict], checkout_info: dict) -> None:
        """渡した商品がカートに入った状態から、Step One・Step Two を経て購入を完了し、Checkout Complete画面を開く。

        Complete の URL を直接開けることは、意図された仕様か不具合かを判断できない挙動のため、
        前提の状態を作るときには使わない（specs/checkout_complete_testcases.md の「前提状態の作り方」）。
        購入者情報は、data/checkout_data.py の値を渡す。
        """
        self.open_step_two_with(products, checkout_info)
        self.complete_purchase()
        self._complete_page.expect_on_page()

    def access_complete_directly(self) -> None:
        """Checkout Complete画面の URL を開く。

        ログインしていないときの確認に使う。ログインしていないと Login画面が出るため、表示は見ない。
        """
        self._complete_page.goto()

    def back_home(self) -> None:
        """Back Home を押して Products画面へ戻る。"""
        self._complete_page.click_back_home()

    def expect_on_checkout_complete_page(self) -> None:
        self._complete_page.expect_on_page()

    def expect_complete_page_layout(self) -> None:
        """タイトル・見出し・本文・画像・Back Home・Generate PDF order が表示されていることを確かめる。"""
        self._complete_page.expect_page_layout()

    def open_cart(self) -> None:
        """カートアイコンからカート画面を開く。"""
        self._header.click_cart_icon()

    def expect_badge_count(self, count: int) -> None:
        self._header.expect_badge_count(count)

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()

    def expect_on_product_detail_page(self, product_id: int) -> None:
        self._inventory_page.expect_on_product_detail_page(product_id)

    def expect_on_cart_page(self) -> None:
        self._cart_page.expect_on_page()

    def expect_cart_item_count(self, count: int) -> None:
        self._cart_page.expect_item_count(count)

    def expect_in_cart(self, product_name: str) -> None:
        """カートに、渡した商品の行があることを確かめる（並び順は問わない）。"""
        self._cart_page.expect_item_listed(product_name)
