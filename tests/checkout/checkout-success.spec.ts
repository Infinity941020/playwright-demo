// Playwrightのテスト機能（ログイン状態はfixtureで管理）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（新統一レイヤー）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

/*
================================
Checkout正常系テスト（Flow統一版）
================================
*/
test.describe('Checkout正常系テスト（Flow版）', () => {

  let flow: CheckoutFlow;

  /*
  ================================
  前処理
  ================================
  */
  test.beforeEach(async ({ loggedPage }) => {

    // Flow初期化
    flow = new CheckoutFlow(loggedPage);
  });

  /*
  ================================
  テストケース
  ================================
  */
  const cases = [
    {
      title: '① 単一商品購入',
      type: 'single' as const
    },
    {
      title: '② 複数商品購入',
      type: 'multi' as const
    },
    {
      title: '③ カート経由購入（単一）',
      type: 'single' as const
    },
    {
      title: '④ カート確認後購入',
      type: 'single' as const
    },
    {
      title: '⑤ 削除後購入',
      type: 'multi' as const
    },
    {
      title: '⑥ 再追加後購入',
      type: 'multi' as const
    }
  ];

  /*
  ================================
  data-driven実行
  ================================
  */
  for (const item of cases) {

    test(item.title, async () => {

      // 前提構築（ここに集約）
      await flow.prepareCheckoutWithItem(item.type);

      // 購入実行（正常系）
      await flow.completePurchase(
        'Taro',
        'Yamada',
        '12345'
      );

      // 完了確認
      await flow.expectComplete();
    });
  }

});