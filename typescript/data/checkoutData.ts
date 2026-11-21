// Checkout Step One画面で入力する購入者情報（名・姓・郵便番号）。
// 値は両版共通の shared/data/checkout.json にあり、ここでは名前の書き方だけを TypeScript の書き方に直して渡す
import sharedCheckout from '../../shared/data/checkout.json' with { type: 'json' };

export const checkoutData: {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
} = {
  firstName: sharedCheckout.first_name,
  lastName: sharedCheckout.last_name,
  postalCode: sharedCheckout.postal_code,
};
