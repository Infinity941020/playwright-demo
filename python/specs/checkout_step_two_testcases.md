# Checkout Step Two画面 テストケース（初版・14件）

共通の前提：standard_user でログイン済み。各テストケースの「前提条件」に記載した商品が、
記載した順にカートに入った状態で、Checkout Step Two画面を開いている
（TC-CO2-014 のみ未ログイン状態が前提）

前提状態の作り方：
- カートの中身は、ブラウザの保存領域（localStorage の cart-contents）への直接書き込みで作る（decisions.md 論点15）
- Checkout Step Two画面は、Checkout Step One画面をURLで開き、購入者情報（Taro／Yamada／1000001）を入力して Continue を押して開く
  - 理由：Step One を経由せずに Step Two を直接開けることは、意図された仕様か不具合かを判断できない挙動のため（仕様書「判断できない挙動」参照）。この挙動に依存すると、SauceDemo 側で修正された場合に、全テストの前提が崩れるため
  - 受け入れるリスク：Step One の不具合で Step Two のテストもまとめて失敗する可能性がある。Step One 自体は TC-CO1 で確認しているため、失敗したときは Step One のテスト結果から原因を切り分ける

金額の確認方法：
- 実機で確認した金額（仕様書「実機で確認した値」）を、固定値の期待値として使う
- 小計の桁あふれが起きない組み合わせだけを使う（仕様書「判断できない挙動」参照）

テストIDの付け方：Step One を「TC-CO1」、Step Two を「TC-CO2」、Complete を「TC-CO3」とする

対応する仕様書：checkout_step_two_spec.md

---

## ■ テスト観点

| 観点ID | 分類 | 観点 | 仕様書の該当箇所 |
|---|---|---|---|
| V-01 | 表示 | 画面タイトル、一覧の見出し、支払い・配送情報、金額の見出し、Cancel・Finish ボタンが仕様どおりに表示されること | 項目一覧 |
| V-02 | 表示 | カートアイコンのバッジに、カートの件数が表示されること | 項目一覧 |
| V-03 | 表示 | カート内の商品1件につき1行表示され、各行に数量（1）・商品名・説明・価格が表示されること | 項目一覧、表示 |
| V-04 | 表示 | 各行の商品名と価格の組み合わせが、Products画面の表示と一致すること | 表示 |
| O-01 | 並び順 | カートに追加した順に表示されること | 表示 |
| M-01 | 金額 | 小計・税・合計が、実機で確認した値どおりに表示されること | 金額の計算 |
| T-01 | 画面遷移 | Finish を押すと、Complete画面へ遷移すること | 画面遷移 |
| T-02 | 画面遷移 | Cancel を押すと、Products画面へ遷移すること | 画面遷移 |
| T-03 | 画面遷移 | カートアイコンを押すと、Cart画面へ遷移すること | 画面遷移 |
| T-04 | 画面遷移 | 商品名を押すと、商品詳細画面へ遷移すること | 画面遷移 |
| S-01 | 状態 | Finish を押すと、カートが空になること | 状態 |
| S-02 | 状態 | Cancel を押しても、カートの中身が変わらないこと | 状態 |
| S-03 | 状態 | 再読み込みしても、商品・金額・バッジの表示が変わらないこと | 状態 |
| A-01 | 認証 | 未ログインで直接アクセスすると、Login画面へ戻され、エラーメッセージが表示されること | 未ログイン時 |

---

## TC-CO2-001
■ テスト内容：画面が仕様どおりに表示されること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入っている
■ 操作手順：
  1. Checkout Step Two画面の表示内容を確認する
■ 期待結果：
  - 画面タイトル「Checkout: Overview」が表示される
  - 一覧の見出し「QTY」「Description」が表示される
  - 「Payment Information:」と「SauceCard #31337」が表示される
  - 「Shipping Information:」と「Free Pony Express Delivery!」が表示される
  - 金額の見出し「Price Total」が表示される
  - 「Cancel」ボタンと「Finish」ボタンが表示される
  - カートアイコンのバッジに「2」が表示される
■ 優先度：中

---

## TC-CO2-002
■ テスト内容：全商品をカートに入れたとき、全商品が仕様どおりに表示されること
■ 前提条件：全6商品が、products_spec.md「表示商品」の表の順（No.1→No.6）でカートに入っている
■ 操作手順：
  1. 商品の一覧を確認する
