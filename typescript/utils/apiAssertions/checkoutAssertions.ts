import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

// Checkout の API の返事を確かめる

const STATUS = {
  CREATED: 201,
  BAD_REQUEST: 400,
} as const;

// 購入できたこと（201、success が true、checkoutId が整数、送った値が返る）
export async function expectCheckoutSuccess(
  response: APIResponse,
  cartId: number,
  userId: number,
  totalPrice: number,
) {

  expectStatus(response, STATUS.CREATED);

  const body = await response.json();

  expect(body.success).toBe(true);
  expect(Number.isInteger(body.checkoutId)).toBe(true);
  expect(body.cartId).toBe(cartId);
  expect(body.userId).toBe(userId);
  expect(body.totalPrice).toBe(totalPrice);
}

// 購入できなかったこと（400、エラーの文言が期待値と同じ）
export async function expectCheckoutBadRequest(response: APIResponse, error: string) {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body.error).toBe(error);
}
