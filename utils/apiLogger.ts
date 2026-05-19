/*
================================
API Logger（Phase6）
================================
・APIレスポンスの出力専用
・spec側のconsole.logを統一
・将来のログ拡張ポイント
================================
*/

import { APIResponse } from '@playwright/test';

/*
レスポンスをそのまま出力
*/
export async function logApiResponse(response: APIResponse) {
  console.log(await response.text());
}