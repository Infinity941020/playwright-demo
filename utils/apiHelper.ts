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
Login API共通実行
================================
*/

// Login API共通処理
export async function executeLoginApi(
  request: APIRequestContext,
  body: LoginRequest
) {

  // Login API実行
  return await request.post(`${API_BASE_URL}/login`, {

    // API Key header
    headers: {
      'x-api-key': API_KEY
    },

    // request body
    data: body
  });
}