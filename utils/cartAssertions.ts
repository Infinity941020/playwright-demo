// CartFlow
import { CartFlow } from '../flows/CartFlow';

/*
================================
Cart Item Assertions
================================
責務：
- カート内商品件数検証
================================
*/

// 単一商品
export async function expectSingleCartItem(
  cartFlow: CartFlow
) {

  await cartFlow.expectItemCount(1);
}

// 複数商品
export async function expectMultipleCartItems(
  cartFlow: CartFlow,
  expectedCount: number
) {

  await cartFlow.expectItemCount(expectedCount);
}

// 空カート
export async function expectEmptyCart(
  cartFlow: CartFlow
) {

  await cartFlow.expectItemCount(0);
}