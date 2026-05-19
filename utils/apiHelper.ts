/*
================================
API Helper（実行専用レイヤー）
================================
・HTTPリクエスト実行のみ担当
・検証ロジックは持たない
・URL/endpointはここで管理（Aルート：JSONPlaceholder統一）
================================
*/

// Playwright APIリクエスト型
import { APIRequestContext } from '@playwright/test';

// API設定（環境依存をここに集約）
import { API_BASE_URL } from './apiConfig';

/*
================================
Login API（擬似POST）
================================
・JSONPlaceholderでは /login は存在しないため /posts を代替利用
・認証ではなく「作成API」としてログインを擬似表現
================================
*/
export async function executeLoginApi(
  request: APIRequestContext,
  payload: object
) {
  return request.post(`${API_BASE_URL}/posts`, {
    data: payload
  });
}

/*
================================
User API（GET）
================================
・ユーザー情報取得API
・JSONPlaceholder標準エンドポイントを使用
================================
*/
export async function executeGetUserApi(
  request: APIRequestContext,
  userId: number
) {
  return request.get(`${API_BASE_URL}/users/${userId}`);
}