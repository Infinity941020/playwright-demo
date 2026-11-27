# Cart画面 テストケース

共通の前提：standard_user でログイン済み。各テストケースの「前提条件」に記載した商品が、
記載した順にカートに入った状態で Cart画面を開いている
（TC-CART-011 のみ未ログイン状態が前提）

前提状態の作り方：
- TC-CART-003 と TC-CART-010 は、必ず Products画面での画面操作（Add to cart）で商品を追加し、カートアイコンから Cart画面を開く
  - TC-CART-003：「追加した順に並ぶこと」の確認であるため（ブラウザの保存領域への直接書き込みでは、追加操作そのものを確認できない）
  - TC-CART-010：画面で追加した内容が保存されない不具合も見つけられるようにするため
    （保存領域へ直接書き込むと、再読み込みは書き込んだ内容を読み直すだけになり、画面の追加が保存されているかを確認できない）。
    再読み込みの前に、商品の行が2件あることを確かめる
- それ以外のテストケース（TC-CART-001・002・004〜009）は、ログイン後にブラウザの保存領域（localStorage の cart-contents）へ
  商品IDの配列を直接書き込み、Cart画面を開くことで前提状態を作る（決定日：2026-10-07）
  - 理由：Products画面の不具合でCart画面のテストまで失敗しないようにするため（テストの独立性）。
    画面操作による追加は、TC-CART-003・010 と Products画面のテストで確認している
  - 書き込みと画面表示が一致することは実機で確認済み（2026-10-07）
  - 書き込みが効かずに空のカートのままテストが進まないように、Cart画面を開いた後に、商品の行の数が入れた件数と同じことを確かめる

対応する仕様書：cart_spec.md
対応するテスト：TS版は `typescript/tests/ui/cart/`、Python版は `python/tests/ui/cart/`（両版とも同じ11件。下の「両版のテストとの対応」を参照）
実行するブラウザ：TS版は Chromium・Firefox・WebKit、Python版は Chromium

---

## ■ テスト観点

| 観点ID | 分類 | 観点 | 仕様書の該当箇所 |
|---|---|---|---|
| V-01 | 表示 | カートが空のとき、タイトル・見出し・Continue Shopping・Checkout が表示され、商品の行とバッジは表示されないこと | 表示（カートが空のとき） |
| V-02 | 表示 | カート内の商品1件につき1行表示され、各行に数量（1）・商品名・説明・価格・Removeボタンが表示されること | 表示（カートに商品があるとき） |
| V-03 | 表示 | 商品名と価格の組み合わせが、Products画面の表示と一致すること | 表示（カートに商品があるとき） |
| O-01 | 並び順 | カートに追加した順に表示されること | 表示（並び順） |
| R-01 | 削除 | Remove を押した商品の行だけが消え、他の商品の行は残ること | 操作 |
| R-02 | 削除 | Remove を押すと、バッジの件数が1減ること | 操作 |
| R-03 | 削除 | 最後の1件を Remove すると、商品の行とバッジがなくなり、見出しと Checkout ボタンは残ること | 操作 |
| T-01 | 画面遷移 | Continue Shopping を押すと、Products画面へ遷移すること | 画面遷移 |
| T-02 | 画面遷移 | Checkout を押すと、Checkout Step One画面へ遷移すること | 画面遷移 |
| T-03 | 画面遷移 | 商品名を押すと、商品詳細画面へ遷移すること | 画面遷移 |
| L-01 | 画面連動 | Cart画面で削除した商品は Products画面で「Add to cart」に戻り、削除していない商品は「Remove」のままであること | Products画面との連動 |
| P-01 | 状態保持 | 再読み込み後も、カートの内容が保持されること | 状態の保持 |
| A-01 | 認証 | 未ログインで直接アクセスすると、Login画面へ戻され、エラーメッセージが表示されること | 未ログイン時 |

---

## TC-CART-001
■ テスト内容：カートが空のとき、空の状態の表示になること
■ 前提条件：カートは空
■ 操作手順：
  1. Cart画面の表示内容を確認する
■ 期待結果：
  - 画面タイトル「Your Cart」が表示される
  - 一覧の見出し「QTY」「Description」が表示される
  - 「Continue Shopping」ボタンと「Checkout」ボタンが表示される
  - 商品の行が0件である
  - カートアイコンのバッジが表示されない
■ 優先度：中

---

## TC-CART-002
■ テスト内容：全商品をカートに入れたとき、全商品が仕様どおりに表示されること
■ 前提条件：全6商品が、仕様書（products_spec.md）「表示商品」の表の順（No.1→No.6）でカートに入っている
■ 操作手順：
  1. Cart画面の表示内容を確認する
