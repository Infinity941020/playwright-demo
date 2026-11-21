import { CheckoutFlow } from '../../flows/CheckoutFlow';

// Checkout の画面の表示や状態を確かめる関数。
// テストからは画面の部品を直接呼ばず、Checkout の操作の単位を通して確かめる

export async function expectOnCheckoutStepOnePage(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectOnStepOnePage();
}

export async function expectCheckoutStepOnePageLayout(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectStepOnePageLayout();
}

export async function expectCheckoutErrorMessage(checkoutFlow: CheckoutFlow, message: string) {
  await checkoutFlow.expectErrorMessage(message);
}

export async function expectNoCheckoutError(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectNoError();
}

export async function expectCheckoutInfoValues(
  checkoutFlow: CheckoutFlow,
  firstName: string,
  lastName: string,
  postalCode: string,
) {
  await checkoutFlow.expectInfoValues(firstName, lastName, postalCode);
}

export async function expectBadgeCount(checkoutFlow: CheckoutFlow, expectedCount: number) {
  await checkoutFlow.expectBadgeCount(expectedCount);
}

export async function expectOnCheckoutStepTwoPage(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectOnStepTwoPage();
}

export async function expectOnCartPage(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectOnCartPage();
}

export async function expectCartItemCount(checkoutFlow: CheckoutFlow, expectedCount: number) {
  await checkoutFlow.expectCartItemCount(expectedCount);
}

export async function expectInCart(checkoutFlow: CheckoutFlow, productName: string) {
  await checkoutFlow.expectInCart(productName);
}

// 購入が完了したことを確かめる（Complete のテストが使う）
export async function expectCheckoutComplete(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.verifyOrderComplete();
}
