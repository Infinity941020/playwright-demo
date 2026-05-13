// Playwrightのfixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（統一レイヤー・業務フロー操作）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

// checkoutHelper（Checkout前準備共通化）
import { prepareCheckout } from '../../utils/checkoutHelper';

/*
================================
Checkout異常系テスト（Flow版）
入力バリデーション検証
================================
*/
test.describe('Checkout異常系テスト（Flow版）', () => {

  let flow: CheckoutFlow;

  // Flow初期化（ログイン済みページを利用）
  test.beforeEach(async ({ loggedPage }) => {

    flow = new CheckoutFlow(loggedPage);
  });

  /*
  ================================
  テストケース（入力バリエーション）
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
      // ■ Checkout開始前準備
      // ================================
      await test.step('Checkout開始前準備', async () => {

        await prepareCheckout(flow);
      });

      // ================================
      // ■ 入力（バリデーション対象）
      // ================================
      await test.step('不正な購入者情報を入力', async () => {

        await flow.fillCheckoutInfo(
          data.first,
          data.last,
          data.zip
        );
      });

      // ================================
      // ■ エラー検証
      // ================================
      await test.step('入力エラーを検証', async () => {

        await flow.continueExpectError();
      });
    });
  }

});