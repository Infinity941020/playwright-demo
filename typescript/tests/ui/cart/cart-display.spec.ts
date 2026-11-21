// カート画面の表示のテスト
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import {
  expectBadgeCount,
  expectCartItemCount,
  expectCartItemsDisplayed,
  expectCartPageLayout,
} from '../../../utils/uiAssertions/cartAssertions';
import { productsInDisplayOrder } from '../../../data/products';

test.describe('カート画面の表示', () => {

  test('TC-CART-001：カートが空のとき、空の状態の表示になること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await cartFlow.openCartWith([]);

    await expectCartPageLayout(cartFlow);
    await expectCartItemCount(cartFlow, 0);
    await expectBadgeCount(cartFlow, 0);
  });

  test('TC-CART-002：全商品をカートに入れたとき、全商品が仕様どおりに表示されること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await cartFlow.openCartWith(productsInDisplayOrder);

    await expectCartItemsDisplayed(cartFlow, productsInDisplayOrder);
    await expectBadgeCount(cartFlow, productsInDisplayOrder.length);
  });
});
