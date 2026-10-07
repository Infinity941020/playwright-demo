"""Products画面 ソートテスト"""

from typing import Callable

import pytest
from playwright.sync_api import Page

from data.products import PRODUCTS, SORT_OPTIONS
from flows.inventory_flow import InventoryFlow
from utils.ui_assertions.inventory_assertions import (
    expect_product_names_in_order,
    expect_product_prices_in_order,
    expect_selected_sort,
)

# 仕様書「表示商品」の表の順（No.1→No.6）
_PRODUCT_NAMES = [product["name"] for product in PRODUCTS.values()]
_PRICES = [product["price"] for product in PRODUCTS.values()]


def _price_value(price: str) -> float:
    """「$29.99」形式の価格を数値に変換する（期待値の並べ替え用）。"""
    return float(price.lstrip("$"))


class TestInventorySort:
    """ソート確認"""

    def test_default_sort_is_name_a_to_z(self, logged_page: Page) -> None:
        """TC-PROD-002: 初期表示のソートが Name (A to Z) であること。"""
        inventory_flow = InventoryFlow(logged_page)

        # 検証（業務レベル）
        expect_selected_sort(inventory_flow, SORT_OPTIONS["name_asc"])
        expect_product_names_in_order(inventory_flow, _PRODUCT_NAMES)

    # 価格ソートは価格の並びのみ検証する（同じ価格どうしの順番は仕様として規定しない）
    @pytest.mark.parametrize(
        ("option_label", "expect_order", "expected"),
        [
            (SORT_OPTIONS["name_desc"], expect_product_names_in_order, _PRODUCT_NAMES[::-1]),
            (
                SORT_OPTIONS["price_asc"],
                expect_product_prices_in_order,
                sorted(_PRICES, key=_price_value),
            ),
            (
                SORT_OPTIONS["price_desc"],
                expect_product_prices_in_order,
                sorted(_PRICES, key=_price_value, reverse=True),
            ),
        ],
        ids=["TC-PROD-003", "TC-PROD-004", "TC-PROD-005"],
    )
    def test_sort_order(
        self,
        logged_page: Page,
        option_label: str,
        expect_order: Callable[[InventoryFlow, list[str]], None],
        expected: list[str],
    ) -> None:
        """TC-PROD-003〜005: ソートを選ぶと、選択肢どおりの順に並ぶこと。"""
        inventory_flow = InventoryFlow(logged_page)

        # 業務操作（ソート選択）
        inventory_flow.sort_by(option_label)

        # 検証（業務レベル）
        expect_order(inventory_flow, expected)
