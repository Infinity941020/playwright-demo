// Playwright fixture（ログイン状態共通）
import { test } from '../../../fixtures/loginFixture';

// CheckoutFlow（統一レイヤー・業務フロー操作）
import { CheckoutFlow } from '../../../flows/CheckoutFlow';

// checkoutHelper（Checkout前準備共通化）
import { prepareCheckout } from '../../../utils/checkoutHelper';

/*
================================
Checkoutキャンセル系テスト（Flow版）
================================
*/
test.describe('Checkoutキャンセル系テスト（Flow版）', () => {

  // CheckoutFlow
  let flow: CheckoutFlow;

  /*
  ================================
  Flow初期化
  ================================
  */
  test.beforeEach(async ({ loggedPage }) => {

    flow = new CheckoutFlow(loggedPage);
  });

  /*
  ================================
  ⑤ 確認画面から商品一覧へ戻る
  ================================
  */
  test('⑤ 確認画面から商品一覧へ戻る', async () => {

    await test.step('Checkout開始前準備', async () => {

      await prepareCheckout(flow);
    });

    await test.step('購入者情報を入力', async () => {

      await flow.fillCheckoutInfo(
        'Taro',
        'Yamada',
        '12345'
      );
    });

    await test.step('確認画面へ進む', async () => {

      await flow.proceedToOverviewStep();
    });

    await test.step('確認画面から商品一覧へ戻る', async () => {

      await flow.cancelFromStepTwo();
    });
  });

});