// Playwright fixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（統一レイヤー・業務フロー操作）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

// checkoutHelper（Checkout前準備共通化）
import { prepareCheckout } from '../../utils/checkoutHelper';

/*
================================
Checkoutキャンセル系テスト（Flow版）
================================
*/
test.describe('Checkoutキャンセル系テスト（Flow版）', () => {

  let flow: CheckoutFlow;

  // Flow初期化（ログイン済みページを利用）
  test.beforeEach(async ({ loggedPage }) => {

    flow = new CheckoutFlow(loggedPage);
  });

  /*
  ================================
  ① カート画面から商品一覧へ戻る
  ================================
  */
  test('① カート画面から商品一覧へ戻る', async () => {

    await flow.addItems('single');
    await flow.goToCart();

    await flow.cancelFromCart();
  });

  /*
  ================================
  ② Checkout開始直後にカートへ戻る
  ================================
  */
  test('② Checkout開始直後にカートへ戻る', async () => {

    // ================================
    // ■ Checkout開始前準備
    // ================================
    await prepareCheckout(flow);

    await flow.cancelFromStepOne();
  });

  /*
  ================================
  ③ 入力途中でカートへ戻る
  ================================
  */
  test('③ 入力途中でカートへ戻る', async () => {

    // ================================
    // ■ Checkout開始前準備
    // ================================
    await prepareCheckout(flow);

    await flow.fillCheckoutInfo(
      'Taro',
      '',
      ''
    );

    await flow.cancelFromStepOne();
  });

  /*
  ================================
  ④ 入力完了後にカートへ戻る
  ================================
  */
  test('④ 入力完了後にカートへ戻る', async () => {

    // ================================
    // ■ Checkout開始前準備
    // ================================
    await prepareCheckout(flow);

    await flow.fillCheckoutInfo(
      'Taro',
      'Yamada',
      '12345'
    );

    await flow.cancelFromStepOne();
  });

  /*
  ================================
  ⑤ 確認画面から商品一覧へ戻る
  ================================
  */
  test('⑤ 確認画面から商品一覧へ戻る', async () => {

    // ================================
    // ■ Checkout開始前準備
    // ================================
    await prepareCheckout(flow);

    await flow.fillCheckoutInfo(
      'Taro',
      'Yamada',
      '12345'
    );

    // ================================
    // ■ 確認画面へ進む（業務ステップ）
    // ================================
    await flow.proceedToOverviewStep();

    // ================================
    // ■ 確認画面から商品一覧へ戻る
    // ================================
    await flow.cancelFromStepTwo();
  });

});