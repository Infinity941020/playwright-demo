// Playwrightのfixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（統一レイヤー・業務フロー操作）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

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
      // ■ 商品追加（業務操作）
      // ================================
      await flow.addItems('single');

      // ================================
      // ■ カート画面へ遷移
      // ================================
      await flow.goToCart();

      // ================================
      // ■ チェックアウト開始
      // ================================
      await flow.startCheckout();

      // ================================
      // ■ 入力（バリデーション対象）
      // ================================
      await flow.fillCheckoutInfo(
        data.first,
        data.last,
        data.zip
      );

      // ================================
      // ■ エラー検証
      // ================================
      await flow.continueExpectError();
    });
  }

});