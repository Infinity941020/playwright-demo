/*
================================
Cart API Test Data（MSW対応版）
================================
*/

export const apiCarts = {

  /*
  ================================
  正常系Cart
  ================================
  */
  validCart: {
    productId: 1,
    quantity: 2,
  },

  /*
  ================================
  入力パターン検証用
  ================================
  */
  inputPatterns: {

    /*
    productId未指定（必須エラー）
    */
    missingProductId: {
      quantity: 1,
    },

    /*
    quantity未指定（デフォルト値検証）
    */
    missingQuantity: {
      productId: 1,
    },

    /*
    空リクエスト（両方未指定）
    */
    emptyRequest: {},
  },
};