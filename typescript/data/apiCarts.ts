// Cart の API のテストで送る値。
// 値は specs/api_testcases.md の操作の値と同じにする。productId に 0 を使わない
// （モックは 0 を「値がない」とみなすため。specs/api_spec.md「判断できない挙動」）
export const apiCarts = {

  // 正しい内容で追加する値（TC-API-CART-001）
  validCart: { productId: 4, quantity: 2 },

  // 項目を省いて送る値（TC-API-CART-002・004）
  inputPatterns: {
    missingProductId: { quantity: 1 },
    missingQuantity: { productId: 4 },
  },

  // 一覧を確かめるために追加する行（TC-API-CART-005）
  listItems: [
    { productId: 4, quantity: 1 },
    { productId: 1, quantity: 3 },
  ],

  // 削除を確かめるために追加する行（TC-API-CART-006）
  deleteItems: [
    { productId: 4, quantity: 1 },
    { productId: 1, quantity: 1 },
  ],
} as const;
