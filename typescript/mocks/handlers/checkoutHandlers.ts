import { type Handler, type MockRequest, type MockResponse, hasValue, isObject } from '../handlerTypes';
import { mockData } from '../mockData';

// 購入の API。
// 呼び出し回数は、この関数を呼ぶたびに 0 から数え直す。サーバーはテストごとに新しく立てるため、回数はテストをまたがない
export function createCheckoutHandlers(): Handler[] {

  let checkoutCount = 0;

  function checkout(request: MockRequest): MockResponse {

    const body = request.json();

    checkoutCount += 1;

    // 呼び出し回数の上限（意図された仕様か不具合かを判断できない挙動。specs/api_spec.md）
    if (checkoutCount >= mockData.checkout.callLimit) {
      return {
        status: 401,
        body: { error: mockData.checkout.callLimitError, message: mockData.checkout.callLimitMessage },
      };
    }

    if (body === null) {
      return { status: 400, body: { error: mockData.checkout.invalidPayloadError } };
    }

    // 0 も指定なしとみなす（specs/api_spec.md「判断できない挙動」）
    if (
      !isObject(body) ||
      !hasValue(body.cartId) ||
      !hasValue(body.userId) ||
      !hasValue(body.totalPrice)
    ) {
      return { status: 400, body: { error: mockData.checkout.invalidPayloadError } };
    }

    return {
      status: 201,
      body: {
        success: true,

        // 呼び出した時刻をミリ秒で入れる（意図された仕様か不具合かを判断できない挙動。specs/api_spec.md）
        checkoutId: Date.now(),

        cartId: body.cartId,
        userId: body.userId,
        totalPrice: body.totalPrice,
      },
    };
  }

  return [{ method: 'POST', path: '/api/checkout', resolver: checkout }];
}
