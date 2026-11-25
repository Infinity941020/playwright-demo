# API仕様書：モックAPI（Login・User・Cart・Checkout・Logout）

## ■ 概要
両版（TS版・Python版）のAPIテストが通信する、モックAPIの仕様。
外部の実API（ReqRes等）には接続せず、テストごとに、テスト用の小さなモックサーバーを
自分のPC（127.0.0.1）の空いているポートで立ち上げて通信する（CLAUDE.md「APIテストの通信方針」）。

両版のモックは同じ作りで、テストが送る範囲のリクエストには同じ返事をする（両版で違う所は下の表）。返す値（正しい認証情報、トークン、ユーザーの値、
エラーの文言など）は、両版共通の shared/data/api_mock.json にまとめ、両版のモックがここから読む。
テストの期待値はこの JSON から読まず、テストケースと同じ値をテストに書く（モックの値の誤りにテストが気づけるようにするため）。
動きを変えるときは、両版のモックを揃えて直す。

| 項目 | 内容 |
|---|---|
| 接続先 | http://127.0.0.1:〈テスト開始時に決まるポート〉/api |
| 通信の方法 | Playwright の APIRequestContext |
| モックの作り方 | 各言語の標準の機能の HTTP サーバー（TS版は Node の http、Python版は Python標準ライブラリ）。API ごとにファイルを分ける |
| モックの状態 | テストごとに新しいサーバーを立て、ハンドラーも新しい状態で作るため、テストをまたがない（python/decisions.md 論点5-a・19） |
| 登録していないメソッド・パス | 404 {"error": "no mock handler"} を返す（外の通信には流さない） |
| GET・POST・DELETE 以外のメソッド（PUT など） | TS版は 404 {"error": "no mock handler"}、Python版は標準の部品が 501（JSON ではない返事）を返し、両版で違う（どのテストも送らない。Python版を見直すときに 404 にそろえる。python/decisions.md の論点19） |
| ハンドラーの中で起きた例外 | 500 {"error": "〈例外の名前〉: 〈例外の中身〉"} を返す（JSON として読めない本文など。中身の文は言語によって違う）。Logout は、読めない本文を本文なしとみなす（500 にならない） |
| テストが送らない入力 | UTF-8 でない本文、先頭の BOM、NaN・Infinity の書き方、とても大きな数、本文の長さを付けない分割送信、全角などの数字の id では、両版の返事が違うことがある |
| ファイルの置き場所 | 画面のテストとは分け、API専用のものは専用のフォルダにまとめる（下の「■ ファイルの置き場所」参照） |

本文なしのリクエスト：本文が空のときは「値がない」として扱う。Cart・Checkout に本文なしで送られた場合は、
仕様の表のとおり 400 {"error": "invalid payload"} を返す。

対応するTS版：tests/api/ 配下の5ファイル、mocks/handlers/ 配下の5ファイル

### ■ ファイルの置き場所

| 置き場所 | 中身 | 対応するTS版 |
|---|---|---|
| python/mocks/ | モックサーバー（server.py）、ハンドラーの形と値の判定（handler_types.py）、返す値の読み込み（mock_data.py）、API ごとの返事（handlers/ 配下） | mocks/（server.ts・handlerTypes.ts・mockData.ts・handlers/ 配下） |
| shared/data/api_mock.json | モックが返す値（両版共通） | 同じファイルを読む |
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

id が 2 のときの data の値（shared/data/api_mock.json の user.existing_user）：

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
- カートの中身と id の連番は、テストごとに新しく作るため、テストをまたがない
- TS版の Cart の一覧のテスト（Cart一覧を取得できること）は、何も追加していない空の一覧に対して確かめる形になっている。
  追加した後に一覧を確かめる形には、TS版のテストの中身を Python版にそろえるときに直す（python/decisions.md の論点19）

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

400 のときの error の文言は、2つの条件とも同じ（shared/data/api_mock.json の checkout.invalid_payload_error）。

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

## ■ モックにある、意図された仕様か判断できない挙動

両版のモックとも同じ動きにするが、テストの対象には含めない。

| 挙動 | 内容 |
|---|---|
| 存在しない id の削除 | Cart の DELETE で、存在しない id を指定しても 200 {"success": true} を返す |
| 値が 0 の扱い | Cart の productId、Checkout の cartId・userId・totalPrice のいずれかが 0 の場合も「ない」とみなして 400 を返す |
| 呼び出し回数の上限 | Checkout は呼ばれるたびに回数を数え、1000回以上で 401 を返す（回数はテストごとに 0 から数え直す） |
| checkoutId の値 | 呼び出した時刻（ミリ秒）を checkoutId にしている |

---

## ■ 本仕様の対象外

| 項目 | 理由 |
|---|---|
| 外部の実API（ReqRes等）との通信 | CLAUDE.md の通信方針により接続しない（外部APIのテストは Stage 3 で任意に扱う。backlog.md 参照） |
| 上記「判断できない挙動」 | 意図された仕様か判断できないため |
| 画面（UI）からの API の呼び出し | SauceDemo の画面はこのモックAPIを使っていないため。APIテストは画面のテストとは独立している |
