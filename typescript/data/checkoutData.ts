// ========================================
// 購入者情報
// ========================================

// 値は両版共通の shared/data/checkout.json に置いている（decisions.md 論点24）。
// JSON の項目名（first_name など）を、TS の書き方（firstName など）に変換する
import sharedCheckout from '../../shared/data/checkout.json' with { type: 'json' };

export const checkoutData: {
  firstName: string;
  lastName: string;
  postalCode: string;
} = {
  // 名
  firstName: sharedCheckout.first_name,

  // 姓
  lastName: sharedCheckout.last_name,

  // 郵便番号
  postalCode: sharedCheckout.postal_code,
};