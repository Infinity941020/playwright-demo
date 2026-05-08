// Playwrightのテスト機能とアサーション機能をインポート
import { test } from '@playwright/test';

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

  // ================================
  // ■ 業務操作（ログイン実行）
  // ================================
  await loginFlow.login(
    users.standard.username,
    users.standard.password
  );

  // ================================
  // ■ 検証（業務レベル）
  // ================================
  await loginFlow.expectLoginSuccess();
});