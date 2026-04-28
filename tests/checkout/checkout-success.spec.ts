// Playwrightのテスト機能（ログイン状態はfixtureで管理）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（新統一レイヤー）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

/*
================================
Checkout正常系テスト（Flow版）
================================
*/
test.describe('Checkout正常系テスト（Flow版）', () => {

  let flow: CheckoutFlow;

  test.beforeEach(async ({ loggedPage }) => {
    flow = new CheckoutFlow(loggedPage);
  });

  /*
  ================================
  data-driven実行
  ================================
  */
  const cases = [
    { title: '① 単一商品購入', type: 'single' as const },
    { title: '② 複数商品購入', type: 'multi' as const },
    { title: '③ カート経由購入（単一）', type: 'single' as const },
    { title: '④ カート確認後購入', type: 'single' as const },
    { title: '⑤ 削除後購入', type: 'multi' as const },
    { title: '⑥ 再追加後購入', type: 'multi' as const },
  ];

  for (const item of cases) {

    test(item.title, async () => {

      // =========================
      // Flow分解型（新粒度）
      // =========================

      await flow.addItems(item.type);
      await flow.goToCart();
      await flow.goToCheckoutStepOne();

      await flow.fillCheckoutInfo(
        'Taro',
        'Yamada',
        '12345'
      );

      await flow.continueCheckout();
      await flow.finishCheckout();

      await flow.expectComplete();
    });
  }

});