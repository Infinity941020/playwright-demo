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
*/
export async function executeGetUserApi(
  request: APIRequestContext,
  userId: number
) {
  return request.get(`${API_BASE_URL}/users/${userId}`);
}

/*
================================
Cart API（Phase8追加）
================================
・JSONPlaceholderのpostsを擬似Cartとして使用
================================
*/

/*
Cart追加
*/
export async function executeAddCartApi(
  request: APIRequestContext,
  payload: object
) {
  return request.post(`${API_BASE_URL}/posts`, {
    data: payload
  });
}

/*
Cart取得
*/
export async function executeGetCartApi(
  request: APIRequestContext
) {
  return request.get(`${API_BASE_URL}/posts`);
}

/*
Cart削除
*/
export async function executeDeleteCartApi(
  request: APIRequestContext,
  cartId: number
) {
  return request.delete(`${API_BASE_URL}/posts/${cartId}`);
}