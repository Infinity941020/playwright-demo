# Checkout Complete画面 テストケース（初版・6件）

共通の前提：standard_user でログイン済み。各テストケースの「前提条件」に記載した商品がカートに入った状態から、
購入を完了して Checkout Complete画面を開いている
（TC-CO3-006 のみ未ログイン状態が前提）

前提状態の作り方：
- カートの中身は、ブラウザの保存領域（localStorage の cart-contents）への直接書き込みで作る（decisions.md 論点15）
- Checkout Complete画面は、Checkout Step One画面をURLで開き、購入者情報（Taro／Yamada／1000001）を入力して Continue を押し、
  Checkout Step Two画面で Finish を押して開く
  - 理由：購入せずに Complete画面をURLで直接開けることは、意図された仕様か不具合かを判断できない挙動のため（仕様書「判断できない挙動」参照）。
    また、PDF出力ボタンは購入直後にしか表示されないため
  - 受け入れるリスク：Step One・Step Two の不具合で、Complete のテストもまとめて失敗する可能性がある。失敗したときは TC-CO1・TC-CO2 の結果から原因を切り分ける

テストIDの付け方：Step One を「TC-CO1」、Step Two を「TC-CO2」、Complete を「TC-CO3」とする

対応する仕様書：checkout_complete_spec.md

---

## ■ テスト観点

| 観点ID | 分類 | 観点 | 仕様書の該当箇所 |
|---|---|---|---|
| V-01 | 表示 | 画面タイトル・見出し・本文・画像・Back Home ボタンが仕様どおりに表示されること | 項目一覧、表示 |
| V-02 | 表示 | 購入直後に、PDF出力ボタンが表示されること | 表示（PDF出力ボタンの表示） |
| V-03 | 表示 | カートアイコンのバッジが表示されないこと | 表示 |
| T-01 | 画面遷移 | Back Home を押すと、Products画面へ遷移すること | 画面遷移 |
| T-02 | 画面遷移 | カートアイコンを押すと、Cart画面へ遷移すること | 画面遷移 |
| S-01 | 状態 | Back Home で Products画面へ移っても、カートが空のままであること | 状態 |
| S-02 | 状態 | カートアイコンで Cart画面へ移っても、カートが空のままであること | 状態 |
| A-01 | 認証 | 未ログインで直接アクセスすると、Login画面へ戻され、エラーメッセージが表示されること | 未ログイン時 |

---

## TC-CO3-001
■ テスト内容：購入直後に、画面が仕様どおりに表示されること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入った状態から購入を完了している
■ 操作手順：
  1. Checkout Complete画面の表示内容を確認する
■ 期待結果：
  - 画面タイトル「Checkout: Complete!」が表示される
  - 見出し「Thank you for your order!」が表示される
  - 本文「Your order has been dispatched, and will arrive just as fast as the pony can get there!」が表示される
  - 代替テキストが「Pony Express」の画像が表示される
  - 「Back Home」ボタンが表示される
  - 「Generate PDF order」ボタンが表示される
  - カートアイコンのバッジが表示されない
■ 優先度：高

---

## TC-CO3-002
■ テスト内容：Back Home を押すと、Products画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入った状態から購入を完了している
■ 操作手順：
  1. 「Back Home」ボタンを押す
■ 期待結果：Products画面（/inventory.html）へ遷移する
■ 優先度：高

---

## TC-CO3-003
■ テスト内容：カートアイコンを押すと、Cart画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入った状態から購入を完了している
■ 操作手順：
  1. 右上のカートアイコンを押す
■ 期待結果：Cart画面（/cart.html）へ遷移する
■ 優先度：低

---

## TC-CO3-004
■ テスト内容：Back Home で Products画面へ移っても、カートが空のままであること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入った状態から購入を完了している
■ 操作手順：
  1. 「Back Home」ボタンを押す
■ 期待結果：
  - カートアイコンのバッジが表示されない
  - Products画面の「Sauce Labs Backpack」と「Sauce Labs Bike Light」のボタンがどちらも「Add to cart」である
■ 優先度：中

---

## TC-CO3-005
■ テスト内容：カートアイコンで Cart画面へ移っても、カートが空のままであること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入った状態から購入を完了している
■ 操作手順：
  1. 右上のカートアイコンを押す
■ 期待結果：
  - Cart画面の商品の行が0件である
  - カートアイコンのバッジが表示されない
■ 優先度：中

---

## TC-CO3-006
■ テスト内容：未ログインで直接アクセスすると、Login画面へ戻されること
■ 前提条件：未ログイン状態である（ログイン状態を引き継がないブラウザで実行する）
■ 操作手順：
  1. https://www.saucedemo.com/checkout-complete.html を直接開く
■ 期待結果：
  - URLが https://www.saucedemo.com/ になる
  - ログインボタンが表示される
  - 「Epic sadface: You can only access '/checkout-complete.html' when you are logged in.」が表示される
■ 優先度：高

---

## ■ サマリー表

| テストID | 分類 | 対応する観点 | 優先度 | 実装方針 |
|---|---|---|---|---|
| TC-CO3-001 | 表示 | V-01, V-02, V-03 | 高 | 個別実装 |
| TC-CO3-002 | 画面遷移（Back Home） | T-01 | 高 | Data-driven（002・003共通化） |
| TC-CO3-003 | 画面遷移（カートアイコン） | T-02 | 低 | Data-driven（002・003共通化） |
| TC-CO3-004 | 状態（Products画面へ） | S-01 | 中 | 個別実装 |
| TC-CO3-005 | 状態（Cart画面へ） | S-02 | 中 | 個別実装 |
| TC-CO3-006 | 認証 | A-01 | 高 | 個別実装 |

## ■ 実装時の注意

- 画像は、見出しが表示された時点で読み込みが終わっていない場合がある（仕様書「判断できない挙動」参照）。画像の確認は、要素が表示されていることと代替テキストで行い、読み込みの完了は確認しない

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| 購入せずに直接開ける、PDF出力ボタンが再読み込み等で消える、画像の読み込みの遅れ、Back Home 後の「戻る」 | 意図された仕様か不具合かを判断できないため（仕様書「判断できない挙動」参照） |
| PDFのダウンロードとPDFの中身 | 今後の拡張候補（仕様書「本仕様の対象外」参照） |
| ハンバーガーメニュー | Logout 機能（logout_testcases.md）で扱う |
| 特殊ユーザー（problem_user等） | 今後の拡張候補 |
| 見た目の比較（Visual Regression） | Stage 2-1で扱う |

## ■ TS版テスト（Complete に関係するもの）との対応

| TS版のテスト | 対応するPython版のテストケース | 備考 |
|---|---|---|
| checkout-success.spec.ts ①〜⑥ の完了画面の確認 | TC-CO3-001 | TS版は完了URLと見出しの表示のみ。Python版は文言、画像、ボタン、バッジまで確認 |
| tests/visual/checkout-complete-visual.spec.ts | 対象外 | Stage 2-1 で扱う |
