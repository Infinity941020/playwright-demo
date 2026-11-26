// Checkout の API のテスト
import { test } from '../../fixtures/apiFixture';
import { expectCheckoutBadRequest, expectCheckoutSuccess } from '../../utils/apiAssertions/checkoutAssertions';
import { apiCheckout } from '../../data/apiCheckout';

// エラーの文言は、specs/api_spec.md「Checkout API」の表と同じにする
const INVALID_PAYLOAD_MESSAGE = 'invalid payload';

test.describe('Checkout API', () => {

  test('TC-API-CHECKOUT-001：正しい内容で購入すると、送った内容が返ること', async ({ api }) => {

    const payload = apiCheckout.validCheckout;

    const response = await api.checkout.create(payload);

    await expectCheckoutSuccess(response, payload.cartId, payload.userId, payload.totalPrice);
  });

  // 送る本文だけを切り替えて、同じ確かめ方をする（null は本文なしで送る）
  const badRequestCases = [
    {
      id: 'TC-API-CHECKOUT-002',
      title: 'cartId がないと、400 とエラーが返ること',
      payload: apiCheckout.inputPatterns.missingCartId,
    },
    {
      id: 'TC-API-CHECKOUT-003',
      title: 'userId がないと、400 とエラーが返ること',
      payload: apiCheckout.inputPatterns.missingUserId,
    },
    {
      id: 'TC-API-CHECKOUT-004',
      title: 'totalPrice がないと、400 とエラーが返ること',
      payload: apiCheckout.inputPatterns.missingTotalPrice,
    },
    {
      id: 'TC-API-CHECKOUT-005',
      title: 'リクエストの本文がないと、400 とエラーが返ること',
      payload: null,
    },
  ];

  for (const badRequestCase of badRequestCases) {

    test(`${badRequestCase.id}：${badRequestCase.title}`, async ({ api }) => {

      const response = await api.checkout.create(badRequestCase.payload);

      await expectCheckoutBadRequest(response, INVALID_PAYLOAD_MESSAGE);
    });
  }
});