■ 期待結果：
  - 商品の行が6件表示される
  - 各行に「数量（1）／商品名／説明／価格」が表示される
  - 各行の商品名と価格の組み合わせが、products_spec.md「表示商品」の表と一致する
■ 優先度：高

---

## TC-CO2-003
■ テスト内容：カートに追加した順に表示されること
■ 前提条件：「Sauce Labs Onesie」→「Sauce Labs Bike Light」→「Sauce Labs Backpack」の順でカートに入っている
  （補足：この順は商品名順でも商品ID順〈2→0→4〉でもないため、カートの順で並んでいることを区別できる）
■ 操作手順：
  1. 商品の並び順を確認する
■ 期待結果：商品名の並びが「Sauce Labs Onesie」→「Sauce Labs Bike Light」→「Sauce Labs Backpack」である
■ 優先度：中

---

## TC-CO2-004
■ テスト内容：商品1件のとき、小計・税・合計が正しく表示されること
■ 前提条件：「Sauce Labs Onesie」がカートに入っている
■ 操作手順：
  1. 金額の表示を確認する
■ 期待結果：
  - 「Item total: $7.99」が表示される
  - 「Tax: $0.64」が表示される
  - 「Total: $8.63」が表示される
■ 優先度：高

---

## TC-CO2-005
■ テスト内容：商品2件のとき、小計・税・合計が正しく表示されること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入っている
■ 操作手順：
  1. 金額の表示を確認する
■ 期待結果：
  - 「Item total: $39.98」が表示される
  - 「Tax: $3.20」が表示される
  - 「Total: $43.18」が表示される
■ 優先度：高

---

## TC-CO2-006
■ テスト内容：全6商品のとき、小計・税・合計が正しく表示されること
■ 前提条件：全6商品が、products_spec.md「表示商品」の表の順（No.1→No.6）でカートに入っている
■ 操作手順：
  1. 金額の表示を確認する
■ 期待結果：
  - 「Item total: $129.94」が表示される
  - 「Tax: $10.40」が表示される
  - 「Total: $140.34」が表示される
■ 優先度：高

---

## TC-CO2-007
■ テスト内容：Finish を押すと、Complete画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. 「Finish」ボタンを押す
■ 期待結果：Checkout Complete画面（/checkout-complete.html）へ遷移する
■ 優先度：高

---

## TC-CO2-008
■ テスト内容：Cancel を押すと、Products画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. 「Cancel」ボタンを押す
■ 期待結果：Products画面（/inventory.html）へ遷移する
■ 優先度：高

---

## TC-CO2-009
■ テスト内容：カートアイコンを押すと、Cart画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. 右上のカートアイコンを押す
■ 期待結果：Cart画面（/cart.html）へ遷移する
■ 優先度：低

---

## TC-CO2-010
■ テスト内容：商品名を押すと、商品詳細画面へ遷移すること
■ 前提条件：「Sauce Labs Bike Light」がカートに入っている
■ 操作手順：
  1. 「Sauce Labs Bike Light」の商品名を押す
■ 期待結果：商品詳細画面（/inventory-item.html?id=0）へ遷移する
  （補足：Step Two からの遷移は Bike Light で実機確認済みのため、この商品を使う）
■ 優先度：低

---

## TC-CO2-011
■ テスト内容：Finish を押すと、カートが空になること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入っている
■ 操作手順：
  1. 「Finish」ボタンを押す
  2. Products画面をURL（/inventory.html）で開く
     （補足：Complete画面の操作は Complete画面の仕様で扱うため、ここでは使わない）
■ 期待結果：
  - 手順1の後、カートアイコンのバッジが表示されない
  - 手順2の後、「Sauce Labs Backpack」と「Sauce Labs Bike Light」のボタンがどちらも「Add to cart」である
■ 優先度：高

---

## TC-CO2-012
■ テスト内容：Cancel を押しても、カートの中身が変わらないこと
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入っている
■ 操作手順：
  1. 「Cancel」ボタンを押す
■ 期待結果：
  - カートアイコンのバッジに「2」が表示される
  - Products画面の「Sauce Labs Backpack」と「Sauce Labs Bike Light」のボタンがどちらも「Remove」である
■ 優先度：中

---

## TC-CO2-013
■ テスト内容：再読み込みしても、商品・金額・バッジの表示が変わらないこと
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入っている
■ 操作手順：
  1. ページを再読み込みする
