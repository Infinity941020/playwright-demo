import { APIResponse, expect } from '@playwright/test';

// 複数の API で共通に使う確認。
// 返事の形を確かめる道具は使わず、テストケースの期待結果にある項目を値で確かめる（値が一致すれば型も一致しているため。python/decisions.md の論点9）

export function expectStatus(response: APIResponse, expectedStatus: number) {
  expect(response.status()).toBe(expectedStatus);
}
