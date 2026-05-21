/*
================================
Cart API Assertions
（JSONPlaceholder対応）
================================
*/

import { APIResponse, expect } from '@playwright/test';

// 共通Assertion
import {
  expectStatus,
  expectCreatedResource
} from './commonAssertions';

/*
================================
Cart API Assertions
================================
JSONPlaceholder API仕様に基づいた
Cart専用検証
================================
*/

const CART_SUCCESS_STATUS = 201;
const CART_GET_STATUS = 200;
const CART_DELETE_STATUS = 200;

/*
================================
Cart一覧取得成功
================================
*/
export async function expectGetCartListSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, CART_GET_STATUS);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();

  expect(body.length).toBeGreaterThan(0);
}

/*
================================
Cart作成成功
================================
*/
export async function expectAddCartSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, CART_SUCCESS_STATUS);

  const body = await response.json();

  expectCreatedResource(body);

  expect(body.title).toBeDefined();
}

/*
================================
title未入力パターン
================================
*/
export async function expectMissingTitlePattern(
  response: APIResponse
): Promise<void> {

  expectStatus(response, CART_SUCCESS_STATUS);

  const body = await response.json();

  expect(body.title).toBeUndefined();

  expect(body.userId).toBe(1);

  expectCreatedResource(body);
}

/*
================================
userId未入力パターン
================================
*/
export async function expectMissingUserIdPattern(
  response: APIResponse
): Promise<void> {

  expectStatus(response, CART_SUCCESS_STATUS);

  const body = await response.json();

  expect(body.title).toBe('Sample Cart Item');

  expect(body.userId).toBeUndefined();

  expectCreatedResource(body);
}

/*
================================
空リクエストパターン
================================
*/
export async function expectEmptyCartRequestPattern(
  response: APIResponse
): Promise<void> {

  expectStatus(response, CART_SUCCESS_STATUS);

  const body = await response.json();

  expectCreatedResource(body);

  expect(Object.keys(body)).toContain('id');
}

/*
================================
Cart削除成功
================================
*/
export async function expectDeleteCartSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, CART_DELETE_STATUS);

  const body = await response.json();

  /*
  =================================
  JSONPlaceholder DELETEは {}
  を返す
  =================================
  */

  expect(body).toEqual({});
}