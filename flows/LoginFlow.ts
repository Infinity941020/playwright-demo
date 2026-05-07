// LoginPage（UI操作クラス）を利用するためのインポート
import { LoginPage } from '../pages/LoginPage';

// PlaywrightのPage型を使用するためのインポート
import { Page } from '@playwright/test';

// ログイン処理の業務フローをまとめたクラス
export class LoginFlow {

  // LoginPageインスタンスを保持するプロパティ
  private loginPage: LoginPage;

  // コンストラクタ（PageからLoginPageを生成）
  constructor(page: Page) {

    // LoginPageを生成して保持（UI操作層）
    this.loginPage = new LoginPage(page);
  }

  // ログイン処理全体のフロー（業務単位）
  async login(username: string, password: string) {

    // ログイン画面へ遷移
    await this.loginPage.goto();

    // ユーザー名を入力
    await this.loginPage.enterUsername(username);

    // パスワードを入力
    await this.loginPage.enterPassword(password);

    // ログインボタンをクリック
    await this.loginPage.clickLogin();
  }

  // LoginPageインスタンスを外部で使いたい場合の取得用（任意）
  getPage(): LoginPage {

    // LoginPageを返却（テスト側でassertするため）
    return this.loginPage;
  }
}