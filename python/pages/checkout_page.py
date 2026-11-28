"""Checkout の3つの画面（Step One・Step Two・Complete）の操作と、画面の表示の確認をまとめる。

- クラスは画面ごとに分ける（ほかの画面と同じく、1画面1クラスにするため）
- 商品ごとの部分は、商品名で商品の行を探してから、その中で探す
- 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示を確かめる処理も呼ぶ
"""

import re

from playwright.sync_api import Locator, Page, expect

from utils.urls import URLS


class CheckoutStepOnePage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.title: Locator = page.locator('[data-test="title"]')
        self.first_name_input: Locator = page.locator('[data-test="firstName"]')
        self.last_name_input: Locator = page.locator('[data-test="lastName"]')
        self.postal_code_input: Locator = page.locator('[data-test="postalCode"]')
        self.cancel_button: Locator = page.locator('[data-test="cancel"]')
        self.continue_button: Locator = page.locator('[data-test="continue"]')
        self.error_message_locator: Locator = page.locator('[data-test="error"]')
        self.error_close_button: Locator = page.locator('[data-test="error-button"]')

    def goto(self) -> None:
        self.page.goto(URLS["checkout_step_one"])

    def reload(self) -> None:
        self.page.reload()

    def fill_info(self, first_name: str, last_name: str, postal_code: str) -> None:
        """購入者情報を入力する（空文字を渡すと、その欄は空欄になる）。"""
        self.first_name_input.fill(first_name)
        self.last_name_input.fill(last_name)
        self.postal_code_input.fill(postal_code)

    def click_continue(self) -> None:
        """Continue を押す。

        入力欄で Enter キーを押すと Continue ではなく Cancel が動くため、必ずボタンを押す
        （specs/checkout_step_one_spec.md の「実機で確認したが、意図された仕様か不具合かを判断できない挙動」）。
        """
        self.continue_button.click()

    def click_cancel(self) -> None:
        self.cancel_button.click()

    def close_error(self) -> None:
        self.error_close_button.click()

    def expect_on_page(self) -> None:
        """Checkout Step One画面が表示されていることを確かめる。"""
        expect(self.page).to_have_url(URLS["checkout_step_one"])
        expect(self.continue_button).to_be_visible()

    def expect_page_layout(self) -> None:
        """タイトル・3つの入力欄のプレースホルダー・2つのボタンを確かめる。"""
        expect(self.title).to_have_text("Checkout: Your Information")
        expect(self.first_name_input).to_be_visible()
        expect(self.first_name_input).to_have_attribute("placeholder", "First Name")
        expect(self.last_name_input).to_be_visible()
        expect(self.last_name_input).to_have_attribute("placeholder", "Last Name")
        expect(self.postal_code_input).to_be_visible()
        expect(self.postal_code_input).to_have_attribute("placeholder", "Zip/Postal Code")
        expect(self.cancel_button).to_be_visible()
        expect(self.cancel_button).to_have_text("Cancel")
        # Continue は、文言を要素の中の文字ではなく値として持つ作りのため、値で確かめる
        expect(self.continue_button).to_be_visible()
        expect(self.continue_button).to_have_value("Continue")

    def expect_error_message(self, message: str) -> None:
        expect(self.error_message_locator).to_have_text(message)

    def expect_no_error(self) -> None:
        """エラー表示の要素そのものが画面にないことを確かめる。"""
        expect(self.error_message_locator).to_have_count(0)

    def expect_info_values(self, first_name: str, last_name: str, postal_code: str) -> None:
        expect(self.first_name_input).to_have_value(first_name)
        expect(self.last_name_input).to_have_value(last_name)
        expect(self.postal_code_input).to_have_value(postal_code)


