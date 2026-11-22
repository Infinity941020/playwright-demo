import { Page } from '@playwright/test';
import { MenuPage } from '../pages/MenuPage';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// 左上のメニューでの操作（開閉・ログアウト・All Items）と、その結果の確認を、利用者の操作の単位でまとめる。
// - メニューの項目を押す操作は、必ずメニューを開き、開いたことを確かめてから押す
// - ログアウトする操作は、ログイン画面へ戻ったことまで確かめる。ほかの押す操作は、移った先の画面を確かめない
export class LogoutFlow {

  private readonly menu: MenuPage;

  // ログアウトした後に移るログイン画面の表示を確かめるためと、ブラウザの「戻る」を押すために使う
  private readonly loginPage: LoginPage;

  // All Items を押した後に移る、商品一覧画面の表示を確かめるために使う
  private readonly inventoryPage: InventoryPage;

  constructor(page: Page) {

    this.menu = new MenuPage(page);
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  // メニューを開く。閉じたことを確かめるテストが、開かなかったときにも成功してしまわないように、開いたことを確かめる
  async openMenu() {

    await this.menu.waitUntilMenuClosed();
    await this.menu.clickMenuButton();
    await this.menu.expectMenuOpened();
  }

  async closeMenuWithButton() {
    await this.menu.clickCloseButton();
  }

  async closeMenuWithEscape() {
    await this.menu.pressEscape();
  }

  // ログアウトした後の確認が、ログアウトできていない画面のまま進まないように、ログイン画面へ戻ったことまで確かめる
  async logout() {

    await this.openMenu();
    await this.menu.clickLogout();
    await this.loginPage.expectOnPage();
  }

  async openAllItems() {

    await this.openMenu();
    await this.menu.clickAllItems();
  }

  async goBackInBrowser() {
    await this.loginPage.goBack();
  }

  async expectMenuClosed() {
    await this.menu.expectMenuClosed();
  }

  async expectMenuItems() {
    await this.menu.expectMenuItems();
  }

  async expectOnInventoryPage() {
    await this.inventoryPage.expectOnPage();
  }
}
