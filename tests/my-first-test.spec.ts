import { test, expect } from '@playwright/test';

test('Google検索ページが表示される', async ({ page }) => {
  // Googleのトップページにアクセス
  await page.goto('https://www.google.com');
  
  // ページタイトルに「Google」が含まれることを確認
  await expect(page).toHaveTitle(/Google/);
  
  // 検索ボックスが表示されていることを確認
  const searchBox = page.locator('textarea[name="q"]');
  await expect(searchBox).toBeVisible();
  
  console.log('✅ テスト成功！');
});