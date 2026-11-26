import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

// Cart の API の返事を確かめる

const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
} as const;

// カートに追加できたこと（201、id が整数、productId・quantity が期待値と同じ）
export async function expectAddCartSuccess(response: APIResponse, productId: number, quantity: number) {

  expectStatus(response, STATUS.CREATED);

  const body = await response.json();

  expect(Number.isInteger(body.id), `id が整数であること（実際の値：${JSON.stringify(body.id)}）`).toBe(true);
  expect(body.productId).toBe(productId);
  expect(body.quantity).toBe(quantity);
}

// カートに追加できなかったこと（400、エラーの文言が期待値と同じ）
export async function expectCartBadRequest(response: APIResponse, error: string) {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body.error).toBe(error);
}

// カートの一覧を取得できたこと（200、行の数と、各行の指定した項目の値が期待値と同じ）。
// 期待値の各行には、確かめたい項目だけを書く（例：{ productId: 1 }）。行は追加した順に並ぶ
export async function expectGetCartListSuccess(
  response: APIResponse,
  expectedItems: readonly Record<string, unknown>[],
) {

  expectStatus(response, STATUS.OK);

  const body = await response.json();
  const items: Record<string, unknown>[] = body.items;

  expect(items).toHaveLength(expectedItems.length);

  expectedItems.forEach((expected, index) => {

    const actual = Object.fromEntries(Object.keys(expected).map((key) => [key, items[index][key]]));

    expect(actual).toEqual(expected);
  });
}

// カートから削除できたこと（200、success が true）
export async function expectDeleteCartSuccess(response: APIResponse) {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body.success).toBe(true);
}
