# APIテスト テストケース

共通の前提：
- テストの開始時に、モックサーバーが 127.0.0.1 の空いているポートで起動している
- モックの状態（カートの中身、id の連番、Checkout の呼び出し回数）は、テストごとに新しいサーバーを立てるため、テストをまたがない
- リクエストは Playwright の APIRequestContext で送る
- 本文なしで送るテストケース（TC-API-CART-003・TC-API-CHECKOUT-005・TC-API-LOGOUT-001・TC-API-LOGOUT-002）は、
  返事だけでは {} を送った場合と区別できない。本文なしで送ることは、呼び出しの部品の作りに任せる（自動では確かめていない。手元で一度確かめた）

対応する仕様書：api_spec.md
対応するテスト：TS版は `typescript/tests/api/*-api.spec.ts`、Python版は `python/tests/api/test_*_api.py`
（両版とも同じ18件。下の「両版のテストとの対応」を参照）
実行するプロジェクト：TS版は chromium-api だけで実行する（API のテストはブラウザを開かない）

テストで使う値の注意：productId などに 0 を使わない（モックは 0 を「値がない」とみなすため。仕様書「判断できない挙動」参照）

テストIDの付け方：API ごとに「TC-API-LOGIN」「TC-API-USER」「TC-API-CART」「TC-API-CHECKOUT」「TC-API-LOGOUT」とする

---

## ■ テスト観点

| 観点ID | API | 観点 |
|---|---|---|
| L-01 | Login | 正しい認証情報でトークンが返ること |
| L-02 | Login | 誤った認証情報で 400 とエラーが返ること |
| U-01 | User | 存在するユーザーの情報が返ること |
| U-02 | User | 存在しないユーザーで 404 が返ること |
| C-01 | Cart | 追加すると、送った内容で行が作られること |
| C-02 | Cart | 必須項目がないと 400 とエラーが返ること |
| C-03 | Cart | quantity を省略すると 1 になること |
| C-04 | Cart | 一覧に、追加した行だけが返ること |
| C-05 | Cart | 削除すると、一覧からその行がなくなること |
| K-01 | Checkout | 正しい内容で購入すると、送った内容が返ること |
| K-02 | Checkout | 必須項目がないと 400 とエラーが返ること |
| O-01 | Logout | トークンがあり本文が空なら、ログアウトできること |
| O-02 | Logout | トークンがないと 401 が返ること |
| O-03 | Logout | 本文が空でないと 400 が返ること |
| I-01 | 共通 | テスト同士でモックの状態が混ざらないこと（モックサーバーをテストごとに新しく立ち上げる作りで保証する） |

---

## Login API

### TC-API-LOGIN-001
■ テスト内容：正しい認証情報でログインすると、トークンが返ること
■ 操作：POST /api/login に {"email": "test@example.com", "password": "password123"} を送る
■ 期待結果：
  - ステータスが 200 である
  - token が "mock-token" である
■ 優先度：高

### TC-API-LOGIN-002
■ テスト内容：誤った認証情報でログインすると、400 とエラーが返ること
■ 操作：POST /api/login に {"email": "invalid@test.com", "password": "wrong-password"} を送る
■ 期待結果：
  - ステータスが 400 である
  - error が "user not found" である
■ 優先度：高

---

## User API

### TC-API-USER-001
■ テスト内容：存在するユーザーの情報が返ること
■ 操作：GET /api/users/2
■ 期待結果：
  - ステータスが 200 である
  - data に id・email・first_name・last_name・avatar があり、値が仕様書の表と一致する
■ 優先度：高

### TC-API-USER-002
■ テスト内容：存在しないユーザーで 404 が返ること
■ 操作：GET /api/users/9999
■ 期待結果：
  - ステータスが 404 である
  - レスポンスが空のオブジェクト {} である
■ 優先度：中

---

## Cart API

### TC-API-CART-001
■ テスト内容：カートに追加すると、送った内容で行が作られること
■ 操作：POST /api/cart に {"productId": 4, "quantity": 2} を送る
■ 期待結果：
  - ステータスが 201 である
  - id が整数である
  - productId が 4、quantity が 2 である
■ 優先度：高

### TC-API-CART-002
■ テスト内容：productId がないと、400 とエラーが返ること
■ 操作：POST /api/cart に {"quantity": 1} を送る
■ 期待結果：
  - ステータスが 400 である
  - error が "invalid payload" である
■ 優先度：高

### TC-API-CART-003
■ テスト内容：リクエストの本文がないと、400 とエラーが返ること
■ 操作：POST /api/cart に本文なしで送る
■ 期待結果：
  - ステータスが 400 である
  - error が "invalid payload" である
  （補足：本文なしで送ることの確かめ方は、上の「共通の前提」を参照）
■ 優先度：中

### TC-API-CART-004
■ テスト内容：quantity を省略すると、quantity が 1 になること
■ 操作：POST /api/cart に {"productId": 4} を送る
■ 期待結果：
  - ステータスが 201 である
  - id が整数で、productId が 4 である
  - quantity が 1 である
