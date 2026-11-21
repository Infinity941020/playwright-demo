// Checkout Step One画面から Cancel で戻ったときに、カートが変わらないことのテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectBadgeCount,
  expectCartItemCount,
  expectInCart,
  expectOnCartPage,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('Checkout Step One画面とカートの関係', () => {

  test('TC-CO1-012：Cancel で Cart画面へ戻っても、カートの内容とバッジが変わらないこと', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const { backpack, bikeLight } = products;

    await checkoutFlow.openStepOneWith([backpack, bikeLight]);

    await checkoutFlow.fillCheckoutInfo(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
    await checkoutFlow.cancelFromStepOne();

    // 失敗したときに、画面が移らなかったのかを区別できるように、先にカート画面であることを確かめる
    await expectOnCartPage(checkoutFlow);

    // 並び順は TC-CART-003 で確かめるため、ここでは問わない
    await expectCartItemCount(checkoutFlow, 2);
    await expectInCart(checkoutFlow, backpack.name);
    await expectInCart(checkoutFlow, bikeLight.name);
    await expectBadgeCount(checkoutFlow, 2);
  });
});
