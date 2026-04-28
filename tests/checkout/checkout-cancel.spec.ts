// Playwright fixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（統一レイヤー）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

/*
================================
Checkoutキャンセル系テスト（Flow版）
================================
*/
test.describe('Checkoutキャンセル系テスト（Flow版）', () => {

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
  ① カート画面から商品一覧へ戻る
  ================================
  */
  test('① カート画面から商品一覧へ戻る', async () => {

    // カート画面まで準備
    await flow.prepareCartWithItem('single');

    // 一覧へ戻る
    await flow.cancelFromCart();
  });

  /*
  ================================
  ② Checkout開始直後にカートへ戻る
  ================================
  */
  test('② Checkout開始直後にカートへ戻る', async () => {

    // Step1まで準備
    await flow.prepareCheckoutWithItem('single');

    // カートへ戻る
    await flow.cancelFromStepOne();
  });

  /*
  ================================
  ③ 入力途中でカートへ戻る
  ================================
  */
  test('③ 入力途中でカートへ戻る', async () => {

    // Step1まで準備
    await flow.prepareCheckoutWithItem('single');

    // 一部入力
    await flow.fillCheckoutInfo('Taro', '', '');

    // カートへ戻る
    await flow.cancelFromStepOne();
  });

  /*
  ================================
  ④ 入力完了後にカートへ戻る
  ================================
  */
  test('④ 入力完了後にカートへ戻る', async () => {

    // Step1まで準備
    await flow.prepareCheckoutWithItem('single');

    // 全入力
    await flow.fillCheckoutInfo(
      'Taro',
      'Yamada',
      '12345'
    );

    // カートへ戻る
    await flow.cancelFromStepOne();
  });

  /*
  ================================
  ⑤ 確認画面から商品一覧へ戻る
  ================================
  */
  test('⑤ 確認画面から商品一覧へ戻る', async () => {

    // Step2まで準備
    await flow.prepareCheckoutStepTwo('single');

    // 一覧へ戻る
    await flow.cancelFromStepTwo();
  });

});