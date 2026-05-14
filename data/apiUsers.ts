/*
================================
API Test Users
================================
*/

// Login API Request型
import type { LoginRequest } from '../types/api';

// APIテスト用ユーザーデータ
export const apiUsers: {
  validUser: LoginRequest;
  missingPasswordUser: LoginRequest;
} = {

  // 正常系ユーザー
  validUser: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  },

  // password未入力ユーザー
  missingPasswordUser: {
    email: 'eve.holt@reqres.in'
  }
};