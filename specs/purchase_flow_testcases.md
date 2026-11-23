# 通しの購入 テストケース（初版・1件）

このテストの役割：画面ごとのテストは、前提の状態をブラウザの保存領域への書き込みや URL での直接表示で作るため、
画面と画面のつなぎ目の不具合（前の画面で操作した内容が次の画面に引き継がれない、など）を見つけられない。
そのつなぎ目を確かめるため、商品の追加から購入完了までを、すべて画面の操作でつなぐ。

各画面の仕様（表示項目・遷移先・金額の計算など）は、画面ごとの仕様書を見る
（products_spec.md・cart_spec.md・checkout_step_one_spec.md・checkout_step_two_spec.md・checkout_complete_spec.md）。

前提の状態の作り方：
- ログイン済みで Products画面を開いた状態だけを、ログイン済みの画面を用意する部品で作る
- カートの中身は、ブラウザの保存領域へ書き込まず、Products画面の Add to cart で入れる
- Cart画面・Checkout Step One画面・Checkout Step Two画面・Checkout Complete画面は、URL で開かず、前の画面のボタンやアイコンを押して開く

対応するテスト：TS版は `typescript/tests/ui/flow/purchase-flow.spec.ts`、Python版は `python/tests/ui/flow/test_purchase_flow.py`
（両版とも同じ1件。下の「両版のテストとの対応」を参照）
実行するブラウザ：TS版は Chromium・Firefox・WebKit、Python版は Chromium

---

## ■ テスト観点

| 観点ID | 分類 | 観点 | 仕様書の該当箇所 |
|---|---|---|---|
| F-01 | つなぎ目 | Products画面で追加した商品が、追加した順のまま、Cart画面と Checkout Step Two画面に引き継がれること | cart_spec.md（並び順）、checkout_step_two_spec.md |
| F-02 | つなぎ目 | 画面の操作で入れたカートの中身から、Checkout Step Two画面の小計・税・合計が正しく計算されること | checkout_step_two_spec.md（金額の計算） |
| F-03 | つなぎ目 | 購入者情報の入力と、ボタン・アイコンの操作だけで、Products画面から Checkout Complete画面まで移れること | 各画面の仕様書（画面遷移） |
| F-04 | つなぎ目 | 購入を完了した直後の Checkout Complete画面で、カートアイコンのバッジが表示されないこと | checkout_complete_spec.md（表示） |

---

## TC-FLOW-001
■ テスト内容：商品の追加から購入完了まで、画面の操作だけで通して購入できること
■ 前提条件：standard_user でログイン済みで、Products画面を開いている。
  カートは空である（テストごとに新しい閲覧環境で始まり、そこに読み込むログイン状態は、ログインした直後〈カートに商品を入れる前〉に保存したものであるため）
■ 操作手順と期待結果（画面が移るたびに、中身より先に、移った先の画面であることを確かめる）：
  1. Products画面で「Sauce Labs Bike Light」→「Sauce Labs Backpack」→「Sauce Labs Onesie」の順に Add to cart を押す
     - カートアイコンのバッジが「3」になる
     （補足：この順は、商品名・商品の番号・価格のどの昇順・降順にも当たらない〈商品の番号では 0→4→2、価格では $9.99→$29.99→$7.99〉ため、
     追加した順のまま引き継がれていることを区別できる）
  2. 右上のカートアイコンを押す
     - Cart画面（/cart.html）が表示される
     - 商品の行が3件で、「Sauce Labs Bike Light」「Sauce Labs Backpack」「Sauce Labs Onesie」の順に並んでいる
  3. 「Checkout」ボタンを押す
     - Checkout Step One画面（/checkout-step-one.html）が表示される
  4. 購入者情報（First Name「Taro」、Last Name「Yamada」、Zip/Postal Code「1000001」）を入力して「Continue」ボタンを押す
     - Checkout Step Two画面（/checkout-step-two.html）が表示される
     - 商品の行が3件で、「Sauce Labs Bike Light」「Sauce Labs Backpack」「Sauce Labs Onesie」の順に並んでいる
     - 「Item total: $47.97」が表示される
     - 「Tax: $3.84」が表示される
     - 「Total: $51.81」が表示される
     （金額は、2026-11-23 に、手元で Playwright調査用スクリプト〈Chromium〉を使い、この手順どおりに画面を操作して、画面に表示された値を確かめた。
     Firefox・WebKit で同じ値になることは、TS版のテストの結果で確かめる。
     購入者情報は、両版共通のデータ〈shared/data/checkout.json〉の値）
  5. 「Finish」ボタンを押す
     - Checkout Complete画面（/checkout-complete.html）が表示される
     - カートアイコンのバッジが表示されない
■ 優先度：高

---

## ■ サマリー表

| テストID | 分類 | 対応する観点 | 優先度 | 実装方針 |
|---|---|---|---|---|
| TC-FLOW-001 | つなぎ目（追加から購入完了まで） | F-01, F-02, F-03, F-04 | 高 | 個別実装 |

## ■ 実装時の注意

- 前提の状態を、ブラウザの保存領域への書き込みや URL での直接表示で作らない。それらで作ると、確かめたいつなぎ目の操作をテストの外で済ませてしまうため
- 失敗したときに、画面が移らなかったのか、移った先の中身が違うのかを区別できるように、画面が移るたびに、中身より先に、移った先の画面であることを確かめる
- バッジが表示されないことは、Finish の後に Checkout Complete画面以外のバッジのない画面へ移っても成り立つため、先に Checkout Complete画面であることを確かめる
- 期待する金額は、確かめる側の計算と同じ誤りを持たないように、計算で作らず、画面で確かめた値（上の期待結果と同じ値）をテストに書く
- 手順1のバッジの件数も、追加する商品の数から作らず、期待結果と同じ値（3）をテストに書く
- 固定の時間の待ちは使わない

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| 各画面の表示の細かい確認（画面の項目、各行の表示項目、ボタンの文言など） | 画面ごとのテストで確かめているため |
| 入力の誤り、Cancel・Continue Shopping などの戻る操作、カートからの削除 | 画面ごとのテストで確かめているため。このテストは、購入が完了するまでの1本の道筋だけを確かめる |
| 商品の数や組み合わせを変えた通しの購入 | 金額の組み合わせは Checkout Step Two のテスト（TC-CO2-004〜006）で確かめており、つなぎ目の確認には1通りで足りるため |
| 購入後に、ほかの画面へ移ってもカートが空のままであること | TC-CO3-004（Back Home）・TC-CO3-005（カートアイコン）で確かめているため |
| ログインから Products画面への移り | ログインのテスト（TC-LOGIN-001）で確かめているため。このテストは、ログイン済みの画面を用意する部品で始める |
| ほかのユーザー（problem_user など） | 不具合を意図して入れたユーザーでは、つなぎ目以外の不具合で失敗し、つなぎ目の不具合と区別できないため。今後の拡張候補 |
| Python版での Firefox・WebKit | Python版は Chromium だけで実行するため。3ブラウザでの確認は TS版で行う |

## ■ 両版のテストとの対応

両版とも、テストケースの1件を実装している。

| テストID | TS版（typescript/tests/ui/flow/） | Python版（python/tests/ui/flow/） |
|---|---|---|
| TC-FLOW-001 | purchase-flow.spec.ts「TC-FLOW-001：商品の追加から購入完了まで、画面の操作だけで通して購入できること」 | test_purchase_flow.py `test_purchase_completed_through_screens`（説明文「TC-FLOW-001: 商品の追加から購入完了まで、画面の操作だけで通して購入できること」） |
