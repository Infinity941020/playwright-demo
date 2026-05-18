// CartFlow
import { CartFlow } from '../flows/CartFlow';

/*
================================
Cart件数検証
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

/*
================================
Cart Badge検証
================================
*/

// バッジ件数
export async function expectCartBadgeCount(
  cartFlow: CartFlow,
  expectedCount: number
) {

  await cartFlow.expectBadgeCount(expectedCount);
}

// バッジ非表示
export async function expectCartBadgeHidden(
  cartFlow: CartFlow
) {

  await cartFlow.expectBadgeCount(0);
}