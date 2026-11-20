// Products画面からの画面遷移のテスト
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectOnCartPage,
  expectOnProductDetailPage,
} from '../../../utils/uiAssertions/inventoryAssertions';
import { products } from '../../../data/products';

test.describe('Products画面からの画面遷移', () => {

  // 商品名と商品画像のどちらを押しても、同じ商品詳細画面へ移ることを、同じ確かめ方で確かめる
  const productDetailCases = [
    { id: 'TC-PROD-009', title: '商品名を押すと、商品詳細画面へ遷移すること', via: 'name' as const },
    { id: 'TC-PROD-010', title: '商品画像を押すと、商品詳細画面へ遷移すること', via: 'image' as const },
  ];

  for (const testCase of productDetailCases) {

    test(`${testCase.id}：${testCase.title}`, async ({ loggedPage }) => {

      const inventoryFlow = new InventoryFlow(loggedPage);
      const backpack = products.backpack;

      await inventoryFlow.openProductDetail(backpack.name, testCase.via);

      await expectOnProductDetailPage(inventoryFlow, backpack.id);
    });
  }

  test('TC-PROD-011：カートアイコンを押すと、Cart画面へ遷移すること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);

    await inventoryFlow.openCart();

    await expectOnCartPage(inventoryFlow);
  });
});
