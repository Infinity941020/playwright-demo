 // Playwrightのテスト機能のうち「setup専用のtest」をimport
import { test as setup } from '@playwright/test';

 // ログイン操作をまとめたLoginPageクラスをimport
import { LoginPage } from '../../pages/LoginPage';

 // setup処理（ログイン状態を作る専用テスト）
setup('login and save storage state', async ({ page }) => {

  // LoginPageインスタンスを生成（ログイン操作をまとめて使う）
  const loginPage = new LoginPage(page);

  // ログイン画面へ遷移する
  await loginPage.goto();

  // ユーザー名・パスワードでログインを実行する
  await loginPage.login('standard_user', 'secret_sauce');

  // 現在のログイン状態（Cookieなど）をファイルに保存する
  // → これを次回以降のテストで再利用する
  await page.context().storageState({ path: 'auth.json' });
});