"""Checkout画面のUI操作（Page Object）

責務:
    - 要素取得
    - 単体操作
    - 画面レベルの検証

TS版の pages/CheckoutPage.ts と1対1で対応するファイルで、クラスは画面ごとに分ける
（decisions.md 論点16）。
"""

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

    def expect_on_checkout_step_two_page(self) -> None:
        """Checkout Step Two画面への遷移確認（画面の中身は対象外）。"""
        expect(self.page).to_have_url(URLS["checkout_step_two"])
