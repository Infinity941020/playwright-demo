"""Checkout Step Two画面 表示テスト"""

from playwright.sync_api import Page

from data.checkout_data import CHECKOUT_DATA
from data.products import PRODUCTS
from flows.checkout_flow import CheckoutFlow
from utils.ui_assertions.checkout_assertions import (
    expect_badge_count,
    expect_checkout_step_two_page_layout,
    expect_step_two_item_names_in_order,
    expect_step_two_items_displayed,
)


class TestCheckoutStepTwoDisplay:
    """Checkout Step Two画面の表示を確かめる。"""

    def test_page_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CO2-001: 画面が仕様どおりに表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)

        # 前提状態を作る（Backpack → Bike Light の順にカートに入れる）
        checkout_flow.open_step_two_with(
            [PRODUCTS["backpack"], PRODUCTS["bike_light"]], CHECKOUT_DATA
        )

        # 結果を検証する
        expect_checkout_step_two_page_layout(checkout_flow)
        expect_badge_count(checkout_flow, 2)

    def test_all_products_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CO2-002: 全商品をカートに入れたとき、全商品が仕様どおりに表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)
        all_products = list(PRODUCTS.values())

        # 前提状態を作る（全6商品を「表示商品」の表の順にカートに入れる）
        checkout_flow.open_step_two_with(all_products, CHECKOUT_DATA)

        # 結果を検証する
        expect_step_two_items_displayed(checkout_flow, all_products)

    def test_items_listed_in_cart_order(self, logged_page: Page) -> None:
        """TC-CO2-003: カートに追加した順に表示されること。"""
        checkout_flow = CheckoutFlow(logged_page)
        products = [PRODUCTS["bike_light"], PRODUCTS["backpack"], PRODUCTS["onesie"]]

        # 前提状態を作る（Bike Light → Backpack → Onesie の順にカートに入れる）
        checkout_flow.open_step_two_with(products, CHECKOUT_DATA)

        # 結果を検証する
        expect_step_two_item_names_in_order(
            checkout_flow, [product["name"] for product in products]
        )
