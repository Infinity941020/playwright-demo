import { expect, APIResponse } from '@playwright/test';

/*
================================
Common Assertions
================================
*/

export function expectStatus(
  response: APIResponse,
  expectedStatus: number
) {
  expect(response.status()).toBe(expectedStatus);
}

export async function expectErrorMessage(
  response: APIResponse,
  expectedMessage: string
) {
  const body = await response.json();
  expect(body.error).toContain(expectedMessage);
}

export async function expectTokenExists(
  response: APIResponse
) {
  const body = await response.json();
  expect(body.token).toBeTruthy();
}