■ 期待結果：
  - 商品の行が6件表示される
  - 各行に「数量（1）／商品名／説明／価格／Removeボタン」が表示される
  - 各行の商品名と価格の組み合わせが、products_spec.md「表示商品」の表と一致する
  - カートアイコンのバッジに「6」が表示される
  （実機確認済み（2026-10-07））
■ 優先度：高

---

## TC-CART-003
■ テスト内容：カートに追加した順に表示されること
■ 前提条件：カートは空で、Products画面を開いている
■ 操作手順：
  1. Products画面で「Sauce Labs Bike Light」→「Sauce Labs Backpack」→「Sauce Labs Onesie」の順に Add to cart ボタンを押す
     （補足：この順は、商品名の昇順（Backpack→Bike Light→Onesie）・降順（Onesie→Bike Light→Backpack）、
     商品IDの昇順（0→2→4）・降順（4→2→0）のどれにも当たらない〈商品IDでは 0→4→2〉ため、追加順で並んでいることを区別できる）
  2. カートアイコンを押して Cart画面を開き、Cart画面が表示されていることを確かめる
  3. Cart画面の商品の並び順を確認する
■ 期待結果：商品名の並びが「Sauce Labs Bike Light」→「Sauce Labs Backpack」→「Sauce Labs Onesie」である
■ 優先度：中

---

## TC-CART-004
■ テスト内容：Remove を押すと、その商品の行だけが消え、バッジが1減ること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」→「Sauce Labs Onesie」の順でカートに入っている
■ 操作手順：
  1. 2行目の「Sauce Labs Bike Light」の Remove ボタンを押す
     （補足：先頭行ではなく途中の行を削除することで、「押した行ではなく先頭行が消える」不具合も検出できるようにする）
■ 期待結果：
  - 商品の行が2件で、商品名の並びが「Sauce Labs Backpack」→「Sauce Labs Onesie」である
  - カートアイコンのバッジに「2」が表示される
■ 優先度：高

---

## TC-CART-005
■ テスト内容：最後の1件を Remove すると、商品の行とバッジがなくなること
■ 前提条件：「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. 「Sauce Labs Backpack」の Remove ボタンを押す
■ 期待結果：
  - 商品の行が0件である
  - カートアイコンのバッジが表示されない
  - 一覧の見出し「QTY」「Description」と「Checkout」ボタンは表示されたままである
■ 優先度：中

---

## TC-CART-006
■ テスト内容：Continue Shopping を押すと、Products画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. 「Continue Shopping」ボタンを押す
■ 期待結果：Products画面（/inventory.html）へ遷移する
■ 優先度：高

---

## TC-CART-007
■ テスト内容：Checkout を押すと、Checkout Step One画面へ遷移すること
■ 前提条件：「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. 「Checkout」ボタンを押す
■ 期待結果：Checkout Step One画面（/checkout-step-one.html）へ遷移する
■ 優先度：高

---

## TC-CART-008
■ テスト内容：商品名を押すと、商品詳細画面へ遷移すること
■ 前提条件：「Sauce Labs Bike Light」がカートに入っている
■ 操作手順：
  1. 「Sauce Labs Bike Light」の商品名を押す
■ 期待結果：商品詳細画面（/inventory-item.html?id=0）へ遷移する
  （補足：Cart画面からの遷移は Bike Light で実機確認済みのため、この商品を使う）
■ 優先度：低

---

## TC-CART-009
■ テスト内容：Cart画面での削除が、Products画面の表示に反映されること
■ 前提条件：「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順でカートに入っている
■ 操作手順：
  1. 「Sauce Labs Backpack」の Remove ボタンを押す
  2. 「Continue Shopping」ボタンを押す
■ 期待結果：
  - Products画面の「Sauce Labs Backpack」のボタンが「Add to cart」である
  - Products画面の「Sauce Labs Bike Light」のボタンが「Remove」である
■ 優先度：中

---

## TC-CART-010
■ テスト内容：再読み込み後も、カートの内容が保持されること
■ 前提条件：Products画面で「Sauce Labs Backpack」→「Sauce Labs Bike Light」の順に Add to cart を押し、カートアイコンから Cart画面を開いている
  （カート画面の表示と、商品の行が2件であることを確かめてから操作する）
■ 操作手順：
  1. ページを再読み込みする
■ 期待結果：
  - 商品の行が2件で、商品名が「Sauce Labs Backpack」と「Sauce Labs Bike Light」である
    （並び順は TC-CART-003 で確認するため、本テストでは問わない）
  - カートアイコンのバッジに「2」が表示される
■ 優先度：中

---