■ 優先度：中

### TC-API-CART-005
■ テスト内容：一覧に、追加した行だけが返ること
■ 操作：
  1. POST /api/cart に {"productId": 4, "quantity": 1} を送る
  2. POST /api/cart に {"productId": 1, "quantity": 3} を送る
  3. GET /api/cart
■ 期待結果：
  - 手順3のステータスが 200 である
  - items が2件で、productId 4（quantity 1）と productId 1（quantity 3）の行である
  （補足：行の数も確かめるのは、追加していない行が一覧に混ざらないことを見るため。
   テスト同士の独立は、テストごとに新しいサーバーを立てる作りで保証する〈観点 I-01〉）
■ 優先度：高

### TC-API-CART-006
■ テスト内容：削除すると、一覧からその行がなくなること
■ 操作：
  1. POST /api/cart に {"productId": 4, "quantity": 1} を送る
  2. POST /api/cart に {"productId": 1, "quantity": 1} を送る
  3. 手順1で返った id を指定して DELETE /api/cart/{id}
  4. GET /api/cart
■ 期待結果：
  - 手順3のステータスが 200 で、success が true である
  - 手順4の items が1件で、productId 1 の行である
■ 優先度：高

---

## Checkout API

### TC-API-CHECKOUT-001
■ テスト内容：正しい内容で購入すると、送った内容が返ること
■ 操作：POST /api/checkout に {"cartId": 1, "userId": 2, "totalPrice": 3000} を送る
■ 期待結果：
  - ステータスが 201 である
  - success が true である
  - checkoutId が整数である
  - cartId が 1、userId が 2、totalPrice が 3000 である
■ 優先度：高

### TC-API-CHECKOUT-002
■ テスト内容：cartId がないと、400 とエラーが返ること
■ 操作：POST /api/checkout に {"userId": 2, "totalPrice": 3000} を送る
■ 期待結果：ステータスが 400 で、error が仕様書の文言である
■ 優先度：高

### TC-API-CHECKOUT-003
■ テスト内容：userId がないと、400 とエラーが返ること
■ 操作：POST /api/checkout に {"cartId": 1, "totalPrice": 3000} を送る
■ 期待結果：ステータスが 400 で、error が仕様書の文言である
■ 優先度：高

### TC-API-CHECKOUT-004
■ テスト内容：totalPrice がないと、400 とエラーが返ること
■ 操作：POST /api/checkout に {"cartId": 1, "userId": 2} を送る
■ 期待結果：ステータスが 400 で、error が仕様書の文言である
■ 優先度：高

### TC-API-CHECKOUT-005
■ テスト内容：リクエストの本文がないと、400 とエラーが返ること
■ 操作：POST /api/checkout に本文なしで送る
■ 期待結果：ステータスが 400 で、error が仕様書の文言である
  （補足：本文なしで送ることの確かめ方は、上の「共通の前提」を参照）
■ 優先度：中

---

## Logout API

### TC-API-LOGOUT-001
■ テスト内容：トークンがあり本文が空なら、ログアウトできること
■ 操作：Authorization ヘッダーに "Bearer mock-token" を付け、本文なしで POST /api/logout
■ 期待結果：
  - ステータスが 200 である
  - success が true である
  （補足：本文なしで送ることの確かめ方は、上の「共通の前提」を参照）
■ 優先度：高

### TC-API-LOGOUT-002
■ テスト内容：トークンがないと、401 とエラーが返ること
■ 操作：Authorization ヘッダーなし、本文なしで POST /api/logout
■ 期待結果：
  - ステータスが 401 である
  - error が "unauthorized" である
  （補足：本文なしで送ることの確かめ方は、上の「共通の前提」を参照）
■ 優先度：高

### TC-API-LOGOUT-003
■ テスト内容：本文が空でないと、400 とエラーが返ること
■ 操作：Authorization ヘッダーに "Bearer mock-token" を付け、本文 {"invalid": "data"} で POST /api/logout
■ 期待結果：
  - ステータスが 400 である
  - error が "invalid request" である
■ 優先度：中

---

## ■ サマリー表

