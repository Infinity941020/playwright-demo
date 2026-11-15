# APIテスト テストケース（初版・18件）

共通の前提：
- テストの開始時に、モックサーバーが 127.0.0.1 の空いているポートで起動している
- モックの状態（カートの中身、id の連番、Checkout の呼び出し回数）は、テストごとにリセットされている
- リクエストは Playwright の APIRequestContext で送る

対応する仕様書：api_spec.md

テストで使う値の注意：productId などに 0 を使わない（TS版のモックは 0 を「値がない」とみなす場合があるため。仕様書「判断できない挙動」参照）

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
  - id が数値である
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
■ 優先度：中

### TC-API-CART-004
■ テスト内容：quantity を省略すると、quantity が 1 になること
■ 操作：POST /api/cart に {"productId": 4} を送る
■ 期待結果：
  - ステータスが 201 である
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
  （補足：ほかのテストで追加した行が含まれないことで、テストごとにモックがリセットされていることも確かめる〈観点 I-01〉。
   ただし、このテストより前に別のテストで行が追加されていない場合は、リセットの確認にならない。
   テストの独立性は、モックサーバーをテストごとに新しく立ち上げる作りで保証し、このテストはその補助的な確認とする）
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
  - checkoutId が数値である
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
■ 優先度：中

---

## Logout API

### TC-API-LOGOUT-001
■ テスト内容：トークンがあり本文が空なら、ログアウトできること
■ 操作：Authorization ヘッダーに "Bearer mock-token" を付け、本文なしで POST /api/logout
■ 期待結果：
  - ステータスが 200 である
  - success が true である
■ 優先度：高

### TC-API-LOGOUT-002
■ テスト内容：トークンがないと、401 とエラーが返ること
■ 操作：Authorization ヘッダーなし、本文なしで POST /api/logout
■ 期待結果：
  - ステータスが 401 である
  - error が "unauthorized" である
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
| TC-API-CART-005 | C-04, I-01 | 高 | 個別実装 |
| TC-API-CART-006 | C-05 | 高 | 個別実装 |
| TC-API-CHECKOUT-001 | K-01 | 高 | 個別実装 |
| TC-API-CHECKOUT-002 | K-02 | 高 | Data-driven（002〜005共通化） |
| TC-API-CHECKOUT-003 | K-02 | 高 | Data-driven（002〜005共通化） |
| TC-API-CHECKOUT-004 | K-02 | 高 | Data-driven（002〜005共通化） |
| TC-API-CHECKOUT-005 | K-02 | 中 | Data-driven（002〜005共通化） |
| TC-API-LOGOUT-001 | O-01 | 高 | 個別実装 |
| TC-API-LOGOUT-002 | O-02 | 高 | 個別実装 |
| TC-API-LOGOUT-003 | O-03 | 中 | 個別実装 |

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| TS版の「MSW動作確認（Cart追加）」（cart-api.spec.ts:142） | 何も確かめていない（アサーションがない）テストのため |
| 仕様書「判断できない挙動」（存在しない id の削除、値が 0 の扱い、呼び出し回数の上限、checkoutId の値） | 意図された仕様か判断できないため |
| 外部の実APIとの通信 | Stage 3 で任意に扱う（backlog.md 参照） |

## ■ TS版テスト（tests/api/ 19件）との対応

| TS版のテスト | 対応するPython版のテストケース | 備考 |
|---|---|---|
| login-api ログイン成功 | TC-API-LOGIN-001 | Python版はトークンの値まで確認 |
| login-api ログイン失敗（不正認証） | TC-API-LOGIN-002 | Python版はエラー文言まで確認 |
| user-api 単一ユーザー情報を取得できること | TC-API-USER-001 | Python版は値まで確認 |
| user-api 存在しないユーザーID | TC-API-USER-002 | |
| cart-api Cart追加が成功すること | TC-API-CART-001 | Python版は送った値と一致することまで確認 |
| cart-api productId未指定で失敗すること | TC-API-CART-002 | Python版はエラー文言まで確認 |
| cart-api 空リクエストで失敗すること | TC-API-CART-002 | Python版はエラー文言まで確認。TS版は {} を送っている。Python版の TC-API-CART-003 は本文なし（TS版にはないケース） |
| cart-api quantity未指定でもデフォルト1で追加されること | TC-API-CART-004 | TS版は quantity > 0 のみ確認。Python版は 1 であることを確認 |
| cart-api Cart一覧を取得できること | TC-API-CART-005 | TS版は items が配列であることのみ確認。Python版は件数と中身まで確認 |
| cart-api Cart削除が成功すること | TC-API-CART-006 | TS版は削除後の一覧を確認していない。Python版は一覧からなくなることまで確認 |
| cart-api MSW動作確認（Cart追加） | 対象外 | 上記「対象外としたもの」参照 |
| checkout-api Checkoutが成功すること | TC-API-CHECKOUT-001 | Python版は success と、送った値と一致することまで確認 |
| checkout-api cartId・userId・totalPrice未指定（3件） | TC-API-CHECKOUT-002〜004 | Python版はエラー文言まで確認 |
| checkout-api 空リクエストパターン | TC-API-CHECKOUT-002〜004 | Python版はエラー文言まで確認。TS版は {} を送っている。Python版の TC-API-CHECKOUT-005 は本文なし（TS版にはないケース） |
| logout-api ログアウト成功、未認証、不正リクエスト（3件） | TC-API-LOGOUT-001〜003 | Python版はエラー文言まで確認 |
