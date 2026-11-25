import type { APIRequestContext, APIResponse } from '@playwright/test';

// API ごとにリクエストを送る。
// - パスだけを持つ。接続先（ホストとポート）は、テストごとに立てるモックのサーバーに合わせて、通信の部品が決める（fixtures/apiFixture.ts）
// - 本文に null を渡すと、本文なしで送る（本文がないときの返事を確かめるため）
const BASE_PATH = '/api';

export type ApiPayload = Record<string, unknown>;

export function executeLoginApi(request: APIRequestContext, payload: ApiPayload): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/login`, { data: payload });
}

// ユーザーの情報を取得するだけで、変更はしない
export function executeGetUserApi(request: APIRequestContext, userId: number): Promise<APIResponse> {
  return request.get(`${BASE_PATH}/users/${userId}`);
}

export function executeAddCartApi(request: APIRequestContext, payload: ApiPayload | null): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/cart`, { data: payload ?? undefined });
}

export function executeGetCartApi(request: APIRequestContext): Promise<APIResponse> {
  return request.get(`${BASE_PATH}/cart`);
}

export function executeDeleteCartApi(request: APIRequestContext, cartId: number): Promise<APIResponse> {
  return request.delete(`${BASE_PATH}/cart/${cartId}`);
}

export function executeCheckoutApi(request: APIRequestContext, payload: ApiPayload | null): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/checkout`, { data: payload ?? undefined });
}

// ログアウトで送るもの。トークンを渡すと Authorization ヘッダーに付け、本文を渡さなければ本文なしで送る
export type LogoutPayload = {
  body?: ApiPayload;
  token?: string;
};

export function executeLogoutApi(request: APIRequestContext, payload: LogoutPayload = {}): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/logout`, {
    data: payload.body,
    headers: payload.token !== undefined ? { Authorization: payload.token } : undefined,
  });
}
