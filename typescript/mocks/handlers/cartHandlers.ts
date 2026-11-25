import { type Handler, type MockRequest, type MockResponse, hasValue, isObject, toNumber } from '../handlerTypes';
import { mockData } from '../mockData';

type CartItem = {
  id: number;
  productId: unknown;
  quantity: unknown;
};

// カートの API（一覧・追加・削除）。
// カートの中身と id の連番は、この関数を呼ぶたびに新しく作る。サーバーはテストごとに新しく立てるため、状態はテストをまたがない
export function createCartHandlers(): Handler[] {

  const cart: CartItem[] = [];
  let nextId = 1;

  function getCart(_request: MockRequest): MockResponse {
    return { status: 200, body: { items: cart } };
  }

  function addCart(request: MockRequest): MockResponse {

    const body = request.json();

    if (body === null) {
      return { status: 400, body: { error: mockData.cart.invalidPayloadError } };
    }

    // 0 も指定なしとみなす（specs/api_spec.md「判断できない挙動」）
    if (!isObject(body) || !hasValue(body.productId)) {
      return { status: 400, body: { error: mockData.cart.invalidPayloadError } };
    }

    const item: CartItem = {
      id: nextId,
      productId: body.productId,

      // 指定されていないとき（null も含む）は 1 にする
      quantity: body.quantity !== undefined && body.quantity !== null ? body.quantity : 1,
    };

    nextId += 1;
    cart.push(item);

    return { status: 201, body: item };
  }

  // 存在しない id でも 200 を返す（意図された仕様か不具合かを判断できない挙動。specs/api_spec.md）
  function deleteCart(request: MockRequest): MockResponse {

    const cartId = toNumber(request.params.id);
    const remaining = cart.filter((item) => item.id !== cartId);

    cart.splice(0, cart.length, ...remaining);

    return { status: 200, body: { success: true } };
  }

  return [
    { method: 'GET', path: '/api/cart', resolver: getCart },
    { method: 'POST', path: '/api/cart', resolver: addCart },
    { method: 'DELETE', path: '/api/cart/{id}', resolver: deleteCart },
  ];
}
