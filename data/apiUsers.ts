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

  invalidUsers: {
    missingPassword: LoginRequest;
  };
} = {

  // 正常系ユーザー
  validUser: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  },

  // 異常系ユーザー
  invalidUsers: {

    // password未入力
    missingPassword: {
      email: 'eve.holt@reqres.in'
    }
  }
};