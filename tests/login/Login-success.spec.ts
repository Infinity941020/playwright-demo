// Playwrightのテスト機能とアサーション機能をインポート
import { test, expect } from '@playwright/test';

// ログイン業務フローをまとめたFlowクラスをインポート
import { LoginFlow } from '../../flows/LoginFlow';

// テスト用ユーザーデータをインポート
import { users } from '../../data/users';

/*
========================================
ログイン機能の正常系テスト
（業務フロー単位でのE2Eテスト）
========================================
*/

test('ログイン成功して商品一覧が表示されること', async ({ page }) => {

  // ログインフローを生成
  const loginFlow = new LoginFlow(page);

  // ログイン処理を実行（業務単位）
  await loginFlow.login(
    users.standard.username,
    users.standard.password
  );

  // 商品一覧ページへ遷移していることを確認
  await expect(page).toHaveURL(/inventory/);

  // 商品一覧が表示されていることを確認
  await expect(page.locator('.inventory_list')).toBeVisible();
});