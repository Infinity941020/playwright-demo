// Cart の API のテスト
import { test } from '../../fixtures/apiFixture';
import {
  expectAddCartSuccess,
  expectCartBadRequest,
  expectDeleteCartSuccess,
  expectGetCartListSuccess,
} from '../../utils/apiAssertions/cartAssertions';
import { apiCarts } from '../../data/apiCarts';

// エラーの文言は、specs/api_testcases.md の期待結果と同じにする
const INVALID_PAYLOAD_MESSAGE = 'invalid payload';

test.describe('Cart API', () => {

  test('TC-API-CART-001：カートに追加すると、送った内容で行が作られること', async ({ api }) => {

    const payload = apiCarts.validCart;

    const response = await api.cart.add(payload);

    await expectAddCartSuccess(response, payload.productId, payload.quantity);
  });

  // 送る本文だけを切り替えて、同じ確かめ方をする（null は本文なしで送る）
  const badRequestCases = [
    {
      id: 'TC-API-CART-002',
      title: 'productId がないと、400 とエラーが返ること',
      payload: apiCarts.inputPatterns.missingProductId,
    },
    {
      id: 'TC-API-CART-003',
      title: 'リクエストの本文がないと、400 とエラーが返ること',
      payload: null,
    },
  ];

  for (const badRequestCase of badRequestCases) {

    test(`${badRequestCase.id}：${badRequestCase.title}`, async ({ api }) => {

      const response = await api.cart.add(badRequestCase.payload);

      await expectCartBadRequest(response, INVALID_PAYLOAD_MESSAGE);
    });
  }

  test('TC-API-CART-004：quantity を省略すると、quantity が 1 になること', async ({ api }) => {

    const payload = apiCarts.inputPatterns.missingQuantity;

    const response = await api.cart.add(payload);

    await expectAddCartSuccess(response, payload.productId, 1);
  });

  test('TC-API-CART-005：一覧に、追加した行だけが返ること', async ({ api }) => {

    const items = apiCarts.listItems;

    for (const item of items) {
      await api.cart.add(item);
    }

    const response = await api.cart.get();

    // 追加していない行が混ざらないことも、行の数で確かめる
    await expectGetCartListSuccess(response, items);
  });

  test('TC-API-CART-006：削除すると、一覧からその行がなくなること', async ({ api }) => {

    const [firstItem, secondItem] = apiCarts.deleteItems;

    const firstId = (await (await api.cart.add(firstItem)).json()).id;
    await api.cart.add(secondItem);

    const deleteResponse = await api.cart.delete(firstId);
    const listResponse = await api.cart.get();

    await expectDeleteCartSuccess(deleteResponse);
    await expectGetCartListSuccess(listResponse, [{ productId: secondItem.productId }]);
  });
});
