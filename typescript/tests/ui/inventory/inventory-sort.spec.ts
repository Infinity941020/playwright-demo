// Products画面のソートのテスト
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectProductNamesInOrder,
  expectProductPricesInOrder,
  expectSelectedSort,
} from '../../../utils/uiAssertions/inventoryAssertions';
import { productsInDisplayOrder, sortOptions } from '../../../data/products';

const productNames = productsInDisplayOrder.map((product) => product.name);
const prices = productsInDisplayOrder.map((product) => product.price);

// 期待する並びを作るために、「$29.99」の形の価格を数に直す
function priceValue(price: string): number {
  return Number(price.replace('$', ''));
}

test.describe('Products画面のソート', () => {

  test('TC-PROD-002：初期表示のソートが Name (A to Z) であること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);

    await expectSelectedSort(inventoryFlow, sortOptions.nameAsc);
    await expectProductNamesInOrder(inventoryFlow, productNames);
  });

  // 価格のソートは、価格の並びだけを確かめる（同じ価格どうしの順番は、仕様で決めていない）
  const sortCases = [
    {
      id: 'TC-PROD-003',
      title: 'Name (Z to A) を選ぶと、商品名の降順に並ぶこと',
      optionLabel: sortOptions.nameDesc,
      expectOrder: expectProductNamesInOrder,
      expected: [...productNames].reverse(),
    },
    {
      id: 'TC-PROD-004',
      title: 'Price (low to high) を選ぶと、価格の昇順に並ぶこと',
      optionLabel: sortOptions.priceAsc,
      expectOrder: expectProductPricesInOrder,
      expected: [...prices].sort((a, b) => priceValue(a) - priceValue(b)),
    },
    {
      id: 'TC-PROD-005',
      title: 'Price (high to low) を選ぶと、価格の降順に並ぶこと',
      optionLabel: sortOptions.priceDesc,
      expectOrder: expectProductPricesInOrder,
      expected: [...prices].sort((a, b) => priceValue(b) - priceValue(a)),
    },
  ];

  for (const sortCase of sortCases) {

    test(`${sortCase.id}：${sortCase.title}`, async ({ loggedPage }) => {

      const inventoryFlow = new InventoryFlow(loggedPage);

      await inventoryFlow.sortBy(sortCase.optionLabel);

      await sortCase.expectOrder(inventoryFlow, sortCase.expected);
    });
  }
});
