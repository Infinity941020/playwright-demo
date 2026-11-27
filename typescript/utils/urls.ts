// テストで開く各画面の URL。
// 値は両版共通の shared/data/urls.json にあり、ここでは項目名の書き方だけを TypeScript の書き方に直して渡す
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

  login: sharedUrls.login,
  inventory: sharedUrls.inventory,

  // 商品詳細画面。商品の番号は付いていないので、使う側で付ける
  inventoryItem: sharedUrls.inventory_item,

  cart: sharedUrls.cart,
  checkoutStepOne: sharedUrls.checkout_step_one,
  checkoutStepTwo: sharedUrls.checkout_step_two,
  complete: sharedUrls.complete,
};