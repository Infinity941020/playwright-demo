// テストで使用する共通URL定義
// 値は両版共通の shared/data/urls.json に置いている（decisions.md 論点24）。
// JSON の項目名（checkout_step_one など）を、TS の書き方（checkoutStepOne など）に変換する
import sharedUrls from '../../shared/data/urls.json' with { type: 'json' };

export const urls: {
  login: string;
  inventory: string;
  inventoryItem: string;
  cart: string;
  checkoutStepOne: string;
  checkoutStepTwo: string;
  complete: string;
} = {

  // ログイン画面
  login: sharedUrls.login,

  // 商品一覧画面
  inventory: sharedUrls.inventory,

  // 商品詳細画面
  inventoryItem: sharedUrls.inventory_item,

  // カート画面
  cart: sharedUrls.cart,

  // Checkout入力画面
  checkoutStepOne: sharedUrls.checkout_step_one,

  // Checkout確認画面
  checkoutStepTwo: sharedUrls.checkout_step_two,

  // 完了画面
  complete: sharedUrls.complete,
};