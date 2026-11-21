// Checkout Step One画面で、入力値が保たれること・消えることのテスト
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectCheckoutErrorMessage,
  expectCheckoutInfoValues,
  expectNoCheckoutError,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { messages } from '../../../data/messages';
import { products } from '../../../data/products';

test.describe('Checkout Step One画面の入力値の保持', () => {

  test('TC-CO1-007：エラー表示後、入力値が保持され、エラー表示を閉じても保持されること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const { firstName, lastName } = checkoutData;

    await checkoutFlow.openStepOneWith([products.backpack]);

    await checkoutFlow.fillCheckoutInfo(firstName, lastName, '');
    await checkoutFlow.proceedToOverviewStep();

    await expectCheckoutErrorMessage(checkoutFlow, messages.checkout.postalCodeRequired);
    await expectCheckoutInfoValues(checkoutFlow, firstName, lastName, '');

    await checkoutFlow.closeError();

    await expectNoCheckoutError(checkoutFlow);
    await expectCheckoutInfoValues(checkoutFlow, firstName, lastName, '');
  });

  test('TC-CO1-011：再読み込みすると、入力値が空に戻ること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);
    const { firstName, lastName, postalCode } = checkoutData;

    await checkoutFlow.openStepOneWith([products.backpack]);

    await checkoutFlow.fillCheckoutInfo(firstName, lastName, postalCode);

    // 入力が効かなかったときに、再読み込みで空に戻ったように見えて成功してしまわないように、先に入力されたことを確かめる
    await expectCheckoutInfoValues(checkoutFlow, firstName, lastName, postalCode);

    await checkoutFlow.reloadStepOne();

    await expectCheckoutInfoValues(checkoutFlow, '', '', '');
  });
});
