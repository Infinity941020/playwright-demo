// Playwrightのfixture化したtestを使用
import { test } from '../../fixtures/loginFixture';

// Page Objectを使用
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkout異常系テスト（data-driven版）
================================
*/
test.describe('Checkout異常系テスト（fixture統一版）', () => {

  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  /*
  ================================
  各テスト前処理
  ================================
  */
  test.beforeEach(async ({ loggedPage }) => {

    // 各Page Object生成
    inventory = new InventoryPage(loggedPage);
    cart = new CartPage(loggedPage);
    checkout = new CheckoutPage(loggedPage);

    // 商品一覧へ移動
    await inventory.goto();

    // 商品1件追加
    await inventory.addFirstItem();

    // カートへ移動
    await cart.goto();

    // Checkout開始
    await checkout.startCheckout();
  });

  /*
  ================================
  テストデータ一覧
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

    // 各ケースをテスト生成
    test(data.title, async () => {

      // 入力実施
      await checkout.fillInfo(
        data.first,
        data.last,
        data.zip
      );

      // エラー確認付きContinue
      await checkout.continueExpectError();
    });
  }

});