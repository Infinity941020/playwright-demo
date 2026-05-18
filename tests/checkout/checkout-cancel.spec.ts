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
  ① カート画面から商品一覧へ戻る
  ================================
  */
  test('① カート画面から商品一覧へ戻る', async () => {

    /*
    ================================
    ■ 商品追加＋Cart画面遷移
    ================================
    */
    await test.step('商品を追加してカート画面へ遷移', async () => {

      await flow.addItems('single');
      await flow.goToCart();
    });

    /*
    ================================
    ■ 商品一覧へ戻る
    ================================
    */
    await test.step('商品一覧へ戻る', async () => {

      await flow.cancelFromCart();
    });
  });

  /*
  ================================
  ② Checkout開始直後にカートへ戻る
  ================================
  */
  test('② Checkout開始直後にカートへ戻る', async () => {

    /*
    ================================
    ■ Checkout開始前準備
    ================================
    */
    await test.step('Checkout開始前準備', async () => {

      await prepareCheckout(flow);
    });

    /*
    ================================
    ■ StepOneからCartへ戻る
    ================================
    */
    await test.step('Checkout開始画面からカートへ戻る', async () => {

      await flow.cancelFromStepOne();
    });
  });

  /*
  ================================
  ③ 入力途中でカートへ戻る
  ================================
  */
  test('③ 入力途中でカートへ戻る', async () => {

    /*
    ================================
    ■ Checkout開始前準備
    ================================
    */
    await test.step('Checkout開始前準備', async () => {

      await prepareCheckout(flow);
    });

    /*
    ================================
    ■ 購入者情報を途中入力
    ================================
    */
    await test.step('購入者情報を途中まで入力', async () => {

      await flow.fillCheckoutInfo(
        'Taro',
        '',
        ''
      );
    });

    /*
    ================================
    ■ Cartへ戻る
    ================================
    */
    await test.step('入力途中でカートへ戻る', async () => {

      await flow.cancelFromStepOne();
    });
  });

  /*
  ================================
  ④ 入力完了後にカートへ戻る
  ================================
  */
  test('④ 入力完了後にカートへ戻る', async () => {

    /*
    ================================
    ■ Checkout開始前準備
    ================================
    */
    await test.step('Checkout開始前準備', async () => {

      await prepareCheckout(flow);
    });

    /*
    ================================
    ■ 購入者情報入力
    ================================
    */
    await test.step('購入者情報を入力', async () => {

      await flow.fillCheckoutInfo(
        'Taro',
        'Yamada',
        '12345'
      );
    });

    /*
    ================================
    ■ Cartへ戻る
    ================================
    */
    await test.step('入力完了後にカートへ戻る', async () => {

      await flow.cancelFromStepOne();
    });
  });

  /*
  ================================
  ⑤ 確認画面から商品一覧へ戻る
  ================================
  */
  test('⑤ 確認画面から商品一覧へ戻る', async () => {

    /*
    ================================
    ■ Checkout開始前準備
    ================================
    */
    await test.step('Checkout開始前準備', async () => {

      await prepareCheckout(flow);
    });

    /*
    ================================
    ■ 購入者情報入力
    ================================
    */
    await test.step('購入者情報を入力', async () => {

      await flow.fillCheckoutInfo(
        'Taro',
        'Yamada',
        '12345'
      );
    });

    /*
    ================================
    ■ Overview画面へ進む
    ================================
    */
    await test.step('確認画面へ進む', async () => {

      await flow.proceedToOverviewStep();
    });

    /*
    ================================
    ■ 商品一覧へ戻る
    ================================
    */
    await test.step('確認画面から商品一覧へ戻る', async () => {

      await flow.cancelFromStepTwo();
    });
  });

});