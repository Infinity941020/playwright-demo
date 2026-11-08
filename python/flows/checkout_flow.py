"""CheckoutFlow

責務:
    - 業務単位の操作のみ提供
    - specからUI詳細を隠蔽
    - CheckoutStepOnePage / CartPage / HeaderComponent依存をFlowで吸収
"""

from playwright.sync_api import Page

from pages.cart_page import CartPage
from pages.checkout_page import CheckoutStepOnePage
from pages.header_component import HeaderComponent


class CheckoutFlow:
    def __init__(self, page: Page) -> None:
        self._step_one_page = CheckoutStepOnePage(page)
        self._header = HeaderComponent(page)
        # 前提状態の作成と、遷移先（カート画面）の表示確認用
        self._cart_page = CartPage(page)

    # 業務操作

    def open_step_one_with(self, products: list[dict]) -> None:
        """指定した商品がカートに入った状態で、Checkout Step One画面をURLで直接開く。

        前提状態はブラウザの保存領域への直接書き込みで作る（decisions.md 論点15）。
        商品は data/products.py の PRODUCTS の要素を渡す。
        """
        self._cart_page.set_cart_contents([product["id"] for product in products])
        self._step_one_page.goto()
        self._step_one_page.expect_on_page()

    def access_step_one_directly(self) -> None:
        """Checkout Step One画面のURLへ直接アクセスする（表示確認なし。未ログイン時の検証用）。"""
        self._step_one_page.goto()

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
        self._step_one_page.expect_on_checkout_step_two_page()

    def expect_on_cart_page(self) -> None:
        self._cart_page.expect_on_page()

    def expect_cart_item_count(self, count: int) -> None:
        self._cart_page.expect_item_count(count)

    def expect_in_cart(self, product_name: str) -> None:
        """カート内に指定した商品の行があること（並び順は問わない）。"""
        self._cart_page.expect_item_listed(product_name)
