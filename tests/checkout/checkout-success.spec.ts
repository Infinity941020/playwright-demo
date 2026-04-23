// Playwrightのテスト機能を使用（ログイン状態はfixtureで管理）
import { test } from '../../fixtures/loginFixture';

// 各画面操作用Page Object
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkout正常系テスト（data-driven構成）
================================
*/
test.describe('Checkout正常系テスト（fixture統一版）', () => {

  /*
  ================================
  Page Object（各テスト共通）
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

    // 商品一覧画面から開始
    await inventory.goto();
  });

  /*
  ================================
  テストケース定義（data-driven）
  ================================
  */
  const cases = [
    {
      title: '① 商品一覧から1件追加して購入フローへ進む',
      action: async () => {
        await inventory.addFirstItem();
      }
    },
    {
      title: '② 商品一覧から複数件追加して購入フローへ進む',
      action: async () => {
        await inventory.addAllItems();
      }
    },
    {
      title: '③ 商品詳細から追加して購入フローへ進む',
      action: async () => {
        await inventory.addFirstItem();
      }
    },
    {
      title: '④ カートで内容確認後に購入フローへ進む',
      action: async () => {
        await inventory.addFirstItem();
        await cart.goto();
        await cart.expectItemCount(1);
      }
    },
    {
      title: '⑤ 複数追加後に一部削除して購入フローへ進む',
      action: async () => {

        // 商品を全件追加
        const count = await inventory.addAllItems();

        // カート画面へ移動
        await cart.goto();

        // 一部商品を削除
        await cart.removeFirstItem();
        await cart.removeFirstItem();

        // カート内件数を検証
        await cart.expectItemCount(count - 2);
      }
    },
    {
      title: '⑥ 一部追加後に戻って再追加して購入フローへ進む',
      action: async () => {

        // 商品を1件追加
        await inventory.addFirstItem();

        // カート画面へ移動
        await cart.goto();

        // 商品一覧へ戻る
        await cart.continueShopping();

        // 再度すべて追加
        await inventory.addAllItems();
      }
    }
  ];

  /*
  ================================
  data-drivenテスト実行
  ================================
  */
  for (const item of cases) {

    test(item.title, async () => {

      // ケースごとの操作を実行
      await item.action();

      // カート画面へ遷移
      await cart.goto();

      // 購入処理実行
      await checkout.completePurchase(
        'Taro',
        'Yamada',
        '12345'
      );

      // 完了画面の表示確認
      await checkout.expectComplete();
    });
  }

});