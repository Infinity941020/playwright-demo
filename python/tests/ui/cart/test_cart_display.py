"""カート画面の表示のテスト"""

from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.cart_flow import CartFlow
from utils.ui_assertions.cart_assertions import (
    expect_badge_count,
    expect_cart_item_count,
    expect_cart_items_displayed,
    expect_cart_page_layout,
)


class TestCartDisplay:
    """カート画面の表示を確かめる。"""

    def test_empty_cart_displayed(self, logged_page: Page) -> None:
        """TC-CART-001: カートが空のとき、空の状態の表示になること。"""
        cart_flow = CartFlow(logged_page)

        cart_flow.open_cart_with([])

        expect_cart_page_layout(cart_flow)
        expect_cart_item_count(cart_flow, 0)
        expect_badge_count(cart_flow, 0)

    def test_all_products_displayed_as_spec(self, logged_page: Page) -> None:
        """TC-CART-002: 全商品をカートに入れたとき、全商品が仕様どおりに表示されること。"""
        cart_flow = CartFlow(logged_page)
        all_products = list(PRODUCTS.values())

        cart_flow.open_cart_with(all_products)

        expect_cart_items_displayed(cart_flow, all_products)
        expect_badge_count(cart_flow, len(all_products))
