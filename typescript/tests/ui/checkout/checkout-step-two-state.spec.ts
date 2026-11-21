// Checkout Step Two画面で Finish・Cancel・再読み込みをした後の状態のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import {
  expectBadgeCount,
  expectOnInventoryPage,
  expectStepTwoAmounts,
  expectStepTwoItemCount,
  expectStepTwoItemListed,
} from '../../../utils/uiAssertions/checkoutAssertions';
import {
  expectAddToCartButtonShown,
  expectRemoveButtonShown,
} from '../../../utils/uiAssertions/inventoryAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('Checkout Step Two画面の状態', () => {

  test('TC-CO2-011：Finish を押すと、カートが空になること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const inventoryFlow = new InventoryFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await checkoutFlow.openStepTwoWith([backpack, bikeLight], checkoutData);

    await checkoutFlow.completePurchase();

    await expectBadgeCount(checkoutFlow, 0);

    // Complete画面での操作は Complete画面のテストで確かめるため、ここでは使わずに URL で開く
    await inventoryFlow.accessInventoryDirectly();

    // 失敗したときに、画面が開けなかったのか、ボタンの表示が戻っていないのかを区別できるように、先に商品一覧画面であることを確かめる
    await expectOnInventoryPage(checkoutFlow);

    await expectAddToCartButtonShown(inventoryFlow, backpack.name);
    await expectAddToCartButtonShown(inventoryFlow, bikeLight.name);
  });

  test('TC-CO2-012：Cancel を押しても、カートの中身が変わらないこと', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const inventoryFlow = new InventoryFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await checkoutFlow.openStepTwoWith([backpack, bikeLight], checkoutData);

    await checkoutFlow.cancelFromStepTwo();

    // 失敗したときに、画面が移らなかったのか、カートの中身が変わったのかを区別できるように、先に商品一覧画面であることを確かめる
    await expectOnInventoryPage(checkoutFlow);

    await expectRemoveButtonShown(inventoryFlow, backpack.name);
    await expectRemoveButtonShown(inventoryFlow, bikeLight.name);
    await expectBadgeCount(checkoutFlow, 2);
  });

  test('TC-CO2-013：再読み込みしても、商品・金額・バッジの表示が変わらないこと', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await checkoutFlow.openStepTwoWith([backpack, bikeLight], checkoutData);

    await checkoutFlow.reloadStepTwo();

    // 並び順は TC-CO2-003 で確かめるため、ここでは問わない
    await expectStepTwoItemCount(checkoutFlow, 2);
    await expectStepTwoItemListed(checkoutFlow, backpack.name);
    await expectStepTwoItemListed(checkoutFlow, bikeLight.name);
    await expectStepTwoAmounts(checkoutFlow, 'Item total: $39.98', 'Tax: $3.20', 'Total: $43.18');
    await expectBadgeCount(checkoutFlow, 2);
  });
});
