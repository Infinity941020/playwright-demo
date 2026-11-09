"""Checkout画面のUI操作（Page Object）

責務:
    - 要素取得
    - 単体操作
    - 画面レベルの検証

TS版の pages/CheckoutPage.ts と1対1で対応するファイルで、クラスは画面ごとに分ける
（decisions.md 論点16）。
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

    # 単体操作

    def goto(self) -> None:
        """Checkout Step One画面へ遷移する（表示確認は呼び出し側で expect_on_page() を呼ぶ）。"""
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

        入力欄で Enter キーを押すと Continue ではなく Cancel が動くため、
        必ずボタンのクリックで押す（checkout_step_one_spec.md「判断できない挙動」参照）。
        """
        self.continue_button.click()

    def click_cancel(self) -> None:
        self.cancel_button.click()

    def close_error(self) -> None:
        self.error_close_button.click()

    # 画面レベルの検証

    def expect_on_page(self) -> None:
        """Checkout Step One画面表示確認。"""
        expect(self.page).to_have_url(URLS["checkout_step_one"])
        expect(self.continue_button).to_be_visible()

    def expect_page_layout(self) -> None:
        """タイトル・3つの入力欄（プレースホルダー）・ボタンの検証。"""
        expect(self.title).to_have_text("Checkout: Your Information")
        expect(self.first_name_input).to_be_visible()
        expect(self.first_name_input).to_have_attribute("placeholder", "First Name")
        expect(self.last_name_input).to_be_visible()
        expect(self.last_name_input).to_have_attribute("placeholder", "Last Name")
        expect(self.postal_code_input).to_be_visible()
        expect(self.postal_code_input).to_have_attribute("placeholder", "Zip/Postal Code")
        expect(self.cancel_button).to_be_visible()
        expect(self.cancel_button).to_have_text("Cancel")
        # Continue は input 要素のため、文言は value 属性で確認する
        expect(self.continue_button).to_be_visible()
        expect(self.continue_button).to_have_value("Continue")

    def expect_error_message(self, message: str) -> None:
        """エラー文言検証。"""
        expect(self.error_message_locator).to_have_text(message)

    def expect_no_error(self) -> None:
        """エラー表示がないこと。"""
        expect(self.error_message_locator).to_have_count(0)

    def expect_info_values(self, first_name: str, last_name: str, postal_code: str) -> None:
        """3つの入力欄の値検証。"""
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

    # 商品ごとに変わる部品（商品名で特定する）

    def _item(self, product_name: str) -> Locator:
        """商品名に完全一致する行を返す。"""
        name_pattern = re.compile(rf"^{re.escape(product_name)}$")
        return self.items.filter(
            has=self.page.locator('[data-test="inventory-item-name"]', has_text=name_pattern)
        )

    # 単体操作

    def goto(self) -> None:
        """Checkout Step Two画面へ遷移する（表示確認は呼び出し側で expect_on_page() を呼ぶ）。"""
        self.page.goto(URLS["checkout_step_two"])

    def reload(self) -> None:
        self.page.reload()

    def click_finish(self) -> None:
        self.finish_button.click()

    def click_cancel(self) -> None:
        self.cancel_button.click()

    def click_product_name(self, product_name: str) -> None:
        self._item(product_name).locator('[data-test="inventory-item-name"]').click()

    # 画面レベルの検証

    def expect_on_page(self) -> None:
        """Checkout Step Two画面表示確認。"""
        expect(self.page).to_have_url(URLS["checkout_step_two"])
        expect(self.finish_button).to_be_visible()

    def expect_page_layout(self) -> None:
        """タイトル・一覧の見出し・支払い／配送情報・金額の見出し・ボタンの検証。"""
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
        """全行に「数量（1）／商品名／説明／価格」が表示されていること。"""
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
        """商品名の並び順検証。"""
        expect(self.item_names).to_have_text(product_names)

    def expect_item_listed(self, product_name: str) -> None:
        expect(self._item(product_name)).to_have_count(1)

    def expect_amounts(self, item_total: str, tax: str, total: str) -> None:
        """小計・税・合計の表示文言の検証（完全一致）。"""
        expect(self.item_total).to_have_text(item_total)
        expect(self.tax).to_have_text(tax)
        expect(self.total).to_have_text(total)

    def expect_on_checkout_complete_page(self) -> None:
        """Checkout Complete画面への遷移確認（画面の中身は対象外）。"""
        expect(self.page).to_have_url(URLS["complete"])
