"""カート画面の表示や状態を確かめる関数。

テストからは画面の部品を直接呼ばず、カート画面の操作の単位を通して確かめる。
"""

from flows.cart_flow import CartFlow


def expect_cart_page_layout(cart_flow: CartFlow) -> None:
    cart_flow.expect_cart_page_layout()


def expect_cart_item_count(cart_flow: CartFlow, expected_count: int) -> None:
    cart_flow.expect_item_count(expected_count)


def expect_cart_items_displayed(cart_flow: CartFlow, products: list[dict]) -> None:
    cart_flow.expect_items_displayed(products)


def expect_cart_item_names_in_order(cart_flow: CartFlow, product_names: list[str]) -> None:
    cart_flow.expect_item_names_in_order(product_names)


def expect_in_cart(cart_flow: CartFlow, product_name: str) -> None:
    cart_flow.expect_in_cart(product_name)


def expect_badge_count(cart_flow: CartFlow, expected_count: int) -> None:
    cart_flow.expect_badge_count(expected_count)


def expect_on_inventory_page(cart_flow: CartFlow) -> None:
    cart_flow.expect_on_inventory_page()


def expect_on_checkout_step_one_page(cart_flow: CartFlow) -> None:
    cart_flow.expect_on_checkout_step_one_page()


def expect_on_product_detail_page(cart_flow: CartFlow, product_id: int) -> None:
    cart_flow.expect_on_product_detail_page(product_id)
