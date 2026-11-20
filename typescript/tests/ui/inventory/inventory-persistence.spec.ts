// Products画面を再読み込みした後も、状態が保たれることのテスト
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectBadgeCount,
  expectProductNamesInOrder,
  expectRemoveButtonShown,
  expectSelectedSort,
} from '../../../utils/uiAssertions/inventoryAssertions';
import { productsInDisplayOrder, products, sortOptions } from '../../../data/products';

test.describe('Products画面の状態保持', () => {

  test('TC-PROD-012：再読み込み後も、カートの内容が保持されること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);
    const backpack = products.backpack.name;

    await inventoryFlow.addToCart(backpack);
    await inventoryFlow.reloadInventory();

    await expectRemoveButtonShown(inventoryFlow, backpack);
    await expectBadgeCount(inventoryFlow, 1);
  });

  test('TC-PROD-013：再読み込み後、ソートが Name (A to Z) に戻ること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);

    await inventoryFlow.sortBy(sortOptions.priceDesc);

    // 並べ替えが効かなくても、再読み込みの後は Name (A to Z) になるため、並べ替えが効いたことを先に確かめる
    await expectSelectedSort(inventoryFlow, sortOptions.priceDesc);

    await inventoryFlow.reloadInventory();

    await expectSelectedSort(inventoryFlow, sortOptions.nameAsc);
    await expectProductNamesInOrder(inventoryFlow, productsInDisplayOrder.map((product) => product.name));
  });
});
