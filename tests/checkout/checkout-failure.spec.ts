// Playwrightのfixtureを使用（ログイン状態は共通化）
import { test } from '../../fixtures/loginFixture';

// Page Object（画面操作を分離）
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkout異常系テスト（data-driven構成）
入力バリデーションの検証
================================
*/
test.describe('Checkout異常系テスト（fixture統一版）', () => {

  /*
  ================================
  Page Object（共通利用）
  ================================
  */
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  /*
  ================================
  各テスト前処理
  ================================
  */
  test.beforeEach(async ({ loggedPage }) => {

    // Page Object初期化
    inventory = new InventoryPage(loggedPage);
    cart = new CartPage(loggedPage);
    checkout = new CheckoutPage(loggedPage);

    // 商品一覧画面へ遷移
    await inventory.goto();

    // テストデータ準備（商品を1件追加）
    await inventory.addFirstItem();

    // カート画面へ移動
    await cart.goto();

    // Checkout画面へ遷移
    await checkout.startCheckout();
  });

  /*
  ================================
  テストデータ（入力バリデーションパターン）
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
  data-driven実行（入力エラー検証）
  ================================
  */
  for (const data of cases) {

    test(data.title, async () => {

      // フォーム入力
      await checkout.fillInfo(
        data.first,
        data.last,
        data.zip
      );

      // エラー表示を伴う遷移を検証
      await checkout.continueExpectError();
    });
  }

});