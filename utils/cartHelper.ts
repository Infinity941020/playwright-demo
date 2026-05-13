// CartFlowを利用
import { CartFlow } from '../flows/CartFlow';

/*
================================
cartHelper
責務：
- Cart系テストの前準備共通化
- Arrange処理の簡略化
- Flow呼び出しのみを担当
================================
*/

// カート画面表示状態まで準備する
export async function prepareCart(
  flow: CartFlow,
  type: 'single' | 'multi' = 'single'
): Promise<number> {

  // 商品追加
  const count = await flow.addItems(type);

  // カート画面へ遷移
  await flow.openCart();

  // 追加件数を返却
  return count;
}