# Logout（左上のメニュー）テストケース（初版・10件）

共通の前提：standard_user でログイン済みで、各テストケースの「前提条件」に記載した画面を開いている

前提状態の作り方：
- ログイン済みの状態は、保存したログイン状態を読み込んで作り、Products画面を開いた状態から始める（ほかの画面のテストと同じ）
- カートの中身が必要な場合は、ブラウザの保存領域（localStorage の cart-contents）への直接書き込みで作る（python/decisions.md の論点15）
- Cart画面は、カートの中身を書き込んだ後に URL で開き、商品の行の数が入れた件数と同じことを確かめる（cart_testcases.md の「前提状態の作り方」と同じ）
- Checkout Complete画面は、checkout_complete_testcases.md の「前提状態の作り方」と同じ方法で開く
- ログアウトしても、保存したログイン状態は変わらない（ログアウトで消えるのは、テストごとのブラウザの中のログイン状態だけ）。そのため、ほかのテストと同じ保存したログイン状態を使ってよい

テストIDの付け方：「TC-LOGOUT」とする

対応する仕様書：logout_spec.md
対応するテスト：TS版は `typescript/tests/ui/logout/logout-*.spec.ts`、Python版は `python/tests/ui/logout/test_logout_*.py`
（両版とも同じ10件。下の「両版のテストとの対応」を参照）
実行するブラウザ：TS版は Chromium・Firefox・WebKit、Python版は Chromium

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
■ 前提条件：Cart画面を開いている（カートは空）
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
| TC-LOGOUT-002 | メニュー（×で閉じる） | M-02 | 低 | TC-LOGOUT-003 とデータを切り替えて共通化 |
| TC-LOGOUT-003 | メニュー（Escで閉じる） | M-02 | 低 | TC-LOGOUT-002 とデータを切り替えて共通化 |
| TC-LOGOUT-004 | Logout（Products画面から） | L-01 | 高 | TC-LOGOUT-005・006 とデータを切り替えて共通化 |
| TC-LOGOUT-005 | Logout（Cart画面から） | L-01, L-02 | 中 | TC-LOGOUT-004・006 とデータを切り替えて共通化 |
| TC-LOGOUT-006 | Logout（Complete画面から） | L-01, L-02 | 低 | TC-LOGOUT-004・005 とデータを切り替えて共通化 |
| TC-LOGOUT-007 | ログアウト後の直接アクセス（Products） | L-03 | 高 | TC-LOGOUT-008 とデータを切り替えて共通化 |
| TC-LOGOUT-008 | ログアウト後の直接アクセス（商品詳細） | L-03 | 低 | TC-LOGOUT-007 とデータを切り替えて共通化 |
| TC-LOGOUT-009 | ログアウト後のブラウザの「戻る」 | L-04 | 高 | 個別実装 |
| TC-LOGOUT-010 | All Items | I-01 | 中 | 個別実装 |

## ■ 実装時の注意

- **メニューが開いているかどうかの判定**：URLで開いた直後は、メニューが閉じる動きが終わるまで、閉じているメニューの項目も「表示されている」と判定される（実機確認済み）。
  メニューの開閉は、表示されているかどうかではなく、メニュー領域の aria-hidden 属性（開いているとき "false"、閉じているとき "true"）で判定すること
- **Logout を押す前に、必ずメニューを開くこと**：URLで開いた直後に、メニューを開かずに Logout を押そうとすると失敗する（実機確認済み）
- **メニューを開く前と後の確認**：メニューを開く前に、閉じたメニューの項目が見えなくなるのを待つ（画面を開いた直後の、メニューが閉じる動きの間に開くと、項目が隠れたままになるため。仕様書「判断できない挙動」参照）。
  開いたことは、aria-hidden と最初の項目の表示の両方で確かめる。
  画面の中で移った直後（例：Finish で Complete画面へ移った直後）は、開く前の待ちでは閉じる動きのやり直しの前の瞬間を見分けられないため、
  まれに競合が残る（2026-11-22 に Logout のテストを3ブラウザで5回ずつ〈150件〉流したとき、WebKit の TC-LOGOUT-006 で1回起きた）。
  起きたときは、メニューを開いた確認（最初の項目の表示）で、「メニューは開いた扱いだが項目が表示されない」という説明つきで失敗する
- **ブラウザの「戻る」（TC-LOGOUT-009）**：ブラウザのキャッシュの仕組みに左右される可能性がある。テストが不安定になった場合は、扱いを見直す
- **メニューが閉じていることの確認（TC-LOGOUT-002・003・010）**：先に、メニューが開いたこと（aria-hidden が "false"）を確かめておく。開かなかったときにも、閉じていると判定されて成功してしまうため
- **ログアウトした後の確認（TC-LOGOUT-004〜009）**：ログアウトの操作の中で、ログイン画面へ戻ったことまで確かめる。
  TC-LOGOUT-007〜009 では、ログアウトした直後もログイン画面のため、画面の確認より先に、戻された後に出るエラーの文言を確かめる

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

## ■ 両版のテストとの対応

両版とも、テストケースの10件を実装している。
ログアウトの API のテスト（TS版の `typescript/tests/api/logout-api.spec.ts`）は、画面のテストではないため、API のテスト（api_testcases.md）で扱う。

| テストID | TS版（typescript/tests/ui/logout/） | Python版（python/tests/ui/logout/） |
|---|---|---|
| TC-LOGOUT-001 | logout-menu.spec.ts「TC-LOGOUT-001：…」 | test_logout_menu.py `test_menu_items_displayed_in_order` |
| TC-LOGOUT-002 | logout-menu.spec.ts「TC-LOGOUT-002：…」（TC-LOGOUT-003 とデータを切り替える形） | test_logout_menu.py `test_menu_closed[TC-LOGOUT-002]` |
| TC-LOGOUT-003 | logout-menu.spec.ts「TC-LOGOUT-003：…」（TC-LOGOUT-002 とデータを切り替える形） | test_logout_menu.py `test_menu_closed[TC-LOGOUT-003]` |
| TC-LOGOUT-004 | logout-success.spec.ts「TC-LOGOUT-004：…」（TC-LOGOUT-005・006 とデータを切り替える形） | test_logout_success.py `test_logout_to_empty_login_page[TC-LOGOUT-004]` |
| TC-LOGOUT-005 | logout-success.spec.ts「TC-LOGOUT-005：…」（TC-LOGOUT-004・006 とデータを切り替える形） | test_logout_success.py `test_logout_to_empty_login_page[TC-LOGOUT-005]` |
| TC-LOGOUT-006 | logout-success.spec.ts「TC-LOGOUT-006：…」（TC-LOGOUT-004・005 とデータを切り替える形） | test_logout_success.py `test_logout_to_empty_login_page[TC-LOGOUT-006]` |
| TC-LOGOUT-007 | logout-access.spec.ts「TC-LOGOUT-007：…」（TC-LOGOUT-008 とデータを切り替える形） | test_logout_access.py `test_direct_access_after_logout[TC-LOGOUT-007]` |
| TC-LOGOUT-008 | logout-access.spec.ts「TC-LOGOUT-008：…」（TC-LOGOUT-007 とデータを切り替える形） | test_logout_access.py `test_direct_access_after_logout[TC-LOGOUT-008]` |
| TC-LOGOUT-009 | logout-access.spec.ts「TC-LOGOUT-009：…」 | test_logout_access.py `test_browser_back_after_logout` |
| TC-LOGOUT-010 | logout-all-items.spec.ts「TC-LOGOUT-010：…」 | test_logout_all_items.py `test_all_items_from_cart` |
