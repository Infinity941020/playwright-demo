"""CheckoutFlow

責務:
    - 業務単位の操作のみ提供
    - specからUI詳細を隠蔽
    - CheckoutStepOnePage / CheckoutStepTwoPage / CartPage / HeaderComponent /
      InventoryPage依存をFlowで吸収
"""

from playwright.sync_api import Page

from pages.cart_page import CartPage
from pages.checkout_page import CheckoutStepOnePage, CheckoutStepTwoPage
from pages.header_component import HeaderComponent
from pages.inventory_page import InventoryPage


class CheckoutFlow:
    def __init__(self, page: Page) -> None:
        self._step_one_page = CheckoutStepOnePage(page)
        self._step_two_page = CheckoutStepTwoPage(page)
        self._header = HeaderComponent(page)
        # 前提状態の作成と、遷移先（カート画面）の表示確認用
        self._cart_page = CartPage(page)
        # 遷移先（商品一覧・商品詳細）の表示確認用
        self._inventory_page = InventoryPage(page)

    # 業務操作

    def open_step_one_with(self, products: list[dict]) -> None:
        """指定した商品がカートに入った状態で、Checkout Step One画面をURLで直接開く。

        前提状態はブラウザの保存領域への直接書き込みで作る（decisions.md 論点15）。
        商品は data/products.py の PRODUCTS の要素を渡す。
        """
        self._cart_page.set_cart_contents([product["id"] for product in products])
        self._step_one_page.goto()
        self._step_one_page.expect_on_page()

    def open_step_two_with(self, products: list[dict], checkout_info: dict) -> None:
        """指定した商品がカートに入った状態で、Step One を経由して Checkout Step Two画面を開く。

        Step Two のURLを直接開けることは、意図された仕様か不具合かを判断できない挙動のため、
        前提状態の作成では使わない（checkout_step_two_testcases.md「前提状態の作り方」参照）。
        購入者情報は data/checkout_data.py の CHECKOUT_DATA を渡す。
        """
        self.open_step_one_with(products)
        self.fill_checkout_info(
            checkout_info["first_name"], checkout_info["last_name"], checkout_info["postal_code"]
        )
        self.proceed_to_overview_step()
        self._step_two_page.expect_on_page()

    def access_step_one_directly(self) -> None:
        """Checkout Step One画面のURLへ直接アクセスする（表示確認なし。未ログイン時の検証用）。"""
        self._step_one_page.goto()

    def access_step_two_directly(self) -> None:
        """Checkout Step Two画面のURLへ直接アクセスする（表示確認なし。未ログイン時の検証用）。"""
        self._step_two_page.goto()

    def reload_step_two(self) -> None:
        """Checkout Step Two画面を再読み込みする。"""
        self._step_two_page.reload()
        self._step_two_page.expect_on_page()

    def reload_step_one(self) -> None:
        """Checkout Step One画面を再読み込みする。"""
        self._step_one_page.reload()
        self._step_one_page.expect_on_page()

    def fill_checkout_info(self, first_name: str, last_name: str, postal_code: str) -> None:
        self._step_one_page.fill_info(first_name, last_name, postal_code)

    def proceed_to_overview_step(self) -> None:
        """Continue を押す（入力チェックのエラー時は画面遷移しない）。"""
        self._step_one_page.click_continue()

    def cancel_from_step_one(self) -> None:
        self._step_one_page.click_cancel()

    def close_error(self) -> None:
        self._step_one_page.close_error()

    def complete_purchase(self) -> None:
        """Finish を押して購入を確定する。"""
        self._step_two_page.click_finish()

    def cancel_from_step_two(self) -> None:
        self._step_two_page.click_cancel()

    def open_product_detail(self, product_name: str) -> None:
        self._step_two_page.click_product_name(product_name)

    def open_cart(self) -> None:
        """カートアイコンからカート画面を開く。"""
        self._header.click_cart_icon()

    # 検証（業務レベル）

    def expect_on_step_one_page(self) -> None:
        self._step_one_page.expect_on_page()

    def expect_step_one_page_layout(self) -> None:
        """タイトル・3つの入力欄（プレースホルダー）・Cancel・Continue が表示されていること。"""
        self._step_one_page.expect_page_layout()

    def expect_error_message(self, message: str) -> None:
        self._step_one_page.expect_error_message(message)

    def expect_no_error(self) -> None:
        self._step_one_page.expect_no_error()

    def expect_info_values(self, first_name: str, last_name: str, postal_code: str) -> None:
        self._step_one_page.expect_info_values(first_name, last_name, postal_code)

    def expect_badge_count(self, count: int) -> None:
        self._header.expect_badge_count(count)

    def expect_on_step_two_page(self) -> None:
        self._step_two_page.expect_on_page()

    def expect_step_two_page_layout(self) -> None:
        """タイトル・見出し・支払い／配送情報・金額の見出し・Cancel・Finish が表示されていること。"""
        self._step_two_page.expect_page_layout()

    def expect_step_two_items_displayed(self, products: list[dict]) -> None:
        """Step Two の商品の表示検証（行数・各行の表示項目・商品名と価格の組み合わせ）。"""
        self._step_two_page.expect_item_count(len(products))
        self._step_two_page.expect_all_item_elements_visible()
        for product in products:
            self._step_two_page.expect_item_price(product["name"], product["price"])

    def expect_step_two_item_names_in_order(self, product_names: list[str]) -> None:
        self._step_two_page.expect_item_names(product_names)

    def expect_step_two_item_count(self, count: int) -> None:
        self._step_two_page.expect_item_count(count)

    def expect_step_two_item_listed(self, product_name: str) -> None:
        """Step Two に指定した商品の行があること（並び順は問わない）。"""
        self._step_two_page.expect_item_listed(product_name)

    def expect_step_two_amounts(self, item_total: str, tax: str, total: str) -> None:
        self._step_two_page.expect_amounts(item_total, tax, total)

    def expect_on_checkout_complete_page(self) -> None:
        self._step_two_page.expect_on_checkout_complete_page()

    def expect_on_inventory_page(self) -> None:
        self._inventory_page.expect_on_page()

    def expect_on_product_detail_page(self, product_id: int) -> None:
        self._inventory_page.expect_on_product_detail_page(product_id)

    def expect_on_cart_page(self) -> None:
        self._cart_page.expect_on_page()

    def expect_cart_item_count(self, count: int) -> None:
        self._cart_page.expect_item_count(count)

    def expect_in_cart(self, product_name: str) -> None:
        """カート内に指定した商品の行があること（並び順は問わない）。"""
        self._cart_page.expect_item_listed(product_name)