| テストID | 観点 | 優先度 | 実装方針 |
|---|---|---|---|
| TC-API-LOGIN-001 | L-01 | 高 | 個別実装 |
| TC-API-LOGIN-002 | L-02 | 高 | 個別実装 |
| TC-API-USER-001 | U-01 | 高 | 個別実装 |
| TC-API-USER-002 | U-02 | 中 | 個別実装 |
| TC-API-CART-001 | C-01 | 高 | 個別実装 |
| TC-API-CART-002 | C-02 | 高 | Data-driven（002・003共通化） |
| TC-API-CART-003 | C-02 | 中 | Data-driven（002・003共通化） |
| TC-API-CART-004 | C-03 | 中 | 個別実装 |
| TC-API-CART-005 | C-04 | 高 | 個別実装 |
| TC-API-CART-006 | C-05 | 高 | 個別実装 |
| TC-API-CHECKOUT-001 | K-01 | 高 | 個別実装 |
| TC-API-CHECKOUT-002 | K-02 | 高 | Data-driven（002〜005共通化） |
| TC-API-CHECKOUT-003 | K-02 | 高 | Data-driven（002〜005共通化） |
| TC-API-CHECKOUT-004 | K-02 | 高 | Data-driven（002〜005共通化） |
| TC-API-CHECKOUT-005 | K-02 | 中 | Data-driven（002〜005共通化） |
| TC-API-LOGOUT-001 | O-01 | 高 | 個別実装 |
| TC-API-LOGOUT-002 | O-02 | 高 | 個別実装 |
| TC-API-LOGOUT-003 | O-03 | 中 | 個別実装 |

観点 I-01 は、テストではなく、テストごとに新しいサーバーを立てる作りで保証する（どのテストケースにも割り当てない）。

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| 返事を何も確かめないテスト、{} を送る「空リクエスト」のテスト | 返事を確かめないテストは、壊れても気づけないため。{} を送るテストは、TC-API-CART-002・TC-API-CHECKOUT-002〜004 と同じ分岐を通り、新しく確かめることがないため |
| 仕様書「判断できない挙動」（存在しない id の削除、値が 0 の扱い、呼び出し回数の上限、checkoutId の値） | 意図された仕様か判断できないため |
| 外部の実APIとの通信 | 外部の実際の API には接続しない（モックだけを使う） |

## ■ 両版のテストとの対応

両版とも、テストケースの18件を実装している。

| テストID | TS版（typescript/tests/api/） | Python版（python/tests/api/） |
|---|---|---|
| TC-API-LOGIN-001 | login-api.spec.ts「TC-API-LOGIN-001：…」 | test_login_api.py `test_login_success` |
| TC-API-LOGIN-002 | login-api.spec.ts「TC-API-LOGIN-002：…」 | test_login_api.py `test_login_failure` |
| TC-API-USER-001 | user-api.spec.ts「TC-API-USER-001：…」 | test_user_api.py `test_get_existing_user` |
| TC-API-USER-002 | user-api.spec.ts「TC-API-USER-002：…」 | test_user_api.py `test_get_missing_user` |
| TC-API-CART-001 | cart-api.spec.ts「TC-API-CART-001：…」 | test_cart_api.py `test_add_cart` |
| TC-API-CART-002 | cart-api.spec.ts「TC-API-CART-002：…」（TC-API-CART-003 とデータを切り替える形） | test_cart_api.py `test_add_cart_bad_request[TC-API-CART-002]` |
| TC-API-CART-003 | cart-api.spec.ts「TC-API-CART-003：…」（TC-API-CART-002 とデータを切り替える形） | test_cart_api.py `test_add_cart_bad_request[TC-API-CART-003]` |
| TC-API-CART-004 | cart-api.spec.ts「TC-API-CART-004：…」 | test_cart_api.py `test_add_cart_without_quantity` |
| TC-API-CART-005 | cart-api.spec.ts「TC-API-CART-005：…」 | test_cart_api.py `test_get_cart_list` |
| TC-API-CART-006 | cart-api.spec.ts「TC-API-CART-006：…」 | test_cart_api.py `test_delete_cart` |
| TC-API-CHECKOUT-001 | checkout-api.spec.ts「TC-API-CHECKOUT-001：…」 | test_checkout_api.py `test_checkout_success` |
| TC-API-CHECKOUT-002 | checkout-api.spec.ts「TC-API-CHECKOUT-002：…」（TC-API-CHECKOUT-003〜005 とデータを切り替える形） | test_checkout_api.py `test_checkout_bad_request[TC-API-CHECKOUT-002]` |
| TC-API-CHECKOUT-003 | checkout-api.spec.ts「TC-API-CHECKOUT-003：…」（同上） | test_checkout_api.py `test_checkout_bad_request[TC-API-CHECKOUT-003]` |
| TC-API-CHECKOUT-004 | checkout-api.spec.ts「TC-API-CHECKOUT-004：…」（同上） | test_checkout_api.py `test_checkout_bad_request[TC-API-CHECKOUT-004]` |
| TC-API-CHECKOUT-005 | checkout-api.spec.ts「TC-API-CHECKOUT-005：…」（同上） | test_checkout_api.py `test_checkout_bad_request[TC-API-CHECKOUT-005]` |
| TC-API-LOGOUT-001 | logout-api.spec.ts「TC-API-LOGOUT-001：…」 | test_logout_api.py `test_logout_success` |
| TC-API-LOGOUT-002 | logout-api.spec.ts「TC-API-LOGOUT-002：…」 | test_logout_api.py `test_logout_without_token` |
| TC-API-LOGOUT-003 | logout-api.spec.ts「TC-API-LOGOUT-003：…」 | test_logout_api.py `test_logout_with_body` |
