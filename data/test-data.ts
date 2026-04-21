// ========================================
// テスト用共通データ管理ファイル
// ログイン情報・購入者情報などを集約
// ========================================

// ========================================
// ログインユーザー情報
// ========================================
export const users = {

  // 正常ログインユーザー
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },

  // ログイン不可ユーザー
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },

  // 異常系用ユーザー
  invalid: {
    username: 'wrong_user',
    password: 'wrong_pass'
  }

};

// ========================================
// 購入者情報
// ========================================
export const checkoutData = {

  // 名
  firstName: 'Taro',

  // 姓
  lastName: 'Yamada',

  // 郵便番号
  postalCode: '1234567'

};

// ========================================
// URL情報
// ========================================
export const urls = {

  // ログイン画面
  login: 'https://www.saucedemo.com/',

  // 商品一覧画面
  inventory: 'https://www.saucedemo.com/inventory.html'

};