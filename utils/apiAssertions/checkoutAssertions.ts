/*
================================
Checkout API Assertions
（JSONPlaceholder対応）
================================
*/

import { APIResponse } from '@playwright/test';

// 共通Assertion
import {
  expectStatus,
  expectCreatedResource
} from './commonAssertions';

/*
================================
Checkout API Assertions
================================
JSONPlaceholder API仕様に基づいた
Checkout専用検証
================================
*/

const CHECKOUT_SUCCESS_STATUS = 201;

/*
================================
Checkout成功検証
================================
*/
export async function expectCheckoutSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, CHECKOUT_SUCCESS_STATUS);

  const body = await response.json();

  expectCreatedResource(body);

  /*
  =================================
  JSONPlaceholder仕様：
  ・入力欠損でもレスポンスは成功扱い
  ・値は保証されない
  =================================
  */
}