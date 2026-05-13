// Playwrightのテスト機能（ログイン状態はfixtureで管理）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（新統一レイヤー・業務フロー操作）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

// checkoutHelper（Checkout前準備共通化）
import { prepareCheckout } from '../../utils/checkoutHelper';

// チェックアウト入力データ（テストデータ集約）
import { checkoutData } from '../../data/checkoutData';

/*
================================
Checkout正常系テスト（Flow版）
================================
*/
test.describe('Checkout正常系テスト（Flow版）', () => {

  let flow: CheckoutFlow;

  // Flow初期化（ログイン済みページを利用）
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

      // ================================
      // ■ Checkout開始前準備
      // ================================
      await test.step('Checkout開始前準備', async () => {

        await prepareCheckout(flow, item.type);
      });

      // ================================
      // ■ 情報入力（テストデータ使用）
      // ================================
      await test.step('購入者情報入力', async () => {

        await flow.fillCheckoutInfo(
          checkoutData.firstName,   // 名（テストデータから取得）
          checkoutData.lastName,    // 姓（テストデータから取得）
          checkoutData.postalCode   // 郵便番号（テストデータから取得）
        );
      });

      // ================================
      // ■ 次へ（業務ステップ）
      // ================================
      await test.step('確認画面へ進む', async () => {

        await flow.proceedToOverviewStep();
      });

      // ================================
      // ■ 完了（購入完了）
      // ================================
      await test.step('購入完了', async () => {

        await flow.completePurchase();
      });

      // ================================
      // ■ 検証（完了状態確認）
      // ================================
      await test.step('購入完了状態を検証', async () => {

        await flow.verifyOrderComplete();
      });
    });
  }

});