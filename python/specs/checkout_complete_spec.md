# 画面仕様書：Checkout Complete画面（購入完了）

## ■ 画面概要
ECサイト（SauceDemo）の購入手続きの最後の画面。Checkout Step Two画面で Finish を押すと表示され、
注文を受け付けたことを伝える。Products画面へ戻ることができる。
本画面は認証済みであることが前提であり、未認証状態ではアクセスできない。

対象URL：https://www.saucedemo.com/checkout-complete.html
対象ユーザー：standard_user
（problem_user等の特殊ユーザーは本仕様の対象外。今後の拡張候補とする）

TS版との対応：TS版の `pages/CheckoutPage.ts` のうち、Complete に関する部分に相当する画面。
Python版では `pages/checkout_page.py` の CheckoutCompletePage クラスで扱う（decisions.md 論点16）。

実機確認：2026-11-09（Playwright調査用スクリプトにて確認）

---

## ■ 項目一覧

| 項目名 | 種別 | 表示内容 |
|---|---|---|
| 画面タイトル | テキスト | Checkout: Complete! |
| 見出し | テキスト | Thank you for your order! |
| 本文 | テキスト | Your order has been dispatched, and will arrive just as fast as the pony can get there! |
| 画像 | 画像 | チェックマークの画像（代替テキスト「Pony Express」） |
| 戻るボタン | ボタン | Back Home |
| PDF出力ボタン | ボタン | Generate PDF order（表示条件は「■ PDF出力ボタンの表示」参照） |
| カートアイコン | アイコン（リンク） | 右上に表示。カート内件数をバッジで表示（0件のときは非表示） |

※ ヘッダーのメニュー（ハンバーガーメニュー）は Logout 機能（logout_spec.md）で扱うため、本仕様の対象外とする。

---

## ■ 表示

- Step Two画面で Finish を押した直後は、上記の項目がすべて表示される
- 購入によりカートは空になるため、カートアイコンのバッジは表示されない

### PDF出力ボタンの表示
- Step Two画面で Finish を押した直後に表示される
- 押すと、同じ画面のまま注文内容のPDFファイルがダウンロードされる（PDFの中身は未確認）
- 再読み込みした場合などは表示されない（「■ 判断できない挙動」参照）

---

## ■ 画面遷移

| 操作 | 遷移先 |
|---|---|
| Back Home を押下 | Products画面（/inventory.html） |
| カートアイコンをクリック | Cart画面（/cart.html） |

※ 遷移先の画面の中身は本仕様の対象外。本仕様では「遷移すること」と、遷移後のカートの状態までを扱う。

---

## ■ 状態

| 操作 | カートの状態 |
|---|---|
| Back Home で Products画面へ移る | カートは空のまま（バッジなし、全商品が「Add to cart」） |
| カートアイコンで Cart画面へ移る | カートは空のまま（商品の行が0件、バッジなし） |

---

## ■ 未ログイン時

- 未ログイン状態で /checkout-complete.html に直接アクセスした場合、
  Login画面（https://www.saucedemo.com/）へ戻され、以下のエラーメッセージが表示される

| ケース | メッセージ文言 |
|---|---|
| 未ログインでのアクセス | Epic sadface: You can only access '/checkout-complete.html' when you are logged in. |

---

## ■ 業務ルール

- 本画面はログイン済みのユーザーのみ利用できる
- 購入完了後、カートは空になっており、本画面から Products画面・Cart画面へ移っても空のままである

---

## ■ 実機で確認したが、意図された仕様か不具合かを判断できない挙動

以下は事実として記録し、本仕様のテスト対象には含めない（扱いは別途判断）。

| 挙動 | 実機確認の結果 |
|---|---|
| 購入せずに本画面を表示できる | ログイン済みであれば、購入（Finish）をしなくても URL で直接開くと本画面が表示される。カートに商品があっても空にならない |
| PDF出力ボタンの表示条件 | 購入直後とブラウザの「戻る」で戻ったときは表示されるが、再読み込み後や、購入せずに直接開いたときは表示されない |
| 画像の読み込みの遅れ | 見出しが表示された時点では、画像の読み込みが終わっていない場合がある |
| Back Home の後のブラウザの「戻る」 | 本画面に戻る（カートは空のまま） |

---

## ■ 本仕様の対象外

| 項目 | 理由 |
|---|---|
| ハンバーガーメニュー | Logout 機能（logout_spec.md）で扱う |
| Products・Cart画面の中身 | それぞれの画面の仕様で扱う |
| PDFのダウンロードと、PDFの中身 | ダウンロードの確認にはテストの仕組みの追加が必要で、PDFの中身も未確認のため（今後の拡張候補） |
| 特殊ユーザー（problem_user等） | 今後の拡張候補 |
| 上記「判断できない挙動」4件 | 意図された仕様か不具合かを判断できないため |
| Chromium以外のブラウザ（Firefox・WebKit）での挙動 | 未確認。Python版のテストは Chromium で実行している |
