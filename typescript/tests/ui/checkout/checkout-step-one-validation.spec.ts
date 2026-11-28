// Checkout Step One画面の入力チェックのテスト。
// 入力が足りないときは、エラーの文言の全体と、Checkout Step One画面のままであることを確かめる
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import {
  expectCheckoutErrorMessage,
  expectOnCheckoutStepOnePage,
  expectOnCheckoutStepTwoPage,
} from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { messages } from '../../../data/messages';
import { products } from '../../../data/products';

test.describe('Checkout Step One画面の入力チェック', () => {

  test('TC-CO1-002：3項目すべて未入力のとき、名のエラーだけが表示されること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openStepOneWith([products.backpack]);

    await checkoutFlow.proceedToOverviewStep();

    await expectCheckoutErrorMessage(checkoutFlow, messages.checkout.firstNameRequired);
    await expectOnCheckoutStepOnePage(checkoutFlow);
  });

  // 1項目だけを空欄にする3通りで、同じ確かめ方をする
  const singleFieldBlankCases = [
    {
      id: 'TC-CO1-003',
      title: '名だけが未入力のとき、名のエラーが表示されること',
      firstName: '',
      lastName: checkoutData.lastName,
      postalCode: checkoutData.postalCode,
      errorMessage: messages.checkout.firstNameRequired,
    },
    {
      id: 'TC-CO1-004',
      title: '姓だけが未入力のとき、姓のエラーが表示されること',
      firstName: checkoutData.firstName,
      lastName: '',
      postalCode: checkoutData.postalCode,
      errorMessage: messages.checkout.lastNameRequired,
    },
    {
      id: 'TC-CO1-005',
      title: '郵便番号だけが未入力のとき、郵便番号のエラーが表示されること',
      firstName: checkoutData.firstName,
      lastName: checkoutData.lastName,
      postalCode: '',
      errorMessage: messages.checkout.postalCodeRequired,
    },
  ];

  for (const testCase of singleFieldBlankCases) {

    test(`${testCase.id}：${testCase.title}`, async ({ loggedPage }) => {

      const checkoutFlow = new CheckoutFlow(loggedPage);

      await checkoutFlow.openStepOneWith([products.backpack]);

      await checkoutFlow.fillCheckoutInfo(testCase.firstName, testCase.lastName, testCase.postalCode);
      await checkoutFlow.proceedToOverviewStep();

      await expectCheckoutErrorMessage(checkoutFlow, testCase.errorMessage);
      await expectOnCheckoutStepOnePage(checkoutFlow);
    });
  }

  test('TC-CO1-006：エラー表示後に入力を修正して再度 Continue を押すと、次の未入力項目のエラーに切り替わり、すべて入力すれば次の画面へ進めること', async ({ loggedPage }) => {

    const checkoutFlow = new CheckoutFlow(loggedPage);

    await checkoutFlow.openStepOneWith([products.backpack]);

    // 最初のエラーは、このテストでは確かめない（TC-CO1-002 で確かめる）
    await checkoutFlow.proceedToOverviewStep();

    await checkoutFlow.fillCheckoutInfo(checkoutData.firstName, '', '');
    await checkoutFlow.proceedToOverviewStep();

    await expectCheckoutErrorMessage(checkoutFlow, messages.checkout.lastNameRequired);
    await expectOnCheckoutStepOnePage(checkoutFlow);

    await checkoutFlow.fillCheckoutInfo(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
    await checkoutFlow.proceedToOverviewStep();

    await expectOnCheckoutStepTwoPage(checkoutFlow);
  });
});
