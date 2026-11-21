import { CartFlow } from '../../flows/CartFlow';
import { Product } from '../../data/products';

// カート画面の表示や状態を確かめる関数。
// テストからは画面の部品を直接呼ばず、カート画面の操作の単位を通して確かめる

export async function expectCartPageLayout(cartFlow: CartFlow) {
  await cartFlow.expectCartPageLayout();
}

export async function expectCartItemCount(cartFlow: CartFlow, expectedCount: number) {
  await cartFlow.expectItemCount(expectedCount);
}

export async function expectCartItemsDisplayed(cartFlow: CartFlow, products: readonly Product[]) {
  await cartFlow.expectItemsDisplayed(products);
}

export async function expectCartItemNamesInOrder(cartFlow: CartFlow, productNames: string[]) {
  await cartFlow.expectItemNamesInOrder(productNames);
}

export async function expectInCart(cartFlow: CartFlow, productName: string) {
  await cartFlow.expectInCart(productName);
}

export async function expectBadgeCount(cartFlow: CartFlow, expectedCount: number) {
  await cartFlow.expectBadgeCount(expectedCount);
}

export async function expectOnInventoryPage(cartFlow: CartFlow) {
  await cartFlow.expectOnInventoryPage();
}

export async function expectOnCheckoutStepOnePage(cartFlow: CartFlow) {
  await cartFlow.expectOnCheckoutStepOnePage();
}

export async function expectOnProductDetailPage(cartFlow: CartFlow, productId: number) {
  await cartFlow.expectOnProductDetailPage(productId);
}
