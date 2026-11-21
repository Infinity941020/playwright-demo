// Checkout Step Two画面の表示のテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectBadgeCount,
  expectCheckoutStepTwoPageLayout,
  expectStepTwoItemNamesInOrder,
  expectStepTwoItemsDisplayed,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products, productsInDisplayOrder } from '../../../data/products';

test.describe('Checkout Step Two画面の表示', () => {

  test('TC-CO2-001：画面が仕様どおりに表示されること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openStepTwoWith([products.backpack, products.bikeLight], checkoutData);

    await expectCheckoutStepTwoPageLayout(checkoutFlow);
    await expectBadgeCount(checkoutFlow, 2);
  });

  test('TC-CO2-002：全商品をカートに入れたとき、全商品が仕様どおりに表示されること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openStepTwoWith(productsInDisplayOrder, checkoutData);

    await expectStepTwoItemsDisplayed(checkoutFlow, productsInDisplayOrder);
  });

  test('TC-CO2-003：カートに追加した順に表示されること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    // 商品名・商品の番号・価格のどの順（昇順・降順）にもならない並びにして、カートの順で並んでいることを区別できるようにする。
    // 入れる商品の番号は 0→4→2
    const cartOrder = [products.bikeLight, products.backpack, products.onesie];

    await checkoutFlow.openStepTwoWith(cartOrder, checkoutData);

    await expectStepTwoItemNamesInOrder(checkoutFlow, cartOrder.map((product) => product.name));
  });
});
