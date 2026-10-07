"""Products画面 画面遷移テスト"""

from typing import Literal

import pytest
from playwright.sync_api import Page

from data.products import PRODUCTS
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import (
    expect_on_cart_page,
    expect_on_product_detail_page,
)


class TestInventoryNavigation:
    """画面遷移確認"""

    @pytest.mark.parametrize("via", ["name", "image"], ids=["TC-PROD-009", "TC-PROD-010"])
    def test_open_product_detail(self, logged_page: Page, via: Literal["name", "image"]) -> None:
        """TC-PROD-009/010: 商品名・商品画像を押すと、商品詳細画面へ遷移すること。"""
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]

        # 業務操作（商品詳細を開く）
        inventory_flow.open_product_detail(backpack["name"], via)

        # 検証（業務レベル）
        expect_on_product_detail_page(inventory_flow, backpack["id"])

    def test_cart_icon_opens_cart(self, logged_page: Page) -> None:
        """TC-PROD-011: カートアイコンを押すと、Cart画面へ遷移すること。"""
        inventory_flow = InventoryFlow(logged_page)

        # 業務操作（カートを開く）
        inventory_flow.open_cart()

        # 検証（業務レベル）
        expect_on_cart_page(inventory_flow)
