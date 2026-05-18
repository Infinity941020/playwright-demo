import { APIResponse } from '@playwright/test';
import {
  expectStatus,
  expectErrorMessage,
  expectTokenExists
} from './common';

/*
================================
Login Assertions
================================
*/

// 正常ログイン
export async function expectLoginSuccess(
  response: APIResponse
) {
  expectStatus(response, 200);
  await expectTokenExists(response);
}

// password未入力
export async function expectMissingPasswordError(
  response: APIResponse
) {
  expectStatus(response, 400);
  await expectErrorMessage(response, 'Missing password');
}

// email未入力
export async function expectMissingEmailError(
  response: APIResponse
) {
  expectStatus(response, 400);
  await expectErrorMessage(response, 'Missing email or username');
}

// wrong password（仕様上成功扱い）
export async function expectWrongPasswordSuccess(
  response: APIResponse
) {
  expectStatus(response, 200);
  await expectTokenExists(response);
}