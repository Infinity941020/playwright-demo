# API仕様書：モックAPI（Login・User・Cart・Checkout・Logout）

## ■ 概要
Python版のAPIテストが通信する、モックAPIの仕様。
外部の実API（ReqRes等）には接続せず、テストの実行時に、テスト用の小さなモックサーバーを
自分のPC（127.0.0.1）の空いているポートで立ち上げて通信する（CLAUDE.md「APIテストの通信方針」）。

モックAPIの返事は、TS版のモック（mocks/handlers/ 配下の MSW ハンドラー）と同じにする。
TS版とPython版で返事がずれないよう、変更するときは両方を揃える。

| 項目 | 内容 |
|---|---|
| 接続先 | http://127.0.0.1:〈テスト開始時に決まるポート〉/api |
| 通信の方法 | Playwright の APIRequestContext（TS版と同じ） |
| モックの作り方 | Python標準ライブラリの HTTP サーバー。API ごとにファイルを分ける（TS版の mocks/handlers/ に対応） |
| モックの状態 | テストごとにリセットする（decisions.md 論点5-a） |
| ファイルの置き場所 | 画面のテストとは分け、API専用のものは専用のフォルダにまとめる（下の「■ ファイルの置き場所」参照） |

TS版との違い：TS版のモックは、テストを実行するプロセスの中で通信を横取りする方式（サーバーは立てない）。
Python版の Playwright では、この方式で APIRequestContext の通信を横取りできないことを実機で確認したため、
実際に小さなサーバーを立てる方式にする（2026-11-15 調査）。

本文なしのリクエスト：Python版のモックは、Cart・Checkout に本文なしで送られた場合、仕様の表のとおり
400 {"error": "invalid payload"} を返す。TS版のハンドラーは最初に本文を JSON として読むため、本文が空だと
読み取りエラーになり、400 を返す分岐に届かない（MSW の仕様から 500 になると考えられる。TS版での実行による
確認はしていない）。Python版は仕様書の意図（本文がなければ 400）に合わせた。

対応するTS版：tests/api/ 配下の5ファイル、mocks/handlers/ 配下の5ファイル

### ■ ファイルの置き場所

| 置き場所 | 中身 | 対応するTS版 |
|---|---|---|
| python/mocks/ | モックサーバー（server.py）と、API ごとの返事（handlers/ 配下） | mocks/ |
| python/fixtures/api_fixture.py | モックサーバーの起動と APIRequestContext の準備 | fixtures/apiFixture.ts |
| python/utils/api_helper.py | API の呼び出し | utils/apiHelper.ts |
| python/utils/api_assertions/ | API ごとの確認関数 | utils/apiAssertions/ |
| python/data/api/ | APIテストで使う値 | data/apiUsers.ts・apiCarts.ts・apiCheckout.ts（TS版は data/ の直下） |
| python/tests/api/ | APIテスト本体 | tests/api/ |

画面のテスト用のファイル（pages/、flows/、utils/ui_assertions/、data/ の直下、tests/ui/）とは混ぜない。

---

## ■ Login API

| 項目 | 内容 |
|---|---|
| メソッド・パス | POST /api/login |
| リクエスト | JSON：email、password |

| 条件 | ステータス | レスポンス |
|---|---|---|
| email が test@example.com、かつ password が password123 | 200 | {"token": "mock-token"} |
| 上記以外 | 400 | {"error": "user not found"} |

---

## ■ User API

| 項目 | 内容 |
|---|---|
| メソッド・パス | GET /api/users/{id} |

| 条件 | ステータス | レスポンス |
|---|---|---|
| id が 2 | 200 | {"data": {"id", "email", "first_name", "last_name", "avatar"}}（値は下の表） |
| 上記以外 | 404 | {}（空のオブジェクト） |

id が 2 のときの data の値（TS版の mocks/handlers/userHandlers.ts から転記（2026-11-15））：

| 項目 | 値 |
|---|---|
| id | 2 |
| email | janet.weaver@reqres.in |
| first_name | Janet |
| last_name | Weaver |
| avatar | https://reqres.in/img/faces/2-image.jpg |

---

## ■ Cart API

| 項目 | 内容 |
|---|---|
| メソッド・パス | GET /api/cart、POST /api/cart、DELETE /api/cart/{id} |
| リクエスト（POST） | JSON：productId（必須）、quantity（省略可） |

| 操作 | 条件 | ステータス | レスポンス |
|---|---|---|---|
| 一覧（GET） | ― | 200 | {"items": [カートの行の配列]} |
| 追加（POST） | リクエストの本文がない、または productId がない | 400 | {"error": "invalid payload"} |
| 追加（POST） | 上記以外 | 201 | {"id": 連番, "productId": 送った値, "quantity": 送った値（省略時は 1）}。カートに保存する |
| 削除（DELETE） | ― | 200 | {"success": true}。該当の id の行をカートから取り除く |

- カートの id は、追加するたびに1ずつ増える連番である
- カートの中身と id の連番は、テストごとにリセットする

---

## ■ Checkout API

| 項目 | 内容 |
|---|---|
| メソッド・パス | POST /api/checkout |
| リクエスト | JSON：cartId、userId、totalPrice（すべて必須） |

| 条件 | ステータス | レスポンス |
|---|---|---|
| リクエストの本文がない | 400 | {"error": "invalid payload"} |
| cartId・userId・totalPrice のいずれかがない | 400 | {"error": "invalid payload"} |
| 上記以外 | 201 | {"success": true, "checkoutId": 数値, "cartId": 送った値, "userId": 送った値, "totalPrice": 送った値} |

400 のときの error の文言は、2つの条件とも同じ（TS版の mocks/handlers/checkoutHandlers.ts から転記（2026-11-15））。

---

## ■ Logout API

| 項目 | 内容 |
|---|---|
| メソッド・パス | POST /api/logout |
| リクエスト | Authorization ヘッダー（トークン）。本文は空 |

| 条件 | ステータス | レスポンス |
|---|---|---|
| Authorization ヘッダーがない | 401 | {"error": "unauthorized"} |
| 本文が空でない | 400 | {"error": "invalid request"} |
| 上記以外 | 200 | {"success": true} |

---

## ■ TS版のモックにある、意図された仕様か判断できない挙動

TS版のモックと返事を揃えるため、Python版のモックも同じ動きにするが、テストの対象には含めない。

| 挙動 | 内容 |
|---|---|
| 存在しない id の削除 | Cart の DELETE で、存在しない id を指定しても 200 {"success": true} を返す |
| 値が 0 の扱い | Checkout で cartId・userId・totalPrice のいずれかが 0 の場合も「ない」とみなして 400 を返す |
| 呼び出し回数の上限 | Checkout は呼ばれるたびに回数を数え、1000回以上で 401 を返す（Python版はテストごとに回数をリセットする） |
| checkoutId の値 | 呼び出した時刻（ミリ秒）を checkoutId にしている |

---

## ■ 本仕様の対象外

| 項目 | 理由 |
|---|---|
| 外部の実API（ReqRes等）との通信 | CLAUDE.md の通信方針により接続しない（外部APIのテストは今後の拡張候補） |
| 上記「判断できない挙動」 | 意図された仕様か判断できないため |
| 画面（UI）からの API の呼び出し | SauceDemo の画面はこのモックAPIを使っていないため。APIテストは画面のテストとは独立している |
