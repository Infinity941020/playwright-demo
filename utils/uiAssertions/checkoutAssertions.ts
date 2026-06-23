// CheckoutFlow（業務フロー操作）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

/*
================================
Checkout Assertions
================================
*/

/*
================================
購入完了検証
================================
*/

// Checkout完了状態を検証
export async function expectCheckoutComplete(
  flow: CheckoutFlow
) {

  await flow.verifyOrderComplete();
}