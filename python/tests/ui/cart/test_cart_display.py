"""Cart画面 表示テスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from utils.ui_assertions.cart_assertions import (
    expect_cart_badge_count,
    expect_cart_badge_hidden,
    expect_cart_item_count,
    expect_cart_items_displayed,
    expect_cart_page_layout,
)


class TestCartDisplay:
    """カート画面の表示確認"""

    def test_empty_cart_displayed(self, logged_page: Page) -> None:
        """TC-CART-001: カートが空のとき、空の状態の表示になること。"""
        cart_flow = CartFlow(logged_page)

        # 前提状態（カートは空）
        cart_flow.open_cart_with([])

        # 検証（業務レベル）
        expect_cart_page_layout(cart_flow)
        expect_cart_item_count(cart_flow, 0)
        expect_cart_badge_hidden(cart_flow)

    def test_all_products_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CART-002: 全商品をカートに入れたとき、全商品が仕様どおりに表示されること。"""
        cart_flow = CartFlow(logged_page)
        all_products = list(PRODUCTS.values())

        # 前提状態（全6商品を「表示商品」の表の順でカートに入れる）
        cart_flow.open_cart_with(all_products)

        # 検証（業務レベル）
        expect_cart_items_displayed(cart_flow, all_products)
        expect_cart_badge_count(cart_flow, len(all_products))
