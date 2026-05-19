/*
================================
API 共通設定（Aルート統一）
================================
・JSONPlaceholder APIを基準としたテスト環境
・環境依存をここに集約
・API実行層（apiHelper）から参照される
================================
*/

// API Base URL（JSONPlaceholder統一）
export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// API Key（Aルートでは不要のため未使用）
export const API_KEY = '';