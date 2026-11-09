"""Checkout UI Assertions

責務:
    - Checkout画面のUI検証
    - Flow経由で業務レベル検証を実施
"""

from flows.checkout_flow import CheckoutFlow


def expect_on_checkout_step_one_page(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_on_step_one_page()


def expect_checkout_step_one_page_layout(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_step_one_page_layout()


def expect_checkout_error_message(checkout_flow: CheckoutFlow, message: str) -> None:
    checkout_flow.expect_error_message(message)


def expect_no_checkout_error(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_no_error()


def expect_checkout_info_values(
    checkout_flow: CheckoutFlow, first_name: str, last_name: str, postal_code: str
) -> None:
    checkout_flow.expect_info_values(first_name, last_name, postal_code)


def expect_checkout_badge_count(checkout_flow: CheckoutFlow, expected_count: int) -> None:
    checkout_flow.expect_badge_count(expected_count)


def expect_on_checkout_step_two_page(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_on_step_two_page()


def expect_checkout_step_two_page_layout(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_step_two_page_layout()


def expect_step_two_items_displayed(checkout_flow: CheckoutFlow, products: list[dict]) -> None:
    checkout_flow.expect_step_two_items_displayed(products)


def expect_step_two_item_names_in_order(
    checkout_flow: CheckoutFlow, product_names: list[str]
) -> None:
    checkout_flow.expect_step_two_item_names_in_order(product_names)


def expect_step_two_item_count(checkout_flow: CheckoutFlow, expected_count: int) -> None:
    checkout_flow.expect_step_two_item_count(expected_count)


def expect_step_two_item_listed(checkout_flow: CheckoutFlow, product_name: str) -> None:
    checkout_flow.expect_step_two_item_listed(product_name)


def expect_step_two_amounts(
    checkout_flow: CheckoutFlow, item_total: str, tax: str, total: str
) -> None:
    checkout_flow.expect_step_two_amounts(item_total, tax, total)


def expect_on_checkout_complete_page(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_on_checkout_complete_page()


def expect_on_inventory_page(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_on_inventory_page()


def expect_on_product_detail_page(checkout_flow: CheckoutFlow, product_id: int) -> None:
    checkout_flow.expect_on_product_detail_page(product_id)


def expect_on_cart_page(checkout_flow: CheckoutFlow) -> None:
    checkout_flow.expect_on_cart_page()


def expect_cart_item_count(checkout_flow: CheckoutFlow, expected_count: int) -> None:
    checkout_flow.expect_cart_item_count(expected_count)


def expect_in_cart(checkout_flow: CheckoutFlow, product_name: str) -> None:
    checkout_flow.expect_in_cart(product_name)
