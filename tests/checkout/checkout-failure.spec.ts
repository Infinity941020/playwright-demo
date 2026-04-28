// Playwrightのfixture（ログイン状態共通）
import { test } from '../../fixtures/loginFixture';

// CheckoutFlow（統一レイヤー）
import { CheckoutFlow } from '../../flows/CheckoutFlow';

/*
================================
Checkout異常系テスト（Flow統一版）
入力バリデーション検証
================================
*/
test.describe('Checkout異常系テスト（Flow版）', () => {

  let flow: CheckoutFlow;

  /*
  ================================
  前処理（最小化）
  ================================
  */
  test.beforeEach(async ({ loggedPage }) => {

    // Flow初期化
    flow = new CheckoutFlow(loggedPage);
  });

  /*
  ================================
  テストデータ
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

      // 前提構築（商品追加〜Checkout開始まで全部）
      await flow.prepareCheckoutWithItem('single');

      // 入力バリデーション検証
      await flow.expectValidationError(
        data.first,
        data.last,
        data.zip
      );
    });
  }

});