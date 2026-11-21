// Products画面に表示される商品と、ソートの選択肢。
// 値は両版共通の shared/data/products.json にあり、ここでは項目名の書き方だけを TypeScript の書き方に直して渡す。
import sharedProducts from '../../shared/data/products.json' with { type: 'json' };

export type Product = {
  readonly name: string;
  readonly price: string;

  // 商品詳細画面の URL（inventory-item.html?id=）に付く番号
  readonly id: number;
};

const shared = sharedProducts.products;

export const products: {
  readonly backpack: Product;
  readonly bikeLight: Product;
  readonly boltTShirt: Product;
  readonly fleeceJacket: Product;
  readonly onesie: Product;
  readonly redTShirt: Product;
} = {
  backpack: shared.backpack,
  bikeLight: shared.bike_light,
  boltTShirt: shared.bolt_t_shirt,
  fleeceJacket: shared.fleece_jacket,
  onesie: shared.onesie,
  redTShirt: shared.red_t_shirt,
};

// 仕様書「表示商品」の表の順（初期表示の Name (A to Z) の並び）。
// 並び順を確かめるテストは、書いた順に頼らず、この一覧を使う
export const productsInDisplayOrder: readonly Product[] = [
  products.backpack,
  products.bikeLight,
  products.boltTShirt,
  products.fleeceJacket,
  products.onesie,
  products.redTShirt,
];

// ソートの選択肢（画面に表示される文言）
export const sortOptions: {
  readonly nameAsc: string;
  readonly nameDesc: string;
  readonly priceAsc: string;
  readonly priceDesc: string;
} = {
  nameAsc: sharedProducts.sort_options.name_asc,
  nameDesc: sharedProducts.sort_options.name_desc,
  priceAsc: sharedProducts.sort_options.price_asc,
  priceDesc: sharedProducts.sort_options.price_desc,
};
