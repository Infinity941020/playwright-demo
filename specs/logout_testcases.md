# Logout（左上のメニュー）テストケース（初版・10件）

共通の前提：standard_user でログイン済みで、各テストケースの「前提条件」に記載した画面を開いている

前提状態の作り方：
- ログイン済みの状態は、これまでと同じく logged_page（保存したログイン状態の再利用）で作る
- カートの中身が必要な場合は、ブラウザの保存領域（localStorage の cart-contents）への直接書き込みで作る（decisions.md 論点15）

テストIDの付け方：「TC-LOGOUT」とする

対応する仕様書：logout_spec.md

---

## ■ テスト観点

| 観点ID | 分類 | 観点 | 仕様書の該当箇所 |
|---|---|---|---|
| M-01 | メニュー | メニューを開くと、5つの項目が仕様どおりの並び順で表示されること | メニュー |
| M-02 | メニュー | ×ボタン・Esc キーでメニューが閉じること | メニュー（開閉） |
| L-01 | Logout | Logout を押すと Login画面へ遷移し、入力欄が空で、エラーが表示されていないこと | Logout |
| L-02 | Logout | Products画面以外からも、同じようにログアウトできること | Logout |
| L-03 | ログアウト後 | ログアウト後に、ログインが必要な画面へ直接アクセスすると、Login画面へ戻されエラーが表示されること | ログアウト後のアクセス制限 |
| L-04 | ログアウト後 | ログアウト後にブラウザの「戻る」を押しても、Login画面のままでエラーが表示されること | ログアウト後のアクセス制限 |
| I-01 | All Items | All Items を押すと Products画面へ遷移し、メニューが閉じ、カートの中身が変わらないこと | All Items |

---

## TC-LOGOUT-001
■ テスト内容：メニューを開くと、5つの項目が仕様どおりの並び順で表示されること
■ 前提条件：Products画面を開いている
■ 操作手順：
  1. 左上のメニューを開くボタンを押す
■ 期待結果：メニューの項目が「All Items」→「Dynamic Catalog」→「About」→「Logout」→「Reset App State」の順で表示される
■ 優先度：中

---

## TC-LOGOUT-002
■ テスト内容：×ボタンを押すと、メニューが閉じること
■ 前提条件：Products画面を開いている
■ 操作手順：
  1. 左上のメニューを開くボタンを押す
  2. メニューの×ボタンを押す
■ 期待結果：メニューが閉じている
■ 優先度：低

---

## TC-LOGOUT-003
■ テスト内容：Esc キーを押すと、メニューが閉じること
■ 前提条件：Products画面を開いている
■ 操作手順：
  1. 左上のメニューを開くボタンを押す
  2. Esc キーを押す
■ 期待結果：メニューが閉じている
■ 優先度：低

---

## TC-LOGOUT-004
■ テスト内容：Products画面からログアウトすると、空の Login画面へ遷移すること
■ 前提条件：Products画面を開いている
■ 操作手順：
  1. 左上のメニューを開くボタンを押す
  2. 「Logout」を押す
■ 期待結果：
  - URLが https://www.saucedemo.com/ になる
  - ユーザー名・パスワードの入力欄と Login ボタンが表示される
  - ユーザー名・パスワードの入力欄が空である
  - エラーメッセージが表示されていない
■ 優先度：高

---

## TC-LOGOUT-005
■ テスト内容：Cart画面からログアウトすると、空の Login画面へ遷移すること
■ 前提条件：Cart画面を開いている
■ 操作手順：
  1. 左上のメニューを開くボタンを押す
  2. 「Logout」を押す
■ 期待結果：TC-LOGOUT-004 と同じ
■ 優先度：中

---

## TC-LOGOUT-006
■ テスト内容：Checkout Complete画面からログアウトすると、空の Login画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入った状態から購入を完了し、Checkout Complete画面を開いている
  （Complete画面の開き方は checkout_complete_testcases.md の「前提状態の作り方」と同じ）
■ 操作手順：
  1. 左上のメニューを開くボタンを押す
  2. 「Logout」を押す
■ 期待結果：TC-LOGOUT-004 と同じ
■ 優先度：低

---

## TC-LOGOUT-007
■ テスト内容：ログアウト後に Products画面へ直接アクセスすると、Login画面へ戻されること
■ 前提条件：Products画面を開いている
■ 操作手順：
  1. メニューから「Logout」を押してログアウトする
  2. https://www.saucedemo.com/inventory.html を直接開く
■ 期待結果：
  - URLが https://www.saucedemo.com/ になる
  - 「Epic sadface: You can only access '/inventory.html' when you are logged in.」が表示される
■ 優先度：高

---

## TC-LOGOUT-008
■ テスト内容：ログアウト後に商品詳細画面へ直接アクセスすると、Login画面へ戻されること
■ 前提条件：Products画面を開いている
■ 操作手順：
  1. メニューから「Logout」を押してログアウトする
  2. https://www.saucedemo.com/inventory-item.html?id=4 を直接開く
■ 期待結果：
  - URLが https://www.saucedemo.com/ になる
  - 「Epic sadface: You can only access '/inventory-item.html' when you are logged in.」が表示される
    （クエリ「?id=4」は文言に含まれない）
