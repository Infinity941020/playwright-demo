/*
================================
API Logger（Phase7）
================================
・APIレスポンスの出力専用
・spec側のconsole.logを統一
・CIで読みやすいフォーマットに統一
================================
*/

import { APIResponse } from '@playwright/test';

/*
レスポンスを整形して出力
*/
export async function logApiResponse(response: APIResponse) {

  const status = response.status();
  const bodyText = await response.text();

  console.log(`
================================
API RESPONSE LOG
================================
STATUS: ${status}
--------------------------------
BODY:
${bodyText}
================================
  `.trim());
}