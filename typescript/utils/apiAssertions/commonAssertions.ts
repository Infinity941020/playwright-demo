import { APIResponse, expect } from '@playwright/test';

// 複数の API で共通に使う確認。
// 返事の形を確かめる道具は使わず、返事の値を完全一致で確かめる（値まで確かめれば形の確認も含まれるため。python/decisions.md の論点9）

export function expectStatus(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
}