■ 優先度：低

---

## TC-LOGOUT-009
■ テスト内容：ログアウト後にブラウザの「戻る」を押しても、ログイン後の画面に戻れないこと
■ 前提条件：Products画面を開いている
■ 操作手順：
  1. メニューから「Logout」を押してログアウトする
  2. ブラウザの「戻る」を押す
■ 期待結果：
  - URLが https://www.saucedemo.com/ になる
  - 「Epic sadface: You can only access '/inventory.html' when you are logged in.」が表示される
■ 優先度：高

---

## TC-LOGOUT-010
■ テスト内容：Cart画面で All Items を押すと、Products画面へ遷移し、メニューが閉じ、カートの中身が変わらないこと
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入った状態で、Cart画面を開いている
■ 操作手順：
  1. 左上のメニューを開くボタンを押す
  2. 「All Items」を押す
■ 期待結果：
  - Products画面（/inventory.html）へ遷移する
  - メニューが閉じている
  - カートアイコンのバッジに「2」が表示される
  - 「Sauce Labs Backpack」と「Sauce Labs Bike Light」のボタンがどちらも「Remove」である
■ 優先度：中

---

## ■ サマリー表

| テストID | 分類 | 対応する観点 | 優先度 | 実装方針 |
|---|---|---|---|---|
| TC-LOGOUT-001 | メニュー（表示） | M-01 | 中 | 個別実装 |
| TC-LOGOUT-002 | メニュー（×で閉じる） | M-02 | 低 | Data-driven（002・003共通化） |
| TC-LOGOUT-003 | メニュー（Escで閉じる） | M-02 | 低 | Data-driven（002・003共通化） |
| TC-LOGOUT-004 | Logout（Products画面から） | L-01 | 高 | Data-driven（004〜006共通化） |
| TC-LOGOUT-005 | Logout（Cart画面から） | L-01, L-02 | 中 | Data-driven（004〜006共通化） |
| TC-LOGOUT-006 | Logout（Complete画面から） | L-01, L-02 | 低 | Data-driven（004〜006共通化） |
| TC-LOGOUT-007 | ログアウト後の直接アクセス（Products） | L-03 | 高 | Data-driven（007・008共通化） |
| TC-LOGOUT-008 | ログアウト後の直接アクセス（商品詳細） | L-03 | 低 | Data-driven（007・008共通化） |
| TC-LOGOUT-009 | ログアウト後のブラウザの「戻る」 | L-04 | 高 | 個別実装 |
| TC-LOGOUT-010 | All Items | I-01 | 中 | 個別実装 |

## ■ 実装時の注意

- **メニューが開いているかどうかの判定**：URLで開いた直後の画面では、閉じているメニューの Logout が「表示されている」と判定されてしまう（実機確認済み）。
  メニューの開閉は、表示されているかどうかではなく、メニュー領域の aria-hidden 属性（開いているとき "false"、閉じているとき "true"）で判定すること
- **Logout を押す前に、必ずメニューを開くこと**：URLで開いた直後に、メニューを開かずに Logout を押そうとすると失敗する（実機確認済み）
- **ブラウザの「戻る」（TC-LOGOUT-009）**：ブラウザのキャッシュの仕組みに左右される可能性がある。テストが不安定になった場合は、扱いを見直す

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| Checkout Step One・Step Two・商品詳細画面からのログアウト | メニューはすべての画面で同じ部品で、項目・並び順も同じことを実機で確認済み。Products・Cart・Complete の3画面で、画面の種類（一覧・カート・購入手続き）を代表させる（Login画面の「無効×無効」除外と同じ考え方） |
| ログアウト後の Cart・Checkout 各画面への直接アクセス | 未ログイン時の直接アクセスは、各画面のテスト（TC-CART-011、TC-CO1-013、TC-CO2-014、TC-CO3-006）で確認済み。ログアウト後の状態は Products と、文言の形が異なる商品詳細で代表させる |
| Products画面以外からのログアウト後の「戻る」 | 実機で確認したのは Products画面からのみのため |
| ログアウトしてもカートが消えない、メニューの外側のクリックで閉じない、Products画面で All Items を押してもメニューが開いたまま | 意図された仕様か不具合かを判断できないため（仕様書「判断できない挙動」参照） |
| Reset App State、Dynamic Catalog、About | 今後の拡張候補（仕様書「本仕様の対象外」参照） |
| Checkout Step Two・商品詳細画面からの All Items | 実機で未確認のため |
| 特殊ユーザー（problem_user等） | 今後の拡張候補 |

## ■ TS版テスト（Logout に関係するもの）との対応

| TS版のテスト | 対応するPython版のテストケース | 備考 |
|---|---|---|
| tests/ui/logout/logout.spec.ts（1件） | TC-LOGOUT-004 | TS版は URL と入力欄・ボタンの表示のみ。Python版は入力欄が空であること、エラーがないことまで確認 |
| tests/api/logout-api.spec.ts（3件） | 対象外 | モックAPIのテストのため、Stage 2-1（APIテスト）で扱う |
