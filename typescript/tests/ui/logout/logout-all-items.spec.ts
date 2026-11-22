// 左上のメニューの All Items のテスト
import { test } from '../../../fixtures/loginFixture';
import { CartFlow } from '../../../flows/CartFlow';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { LogoutFlow } from '../../../flows/LogoutFlow';
import { expectBadgeCount, expectRemoveButtonShown } from '../../../utils/uiAssertions/inventoryAssertions';
import { expectMenuClosed, expectOnInventoryPage } from '../../../utils/uiAssertions/logoutAssertions';
import { products } from '../../../data/products';

test.describe('All Items', () => {

  test('TC-LOGOUT-010：Cart画面で All Items を押すと、Products画面へ遷移し、メニューが閉じ、カートの中身が変わらないこと', async ({ loggedPage }) => {

    const logoutFlow = new LogoutFlow(loggedPage);
    const cartFlow = new CartFlow(loggedPage);
    const inventoryFlow = new InventoryFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await cartFlow.openCartWith([backpack, bikeLight]);

    await logoutFlow.openAllItems();

    // メニューが閉じていることは、画面が移る前でも成り立ちうるため、先に商品一覧画面であることを確かめる
    await expectOnInventoryPage(logoutFlow);

    await expectMenuClosed(logoutFlow);
    await expectBadgeCount(inventoryFlow, 2);
    await expectRemoveButtonShown(inventoryFlow, backpack.name);
    await expectRemoveButtonShown(inventoryFlow, bikeLight.name);
  });
});
