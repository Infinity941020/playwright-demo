// CheckoutFlowを利用
import { CheckoutFlow } from '../flows/CheckoutFlow';

/*
================================
checkoutHelper
責務：
- Checkout系テストの前準備共通化
- Arrange処理の簡略化
- Flow呼び出しのみを担当
================================
*/

// Checkout開始状態まで準備する
export async function prepareCheckout(
  flow: CheckoutFlow,
  type: 'single' | 'multi' = 'single'
) {

  // 商品追加
  await flow.addItems(type);

  // カート画面へ遷移
  await flow.goToCart();

  // Checkout開始
  await flow.startCheckout();
}