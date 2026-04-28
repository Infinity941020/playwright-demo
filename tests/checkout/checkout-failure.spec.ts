// Playwrightのfixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（統一レイヤー）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

/*
================================
Checkout異常系テスト（Flow版）
入力バリデーション検証
================================
*/
test.describe('Checkout異常系テスト（Flow版）', () => {

  let flow: CheckoutFlow;

  test.beforeEach(async ({ loggedPage }) => {
    flow = new CheckoutFlow(loggedPage);
  });

  /*
  ================================
  テストケース
  ================================
  */
  const cases = [
    {
      title: '① First Name未入力',
      first: '',
      last: 'Yamada',
      zip: '12345',
    },
    {
      title: '② Last Name未入力',
      first: 'Taro',
      last: '',
      zip: '12345',
    },
    {
      title: '③ Postal Code未入力',
      first: 'Taro',
      last: 'Yamada',
      zip: '',
    },
    {
      title: '④ 全項目未入力',
      first: '',
      last: '',
      zip: '',
    },
  ];

  /*
  ================================
  data-driven実行
  ================================
  */
  for (const data of cases) {

    test(data.title, async () => {

      // ================================
      // Flow（今の粒度に統一）
      // ================================

      await flow.addItems('single');
      await flow.goToCart();
      await flow.goToCheckoutStepOne();

      await flow.fillCheckoutInfo(
        data.first,
        data.last,
        data.zip
      );

      await flow.continueExpectError();
    });
  }

});