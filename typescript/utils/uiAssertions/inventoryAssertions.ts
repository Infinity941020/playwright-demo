import { InventoryFlow } from '../../flows/InventoryFlow';

// 商品一覧画面の表示や状態を確かめる関数。
// テストからは画面の部品を直接呼ばず、商品一覧画面の操作の単位を通して確かめる

export async function expectOnInventoryPage(inventoryFlow: InventoryFlow) {
  await inventoryFlow.expectOnInventoryPage();
}