## TC-CART-011
■ テスト内容：未ログインで直接アクセスすると、Login画面へ戻されること
■ 前提条件：未ログイン状態である（ログイン状態を引き継がないブラウザで実行する）
■ 操作手順：
  1. https://www.saucedemo.com/cart.html を直接開く
■ 期待結果：
  - URLが https://www.saucedemo.com/ になる
  - ログインボタンが表示される
  - 「Epic sadface: You can only access '/cart.html' when you are logged in.」が表示される
■ 優先度：高

---

## ■ サマリー表

| テストID | 分類 | 対応する観点 | 優先度 | 実装方針 |
|---|---|---|---|---|
| TC-CART-001 | 表示（空） | V-01 | 中 | 個別実装 |
| TC-CART-002 | 表示（全商品） | V-02, V-03 | 高 | 個別実装 |
| TC-CART-003 | 並び順 | O-01 | 中 | 個別実装 |
| TC-CART-004 | 削除（1件） | R-01, R-02 | 高 | 個別実装 |
| TC-CART-005 | 削除（最後の1件） | R-03 | 中 | 個別実装 |
| TC-CART-006 | 画面遷移（Continue Shopping） | T-01 | 高 | TC-CART-007 とデータを切り替えて共通化 |
| TC-CART-007 | 画面遷移（Checkout） | T-02 | 高 | TC-CART-006 とデータを切り替えて共通化 |
| TC-CART-008 | 画面遷移（商品名） | T-03 | 低 | 個別実装 |
| TC-CART-009 | 画面連動 | L-01 | 中 | 個別実装 |
| TC-CART-010 | 状態保持 | P-01 | 中 | 個別実装 |
| TC-CART-011 | 認証 | A-01 | 高 | 個別実装 |

## ■ 対象外としたもの

| 項目 | 扱い |
|---|---|
| カートが空の状態での Checkout | 意図された仕様か不具合かを判断できないため対象外（今後の拡張候補） |
| 存在しない商品IDや同じ商品IDがカートに入った状態 | 画面操作では作れない状態のため対象外 |
| 特殊ユーザー（problem_user等） | 今後の拡張候補 |
| ハンバーガーメニュー | Logout機能で扱う |
| Checkout画面・商品詳細画面の中身 | それぞれの画面の仕様で扱う（商品詳細は今後の拡張候補） |
| 見た目の比較（Visual Regression） | 見た目の比較のテストで扱う（visual_testcases.md） |
| 2件続けて削除したときのバッジ件数 | 1件削除でバッジが1減ること（TC-CART-004）と同じ仕組みの繰り返しで、結果が変わる可能性が低いため（Login画面の「無効×無効」除外と同じ考え方） |

## ■ 両版のテストとの対応

両版とも、テストケースの11件を実装している。

| テストID | TS版（typescript/tests/ui/cart/） | Python版（python/tests/ui/cart/） |
|---|---|---|
| TC-CART-001 | cart-display.spec.ts「TC-CART-001：…」 | test_cart_display.py `test_empty_cart_displayed` |
| TC-CART-002 | cart-display.spec.ts「TC-CART-002：…」 | test_cart_display.py `test_all_products_displayed_as_spec` |
| TC-CART-003 | cart-order.spec.ts「TC-CART-003：…」 | test_cart_order.py `test_items_listed_in_added_order` |
| TC-CART-004 | cart-remove.spec.ts「TC-CART-004：…」 | test_cart_remove.py `test_remove_only_selected_item` |
| TC-CART-005 | cart-remove.spec.ts「TC-CART-005：…」 | test_cart_remove.py `test_remove_last_item` |
| TC-CART-006 | cart-navigation.spec.ts「TC-CART-006：…」（TC-CART-007 とデータを切り替える形） | test_cart_navigation.py `test_button_navigation[TC-CART-006]` |
| TC-CART-007 | cart-navigation.spec.ts「TC-CART-007：…」（TC-CART-006 とデータを切り替える形） | test_cart_navigation.py `test_button_navigation[TC-CART-007]` |
| TC-CART-008 | cart-navigation.spec.ts「TC-CART-008：…」 | test_cart_navigation.py `test_open_product_detail` |
| TC-CART-009 | cart-sync.spec.ts「TC-CART-009：…」 | test_cart_sync.py `test_remove_reflected_on_products_page` |
| TC-CART-010 | cart-persistence.spec.ts「TC-CART-010：…」 | test_cart_persistence.py `test_cart_kept_after_reload` |
| TC-CART-011 | cart-auth.spec.ts「TC-CART-011：…」 | test_cart_auth.py `test_redirect_to_login_when_not_logged_in` |
