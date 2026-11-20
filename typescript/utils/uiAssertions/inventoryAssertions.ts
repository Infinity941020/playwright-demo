import { InventoryFlow } from '../../flows/InventoryFlow';
import { Product } from '../../data/products';

// 商品一覧画面の表示や状態を確かめる関数。
// テストからは画面の部品を直接呼ばず、商品一覧画面の操作の単位を通して確かめる

export async function expectProductsDisplayed(inventoryFlow: InventoryFlow, products: Product[]) {
  await inventoryFlow.expectProductsDisplayed(products);
}

export async function expectProductNamesInOrder(inventoryFlow: InventoryFlow, productNames: string[]) {
  await inventoryFlow.expectProductNamesInOrder(productNames);
}

export async function expectProductPricesInOrder(inventoryFlow: InventoryFlow, prices: string[]) {
  await inventoryFlow.expectProductPricesInOrder(prices);
}

export async function expectSelectedSort(inventoryFlow: InventoryFlow, optionLabel: string) {
  await inventoryFlow.expectSelectedSort(optionLabel);
}

export async function expectRemoveButtonShown(inventoryFlow: InventoryFlow, productName: string) {
  await inventoryFlow.expectRemoveButtonShown(productName);
}

export async function expectAddToCartButtonShown(inventoryFlow: InventoryFlow, productName: string) {
  await inventoryFlow.expectAddToCartButtonShown(productName);
}

export async function expectBadgeCount(inventoryFlow: InventoryFlow, expectedCount: number) {
  await inventoryFlow.expectBadgeCount(expectedCount);
}

export async function expectOnInventoryPage(inventoryFlow: InventoryFlow) {
  await inventoryFlow.expectOnInventoryPage();
}

export async function expectOnProductDetailPage(inventoryFlow: InventoryFlow, productId: number) {
  await inventoryFlow.expectOnProductDetailPage(productId);
}

export async function expectOnCartPage(inventoryFlow: InventoryFlow) {
  await inventoryFlow.expectOnCartPage();
}
