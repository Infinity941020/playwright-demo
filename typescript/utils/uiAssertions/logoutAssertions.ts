import { LogoutFlow } from '../../flows/LogoutFlow';

// 左上のメニューの表示や状態を確かめる関数。
// テストからは画面の部品を直接呼ばず、メニューの操作の単位を通して確かめる

export async function expectMenuClosed(logoutFlow: LogoutFlow) {
  await logoutFlow.expectMenuClosed();
}

export async function expectMenuItems(logoutFlow: LogoutFlow) {
  await logoutFlow.expectMenuItems();
}

export async function expectOnInventoryPage(logoutFlow: LogoutFlow) {
  await logoutFlow.expectOnInventoryPage();
}
