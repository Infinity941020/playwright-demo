// Products画面の表示のテスト
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { expectProductsDisplayed } from '../../../utils/uiAssertions/inventoryAssertions';
import { productsInDisplayOrder } from '../../../data/products';

test.describe('Products画面の表示', () => {

  test('TC-PROD-001：商品一覧が仕様どおりに表示されること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);

    await expectProductsDisplayed(inventoryFlow, productsInDisplayOrder);
  });
});