■ 期待結果：
  - 商品の行が2件で、商品名が「Sauce Labs Backpack」と「Sauce Labs Bike Light」である
    （並び順は TC-CO2-003 で確認するため、本テストでは問わない）
  - 「Item total: $39.98」「Tax: $3.20」「Total: $43.18」が表示される
  - カートアイコンのバッジに「2」が表示される
■ 優先度：低

---

## TC-CO2-014
■ テスト内容：未ログインで直接アクセスすると、Login画面へ戻されること
■ 前提条件：未ログイン状態である（ログイン状態を引き継がないブラウザで実行する）
■ 操作手順：
  1. https://www.saucedemo.com/checkout-step-two.html を直接開く
■ 期待結果：
  - URLが https://www.saucedemo.com/ になる
  - ログインボタンが表示される
  - 「Epic sadface: You can only access '/checkout-step-two.html' when you are logged in.」が表示される
■ 優先度：高

---

## ■ サマリー表

| テストID | 分類 | 対応する観点 | 優先度 | 実装方針 |
|---|---|---|---|---|
| TC-CO2-001 | 表示 | V-01, V-02 | 中 | 個別実装 |
| TC-CO2-002 | 表示（全商品） | V-03, V-04 | 高 | 個別実装 |
| TC-CO2-003 | 並び順 | O-01 | 中 | 個別実装 |
| TC-CO2-004 | 金額（1件） | M-01 | 高 | Data-driven（004〜006共通化） |
| TC-CO2-005 | 金額（2件） | M-01 | 高 | Data-driven（004〜006共通化） |
| TC-CO2-006 | 金額（全6件） | M-01 | 高 | Data-driven（004〜006共通化） |
| TC-CO2-007 | 画面遷移（Finish） | T-01 | 高 | Data-driven（007〜009共通化） |
| TC-CO2-008 | 画面遷移（Cancel） | T-02 | 高 | Data-driven（007〜009共通化） |
| TC-CO2-009 | 画面遷移（カートアイコン） | T-03 | 低 | Data-driven（007〜009共通化） |
| TC-CO2-010 | 画面遷移（商品名） | T-04 | 低 | 個別実装 |
| TC-CO2-011 | 状態（Finish後） | S-01 | 高 | 個別実装 |
| TC-CO2-012 | 状態（Cancel後） | S-02 | 中 | 個別実装 |
| TC-CO2-013 | 状態（再読み込み） | S-03 | 低 | 個別実装 |
| TC-CO2-014 | 認証 | A-01 | 高 | 個別実装 |

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| 小計の桁あふれ、Step One を経由しない表示・購入、カートが空のときの表示・購入、空カートの小計の形式、購入完了後のブラウザの「戻る」、Step One の入力値が表示されないこと | 意図された仕様か不具合かを判断できないため（仕様書「判断できない挙動」参照） |
| 端数処理の方式（四捨五入か切り上げか） | 画面操作で作れる状態では区別できないため。確認する組み合わせの金額は、どちらの方式でも同じ値になる |
| 仕様書「実機で確認した値」のうち、Fleece Jacket 1件、同じ価格の2件（Bolt T-Shirt ＋ Red T-Shirt） | 1件・2件・全6件の3通りで、税率8%と「合計＝小計＋税」の確認には十分で、他の組み合わせで結果の傾向が変わる可能性は低いため |
| 特殊ユーザー（problem_user等） | 今後の拡張候補 |
| ハンバーガーメニュー | Logout機能で扱う |
| Complete・Products・商品詳細・Cart画面の中身 | それぞれの画面の仕様で扱う |
| 見た目の比較（Visual Regression） | Stage 2-1で扱う |

## ■ TS版テスト（Step Two に関係するもの）との対応

| TS版のテスト | 対応するPython版のテストケース | 備考 |
|---|---|---|
| checkout-success.spec.ts ①〜⑥ の Finish 操作 | TC-CO2-007 | TS版は完了URLと完了見出しのみ確認。Python版は Step Two の表示・金額（TC-CO2-001〜006）と、購入後にカートが空になること（TC-CO2-011）まで確認 |
| checkout-cancel.spec.ts ⑤ 確認画面から商品一覧へ戻る | TC-CO2-008、TC-CO2-012 | TS版はURLのみ。Python版はカートの中身が変わらないことまで確認 |
| tests/visual/checkout-step-two-visual.spec.ts | 対象外 | Stage 2-1 で扱う |
| tests/visual/checkout-complete-visual.spec.ts | 対象外 | Complete画面で扱う（Visual は Stage 2-1） |
