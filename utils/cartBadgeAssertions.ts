// CartFlow
import { CartFlow } from '../flows/CartFlow';

/*
================================
Cart Badge Assertions
================================
責務：
- カートバッジ件数検証
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