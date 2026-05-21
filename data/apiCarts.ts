/*
================================
APIテスト用Cartデータ
（JSONPlaceholder対応）
================================
*/

export const apiCarts = {

  /*
  =================================
  正常系Cart
  =================================
  */
  validCart: {
    title: 'Sample Cart Item',
    body: 'Cart Item Body',
    userId: 1
  },

  /*
  =================================
  入力パターン検証用
  =================================
  */
  inputPatterns: {

    /*
    title未入力
    */
    missingTitle: {
      body: 'Cart Item Body',
      userId: 1
    },

    /*
    userId未入力
    */
    missingUserId: {
      title: 'Sample Cart Item',
      body: 'Cart Item Body'
    },

    /*
    空リクエスト
    */
    emptyRequest: {}
  }
};