class CheckoutStepTwoPage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.title: Locator = page.locator('[data-test="title"]')
        self.quantity_label: Locator = page.locator('[data-test="cart-quantity-label"]')
        self.description_label: Locator = page.locator('[data-test="cart-desc-label"]')
        self.items: Locator = page.locator('[data-test="inventory-item"]')
        self.item_names: Locator = self.items.locator('[data-test="inventory-item-name"]')
        self.payment_label: Locator = page.locator('[data-test="payment-info-label"]')
        self.payment_value: Locator = page.locator('[data-test="payment-info-value"]')
        self.shipping_label: Locator = page.locator('[data-test="shipping-info-label"]')
        self.shipping_value: Locator = page.locator('[data-test="shipping-info-value"]')
        self.price_total_label: Locator = page.locator('[data-test="total-info-label"]')
        self.item_total: Locator = page.locator('[data-test="subtotal-label"]')
        self.tax: Locator = page.locator('[data-test="tax-label"]')
        self.total: Locator = page.locator('[data-test="total-label"]')
        self.cancel_button: Locator = page.locator('[data-test="cancel"]')
        self.finish_button: Locator = page.locator('[data-test="finish"]')

    def _item(self, product_name: str) -> Locator:
        """商品名が完全に一致する商品の行。"""
        name_pattern = re.compile(rf"^{re.escape(product_name)}$")
        return self.items.filter(
            has=self.page.locator('[data-test="inventory-item-name"]', has_text=name_pattern)
        )

    def goto(self) -> None:
        self.page.goto(URLS["checkout_step_two"])

    def reload(self) -> None:
        self.page.reload()

    def click_finish(self) -> None:
        self.finish_button.click()

    def click_cancel(self) -> None:
        self.cancel_button.click()

    def click_product_name(self, product_name: str) -> None:
        self._item(product_name).locator('[data-test="inventory-item-name"]').click()

    def expect_on_page(self) -> None:
        """Checkout Step Two画面が表示されていることを確かめる。"""
        expect(self.page).to_have_url(URLS["checkout_step_two"])
        expect(self.finish_button).to_be_visible()

    def expect_page_layout(self) -> None:
        """タイトル・一覧の見出し・支払いと配送の情報・金額の見出し・2つのボタンを確かめる。"""
        expect(self.title).to_have_text("Checkout: Overview")
        expect(self.quantity_label).to_have_text("QTY")
        expect(self.description_label).to_have_text("Description")
        expect(self.payment_label).to_have_text("Payment Information:")
        expect(self.payment_value).to_have_text("SauceCard #31337")
        expect(self.shipping_label).to_have_text("Shipping Information:")
        expect(self.shipping_value).to_have_text("Free Pony Express Delivery!")
        expect(self.price_total_label).to_have_text("Price Total")
        expect(self.cancel_button).to_be_visible()
        expect(self.cancel_button).to_have_text("Cancel")
        expect(self.finish_button).to_be_visible()
        expect(self.finish_button).to_have_text("Finish")

    def expect_item_count(self, count: int) -> None:
        expect(self.items).to_have_count(count)

    def expect_all_item_elements_visible(self) -> None:
        """すべての行に、数量（1）・商品名・説明・価格が表示されていることを確かめる。"""
        for item in self.items.all():
            expect(item.locator('[data-test="item-quantity"]')).to_have_text("1")
            expect(item.locator('[data-test="inventory-item-name"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-desc"]')).to_be_visible()
            expect(item.locator('[data-test="inventory-item-price"]')).to_be_visible()

    def expect_item_price(self, product_name: str, price: str) -> None:
        expect(self._item(product_name).locator('[data-test="inventory-item-price"]')).to_have_text(
            price
        )

    def expect_item_names(self, product_names: list[str]) -> None:
        """商品名が、渡した順に並んでいることを確かめる。"""
        expect(self.item_names).to_have_text(product_names)

    def expect_item_listed(self, product_name: str) -> None:
        expect(self._item(product_name)).to_have_count(1)

    def expect_amounts(self, item_total: str, tax: str, total: str) -> None:
        """小計・税・合計の表示の文言の全体を確かめる。"""
        expect(self.item_total).to_have_text(item_total)
        expect(self.tax).to_have_text(tax)
        expect(self.total).to_have_text(total)


class CheckoutCompletePage:
    def __init__(self, page: Page) -> None:
        self.page: Page = page
        self.title: Locator = page.locator('[data-test="title"]')
        self.header: Locator = page.locator('[data-test="complete-header"]')
        self.text: Locator = page.locator('[data-test="complete-text"]')
        self.image: Locator = page.locator('[data-test="pony-express"]')
        self.back_home_button: Locator = page.locator('[data-test="back-to-products"]')
        self.generate_pdf_button: Locator = page.locator('[data-test="generate-pdf-order"]')

    def goto(self) -> None:
        self.page.goto(URLS["complete"])

    def click_back_home(self) -> None:
        self.back_home_button.click()

    def expect_on_page(self) -> None:
        """Checkout Complete画面が表示されていることを確かめる。"""
        expect(self.page).to_have_url(URLS["complete"])
        expect(self.back_home_button).to_be_visible()

    def expect_page_layout(self) -> None:
        """タイトル・見出し・本文・画像・2つのボタンを確かめる。

        画像は、表示されていることと代替テキストで確かめ、読み込みが終わったかどうかは確かめない
        （specs/checkout_complete_testcases.md の「実装時の注意」）。
        ただし読み込み前の画像は大きさが0で見えない扱いになるため、表示の確認は、確認の待ち時間の範囲で読み込みを待つ。
        """
        expect(self.title).to_have_text("Checkout: Complete!")
        expect(self.header).to_have_text("Thank you for your order!")
        expect(self.text).to_have_text(
            "Your order has been dispatched, "
            "and will arrive just as fast as the pony can get there!"
        )
        expect(self.image).to_be_visible()
        expect(self.image).to_have_attribute("alt", "Pony Express")
        expect(self.back_home_button).to_be_visible()
        expect(self.back_home_button).to_have_text("Back Home")
        expect(self.generate_pdf_button).to_be_visible()
        expect(self.generate_pdf_button).to_have_text("Generate PDF order")
