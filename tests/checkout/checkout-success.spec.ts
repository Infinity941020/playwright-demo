// Playwrightのテスト機能とexpectをfixture経由で使用
import { test } from '../../fixtures/loginFixture';

// Inventoryページ操作クラスを使用
import { InventoryPage } from '../../pages/InventoryPage';

// Cartページ操作クラスを使用
import { CartPage } from '../../pages/CartPage';

// Checkoutページ操作クラスを使用
import { CheckoutPage } from '../../pages/CheckoutPage';

/*
================================
Checkout正常系テスト（data-driven版）
================================
*/
test.describe('Checkout正常系テスト（fixture統一版）', () => {

  /*
  ================================
  共通変数
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

    // 各Page Object生成
    inventory = new InventoryPage(loggedPage);
    cart = new CartPage(loggedPage);
    checkout = new CheckoutPage(loggedPage);

    // 商品一覧へ遷移
    await inventory.goto();
  });

  /*
  ================================
  テストケース定義
  ================================
  */
  const cases = [
    {
      title: '① 一覧画面で1件追加して購入できること',
      action: async () => {
        await inventory.addFirstItem();
      }
    },
    {
      title: '② 一覧画面で複数件追加して購入できること',
      action: async () => {
        await inventory.addAllItems();
      }
    },
    {
      title: '③ 商品詳細画面から追加して購入できること',
      action: async () => {
        await inventory.addFirstItem();
      }
    },
    {
      title: '④ カート画面で内容確認後に購入できること',
      action: async () => {
        await inventory.addFirstItem();
        await cart.goto();
        await cart.expectItemCount(1);
      }
    },
    {
      title: '⑤ 全件追加後に2件削除して購入できること',
      action: async () => {

        // 全件追加
        const count = await inventory.addAllItems();

        // カートへ移動
        await cart.goto();

        // 2件削除
        await cart.removeFirstItem();
        await cart.removeFirstItem();

        // 件数確認
        await cart.expectItemCount(count - 2);
      }
    },
    {
      title: '⑥ 1件追加後に一覧へ戻り全件追加して購入できること',
      action: async () => {

        // 1件追加
        await inventory.addFirstItem();

        // カートへ移動
        await cart.goto();

        // 一覧へ戻る
        await cart.continueShopping();

        // 全件追加
        await inventory.addAllItems();
      }
    }
  ];

  /*
  ================================
  data-driven実行
  ================================
  */
  for (const item of cases) {

    test(item.title, async () => {

      // ケース固有処理実行
      await item.action();

      // カートへ移動
      await cart.goto();

      // 購入一括実行
      await checkout.completePurchase(
        'Taro',
        'Yamada',
        '12345'
      );

      // 完了確認
      await checkout.expectComplete();
    });
  }

});