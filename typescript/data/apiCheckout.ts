// Checkout の API のテストで送る値。
// 値は specs/api_testcases.md の操作の値と同じにする。値に 0 を使わない
// （モックは 0 を「値がない」とみなすため。specs/api_spec.md「判断できない挙動」）
export const apiCheckout = {

  // 正しい内容の購入（TC-API-CHECKOUT-001）
  validCheckout: { cartId: 1, userId: 2, totalPrice: 3000 },

  // 必須項目のどれかがない購入（TC-API-CHECKOUT-002〜004）
  inputPatterns: {
    missingCartId: { userId: 2, totalPrice: 3000 },
    missingUserId: { cartId: 1, totalPrice: 3000 },
    missingTotalPrice: { cartId: 1, userId: 2 },
  },
} as const;
