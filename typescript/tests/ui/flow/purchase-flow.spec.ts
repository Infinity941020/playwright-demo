// 商品の追加から購入完了までを、1本で通すテスト。
// 画面ごとのテストは前提の状態をブラウザの保存領域への書き込みや URL での直接表示で作り、画面と画面のつなぎ目の不具合を見つけられないため、
// ログイン済みの画面を用意した後は、すべて画面の操作でつなぐ
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { CartFlow } from '../../../flows/CartFlow';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import { expectOnCartPage } from '../../../utils/uiAssertions/inventoryAssertions';
import {
  expectCartItemNamesInOrder,
  expectOnCheckoutStepOnePage,
} from '../../../utils/uiAssertions/cartAssertions';
import {
  expectBadgeCount,
  expectOnCheckoutCompletePage,
  expectOnCheckoutStepTwoPage,
  expectStepTwoAmounts,
  expectStepTwoItemNamesInOrder,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products } from '../../../data/products';

test.describe('通しの購入', () => {

  test('TC-FLOW-001：画面での追加から購入完了まで、画面の操作だけで通して購入できること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);
    const cartFlow = new CartFlow(loggedPage);
    const checkoutFlow = new CheckoutFlow(loggedPage);

    // 商品名・商品の番号・価格のどの順（昇順・降順）にもならない並びにして、追加した順のまま引き継がれていることを区別できるようにする。
    // 追加する商品の番号は 0→4→2
    const addedOrder = [products.bikeLight.name, products.backpack.name, products.onesie.name];

    for (const productName of addedOrder) {
      await inventoryFlow.addToCart(productName);
    }
    await expectBadgeCount(checkoutFlow, addedOrder.length);

    // 失敗したときに、画面が移らなかったのか、移った先の中身が違うのかを区別できるように、画面が移るたびに先に移った先の画面を確かめる
    await inventoryFlow.openCart();
    await expectOnCartPage(inventoryFlow);
    await expectCartItemNamesInOrder(cartFlow, addedOrder);

    await cartFlow.checkout();
    await expectOnCheckoutStepOnePage(cartFlow);

    await checkoutFlow.fillCheckoutInfo(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
    await checkoutFlow.proceedToOverviewStep();
    await expectOnCheckoutStepTwoPage(checkoutFlow);
    await expectStepTwoItemNamesInOrder(checkoutFlow, addedOrder);

    // 期待する金額は、計算で作らず、テストケース（画面で確かめた値）と同じ値を書く
    await expectStepTwoAmounts(checkoutFlow, 'Item total: $47.97', 'Tax: $3.84', 'Total: $51.81');

    await checkoutFlow.completePurchase();

    // バッジがないことは、待っている間に画面が移れば Complete画面を確かめないまま成り立つため、先に Complete画面であることを確かめる
    await expectOnCheckoutCompletePage(checkoutFlow);
    await expectBadgeCount(checkoutFlow, 0);
  });
});
