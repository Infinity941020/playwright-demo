// Checkout Step Two画面の小計・税・合計のテスト。
// 期待する金額は、計算で作らず、テストケース（実機で確認した値）と同じ値を書く
import { test } from '../../../fixtures/loginFixture';
import { CheckoutFlow } from '../../../flows/CheckoutFlow';
import { expectStepTwoAmounts } from '../../../utils/uiAssertions/checkoutAssertions';
import { checkoutData } from '../../../data/checkoutData';
import { products, productsInDisplayOrder } from '../../../data/products';

test.describe('Checkout Step Two画面の金額', () => {

  // カートの中身（1件・2件・全6件）と、期待する金額だけを切り替えて、同じ確かめ方をする
  const amountCases = [
    {
      id: 'TC-CO2-004',
      title: '商品1件のとき、小計・税・合計が正しく表示されること',
      cartProducts: [products.onesie],
      itemTotal: 'Item total: $7.99',
      tax: 'Tax: $0.64',
      total: 'Total: $8.63',
    },
    {
      id: 'TC-CO2-005',
      title: '商品2件のとき、小計・税・合計が正しく表示されること',
      cartProducts: [products.backpack, products.bikeLight],
      itemTotal: 'Item total: $39.98',
      tax: 'Tax: $3.20',
      total: 'Total: $43.18',
    },
    {
      id: 'TC-CO2-006',
      title: '全6商品のとき、小計・税・合計が正しく表示されること',
      cartProducts: productsInDisplayOrder,
      itemTotal: 'Item total: $129.94',
      tax: 'Tax: $10.40',
      total: 'Total: $140.34',
    },
  ];

  for (const amountCase of amountCases) {

    test(`${amountCase.id}：${amountCase.title}`, async ({ loggedPage }) => {

      const checkoutFlow = new CheckoutFlow(loggedPage);

      await checkoutFlow.openStepTwoWith(amountCase.cartProducts, checkoutData);

      await expectStepTwoAmounts(checkoutFlow, amountCase.itemTotal, amountCase.tax, amountCase.total);
    });
  }
});
