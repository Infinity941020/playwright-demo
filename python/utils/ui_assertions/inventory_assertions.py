"""Inventory UI Assertions

責務:
    - Products（商品一覧）画面のUI検証
    - Flow経由で業務レベル検証を実施
"""

from flows.inventory_flow import InventoryFlow


def expect_products_displayed(inventory_flow: InventoryFlow, products: list[dict]) -> None:
    inventory_flow.expect_products_displayed(products)


def expect_product_names_in_order(inventory_flow: InventoryFlow, product_names: list[str]) -> None:
    inventory_flow.expect_product_names_in_order(product_names)


def expect_product_prices_in_order(inventory_flow: InventoryFlow, prices: list[str]) -> None:
    inventory_flow.expect_product_prices_in_order(prices)


def expect_selected_sort(inventory_flow: InventoryFlow, option_label: str) -> None:
    inventory_flow.expect_selected_sort(option_label)


def expect_remove_button_shown(inventory_flow: InventoryFlow, product_name: str) -> None:
    inventory_flow.expect_remove_button_shown(product_name)


def expect_add_to_cart_button_shown(inventory_flow: InventoryFlow, product_name: str) -> None:
    inventory_flow.expect_add_to_cart_button_shown(product_name)


def expect_badge_count(inventory_flow: InventoryFlow, expected_count: int) -> None:
    inventory_flow.expect_badge_count(expected_count)


def expect_on_inventory_page(inventory_flow: InventoryFlow) -> None:
    inventory_flow.expect_on_inventory_page()


def expect_on_product_detail_page(inventory_flow: InventoryFlow, product_id: int) -> None:
    inventory_flow.expect_on_product_detail_page(product_id)


def expect_on_cart_page(inventory_flow: InventoryFlow) -> None:
    inventory_flow.expect_on_cart_page()
