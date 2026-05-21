/*
================================
APIテスト用Checkoutデータ
（JSONPlaceholder対応）
================================
*/

export const apiCheckout = {

  /*
  =================================
  正常系Checkout
  =================================
  */
  validCheckout: {
    cartId: 1,
    userId: 1,
    totalPrice: 5000
  },

  /*
  =================================
  入力パターン検証用
  =================================
  */
  inputPatterns: {

    /*
    cartId未入力
    */
    missingCartId: {
      userId: 1,
      totalPrice: 5000
    },

    /*
    userId未入力
    */
    missingUserId: {
      cartId: 1,
      totalPrice: 5000
    },

    /*
    totalPrice未入力
    */
    missingTotalPrice: {
      cartId: 1,
      userId: 1
    },

    /*
    空リクエスト
    */
    emptyRequest: {}
  }
};