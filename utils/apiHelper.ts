/*
================================
API Helper
================================
*/

// Playwright API Request型
import type { APIRequestContext } from '@playwright/test';

// API共通設定
import { API_BASE_URL, API_KEY } from './apiConfig';

// API Request型
import type { LoginRequest } from '../types/api';

/*
================================
共通Header
================================
*/

// API共通header
const defaultHeaders = {
  'x-api-key': API_KEY
};

/*
================================
共通POST API実行
================================
*/

// 共通POST API実行
export async function executePostApi(
  request: APIRequestContext,
  endpoint: string,
  body: unknown
) {

  return await request.post(
    `${API_BASE_URL}${endpoint}`,
    {

      // API header
      headers: defaultHeaders,

      // request body
      data: body
    }
  );
}

/*
================================
共通GET API実行
================================
*/

// 共通GET API実行
export async function executeGetApi(
  request: APIRequestContext,
  endpoint: string
) {

  return await request.get(
    `${API_BASE_URL}${endpoint}`,
    {

      // API header
      headers: defaultHeaders
    }
  );
}

/*
================================
Login API実行
================================
*/

// Login API共通処理
export async function executeLoginApi(
  request: APIRequestContext,
  body: LoginRequest
) {

  return await executePostApi(
    request,
    '/login',
    body
  );
}

/*
================================
GET User API実行
================================
*/

// 単一ユーザー取得API
export async function executeGetSingleUserApi(
  request: APIRequestContext,
  userId: number
) {

  return await executeGetApi(
    request,
    `/users/${userId}`
  );
}