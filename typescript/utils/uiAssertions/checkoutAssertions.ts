import { CheckoutFlow } from '../../flows/CheckoutFlow';
import { Product } from '../../data/products';

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

export async function expectCheckoutStepTwoPageLayout(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectStepTwoPageLayout();
}

export async function expectStepTwoItemsDisplayed(checkoutFlow: CheckoutFlow, products: readonly Product[]) {
  await checkoutFlow.expectStepTwoItemsDisplayed(products);
}

export async function expectStepTwoItemNamesInOrder(checkoutFlow: CheckoutFlow, productNames: readonly string[]) {
  await checkoutFlow.expectStepTwoItemNamesInOrder(productNames);
}

export async function expectStepTwoItemCount(checkoutFlow: CheckoutFlow, expectedCount: number) {
  await checkoutFlow.expectStepTwoItemCount(expectedCount);
}

export async function expectStepTwoItemListed(checkoutFlow: CheckoutFlow, productName: string) {
  await checkoutFlow.expectStepTwoItemListed(productName);
}

export async function expectStepTwoAmounts(checkoutFlow: CheckoutFlow, itemTotal: string, tax: string, total: string) {
  await checkoutFlow.expectStepTwoAmounts(itemTotal, tax, total);
}

export async function expectOnCheckoutCompletePage(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectOnCompletePage();
}

export async function expectCheckoutCompletePageLayout(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectCompletePageLayout();
}

export async function expectOnInventoryPage(checkoutFlow: CheckoutFlow) {
  await checkoutFlow.expectOnInventoryPage();
}

export async function expectOnProductDetailPage(checkoutFlow: CheckoutFlow, productId: number) {
  await checkoutFlow.expectOnProductDetailPage(productId);
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
