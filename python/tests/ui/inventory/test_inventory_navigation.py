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
    """画面遷移を確かめる。"""

    @pytest.mark.parametrize("via", ["name", "image"], ids=["TC-PROD-009", "TC-PROD-010"])
    def test_open_product_detail(self, logged_page: Page, via: Literal["name", "image"]) -> None:
        """TC-PROD-009/010: 商品名・商品画像を押すと、商品詳細画面へ遷移すること。"""
        inventory_flow = InventoryFlow(logged_page)
        backpack = PRODUCTS["backpack"]

        # 商品詳細画面を開く
        inventory_flow.open_product_detail(backpack["name"], via)

        # 結果を検証する
        expect_on_product_detail_page(inventory_flow, backpack["id"])

    def test_cart_icon_opens_cart(self, logged_page: Page) -> None:
        """TC-PROD-011: カートアイコンを押すと、Cart画面へ遷移すること。"""
        inventory_flow = InventoryFlow(logged_page)

        # カート画面を開く
        inventory_flow.open_cart()

        # 結果を検証する
        expect_on_cart_page(inventory_flow)
