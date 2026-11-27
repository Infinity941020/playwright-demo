# Playwright 自動テストデモ（Python版）

Playwright + Python（pytest）によるECサイト向けE2E自動テストです。

リポジトリ直下の TypeScript 版ポートフォリオをもとに、Python へ移植しながら
「AIを活用したテスト設計・自動化」を学習するプロジェクトです。
TS版の設計（Page Object / Flow Layer / Fixture の責務分離）を踏襲しつつ、
TS版との差異について行った意思決定も記録しており、その比較・記録自体もポートフォリオの一部としています。

---

## テスト規模

### 画面のテスト：78件（テストケース77件＋補助テスト1件）

- Login：8件＋補助テスト1件（[仕様書](../specs/login_spec.md) ／ [テストケース](../specs/login_testcases.md)）
- Products：14件（[仕様書](../specs/products_spec.md) ／ [テストケース](../specs/products_testcases.md)）
- Cart：11件（[仕様書](../specs/cart_spec.md) ／ [テストケース](../specs/cart_testcases.md)）
- Checkout Step One：13件（[仕様書](../specs/checkout_step_one_spec.md) ／ [テストケース](../specs/checkout_step_one_testcases.md)）
- Checkout Step Two：14件（[仕様書](../specs/checkout_step_two_spec.md) ／ [テストケース](../specs/checkout_step_two_testcases.md)）
- Checkout Complete：6件（[仕様書](../specs/checkout_complete_spec.md) ／ [テストケース](../specs/checkout_complete_testcases.md)）
- Logout：10件（[仕様書](../specs/logout_spec.md) ／ [テストケース](../specs/logout_testcases.md)）
- 通しの購入（商品の追加から購入完了まで）：1件（[テストケース](../specs/purchase_flow_testcases.md)）

### APIテスト：18件（[仕様書](../specs/api_spec.md) ／ [テストケース](../specs/api_testcases.md)）

- Login API：2件
- User API：2件
- Cart API：6件
- Checkout API：5件
- Logout API：3件

### 見た目の比較テスト：6件（[仕様書](../specs/visual_spec.md) ／ [テストケース](../specs/visual_testcases.md)）

- Login・Products・Cart・Checkout Step One・Checkout Step Two・Checkout Complete：各1件

※普段の pytest では実行せず、`pytest tests/visual -m visual` と明示したときだけ実行します。

### 合計：102件（テストケース101件＋補助テスト1件）

普段の pytest で実行するのは、見た目の比較テストを除く96件です。

※補助テストは、ログイン状態を再利用する fixture（logged_page）の動作確認用で、テストケースの件数には含めていません。
※最新の状況・作業履歴は、リポジトリ直下の [UPDATELOG.md](../UPDATELOG.md) を参照してください。

---

## 使用技術

- Playwright / Python / pytest（pytest-playwright）
- Page Object Model + Flow Layer など、責務分離を軸としたアーキテクチャ（TS版を踏襲）
- Fixture / storage_state
- Data-driven testing（pytest.mark.parametrize。ids にテストケースIDを付与）
- APIテスト：Playwright の APIRequestContext、Python標準ライブラリ（http.server）によるモックサーバー
- 見た目の比較：Pillow による画像比較（基準画像との違う画素の割合で判定）

---

## テスト対象

**SauceDemo（テスト用デモサイト）**
<https://www.saucedemo.com/>

対象ユーザーは standard_user（ロック確認用の locked_out_user を含む）です。

**モックAPI（APIテスト）**

APIテストは、テストごとにローカル（127.0.0.1）で立ち上げるモックAPIを対象とします。
外部の実APIには接続しません（[API仕様書](../specs/api_spec.md)）。

---

## ディレクトリ構成

TS版の構成をミラーリングしています（`pages/`・`flows/`・`fixtures/`・`data/`・`utils/`・`tests/ui/`）。

```text
python/
├── conftest.py              # fixtureモジュールの登録、APIの確認関数の assert の書き換えの登録
├── pytest.ini               # pytest設定（testpaths = tests）
├── requirements.txt         # 依存パッケージ（バージョン固定）
├── data/                    # users.py〜messages.py は shared/data/ の JSON を読み込んで渡す
│   ├── shared_data.py       # shared/data/ の JSON の読み込み（1か所にまとめる）
│   ├── users.py             # ログインユーザー情報
│   ├── products.py          # 商品情報（商品名・価格・商品ID）とソート選択肢
│   ├── checkout_data.py     # 購入者情報（Checkout画面の入力値）
│   ├── messages.py          # 画面に表示されるエラー文言
│   └── api/                 # APIテストで使う値（api_users.py・api_carts.py・api_checkout.py）
├── fixtures/
│   ├── login_fixture.py     # storage_state の生成・再利用、logged_page
│   └── api_fixture.py       # モックサーバーの起動・停止と APIRequestContext の準備（テストごと）
├── mocks/                   # APIテスト用のモックサーバー
│   ├── server.py            # 127.0.0.1 の空いているポートで起動・停止
│   ├── handler_types.py     # リクエスト・レスポンス・ハンドラーの型
│   ├── mock_data.py         # モックが返す値（shared/data/api_mock.json を読み込む）
│   └── handlers/            # API ごとの返事（login・user・cart・checkout・logout）
├── pages/                   # Page Object（要素取得・単体操作・画面レベルの検証）
│   ├── login_page.py
│   ├── inventory_page.py
│   ├── cart_page.py
│   ├── checkout_page.py
│   ├── menu_page.py         # サイドメニュー（開閉・Logout・All Items）
│   └── header_component.py  # ヘッダー共通部品（カートアイコン・バッジ）
├── flows/                   # Flow（業務単位の操作と検証）
│   ├── login_flow.py
│   ├── inventory_flow.py
│   ├── cart_flow.py
│   ├── checkout_flow.py
│   └── logout_flow.py
├── utils/
│   ├── urls.py              # URL定義（一元管理。shared/data/urls.json を読み込む）
│   ├── ui_assertions/       # Specから呼ぶ検証関数（Flow経由）
│   ├── api_helper.py        # API の呼び出し
│   ├── api_assertions/      # API ごとの確認関数
│   └── visual_assertions/   # 見た目の比較（撮影前の待ち・撮影・比較・失敗時の保存）
├── tests/
│   ├── setup/               # 使っていない（ログイン状態を作る処理は fixtures/login_fixture.py にまとめている）
│   ├── ui/
│   │   ├── login/
│   │   ├── inventory/       # Products画面
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── logout/          # Logout機能（左上のメニュー）
│   │   └── flow/            # 通しの購入（商品の追加から購入完了まで）
│   ├── api/                 # APIテスト（API ごとに1ファイル）
│   └── visual/              # 見た目の比較テスト（画面ごとに1ファイル）
│       └── __snapshots__/   # 基準画像（CI で撮影したもの）
├── README.md                # 本ファイル
├── UPDATELOG.md             # Python版の作業履歴（2026-11-16 まで。以降はリポジトリ直下の UPDATELOG.md）
└── decisions.md             # TS版との設計差異に関する意思決定の記録
```

仕様書・テストケース（画面ごと・API）は、リポジトリ直下の [specs/](../specs/) にあります（両版共通）。
テストデータ（ログインユーザー・商品・購入者情報・URL・エラー文言・APIテストのモックが返す値）は、リポジトリ直下の [shared/data/](../shared/data/) にあります（両版共通。APIテストで送る値は除く）。

---

## 設計の考え方（概要）

- **責務分離**：Spec → ui_assertions → Flow.expect_xxx() → Page Object.expect_xxx() の階層で検証を呼び出します。テストは ui_assertions を通して検証し、UIの詳細を直接扱いません（[論点4](decisions.md#論点4-page-object内に画面レベルの検証が同居)）
- **ログイン状態の再利用**：standard_user の storage_state をセッションごとに1回だけ生成し、logged_page fixture で各テストに渡します。ログイン状態を引き継がない確認（未ログイン時のアクセス）は、通常の page を使います（[論点1](decisions.md#論点1-storagestate機構が未配線)）
- **goto() と expect_on_page() の使い分け**：goto() は移動のみ、画面の表示確認は expect_on_xxx() で行います（[論点13](decisions.md#論点13-goto-と-expect_on_xxx-の使い分け)）
- **ロケータの定義**：`__init__` でまとめて定義し、商品ごとに変わる部品は商品名を受け取るメソッドで扱います（[論点2](decisions.md#論点2-ロケータのキャッシュ有無が不統一)）
- **カートの前提状態**：Cart・Checkout・Logout のテストは、カートに商品が入った状態を、ブラウザの保存領域（localStorage）への直接書き込みで作ります（画面での追加そのものを確かめる TC-CART-003・010 と、通しの購入のテストは、画面の操作で作ります）。書き込み処理は1か所（CartPage.set_cart_contents）にまとめています（[論点15](decisions.md#論点15-cart画面テストの前提状態の作り方)）
- **URLの一元管理**：URL は原則として utils/urls.py から参照します（[論点10](decisions.md#論点10-utilsurlsts-の参照が徹底されていない)）
- **テストデータの共通化**：ログインユーザー・商品・購入者情報・URL・エラー文言は、リポジトリ直下の shared/data/ の JSON に置き、TS版と共通で使います。data/ と utils/urls.py は JSON を読み込んで今までと同じ名前・同じ形で渡すだけなので、テスト側は変わりません。JSON の場所はファイルの場所から求めるため、実行する場所に左右されません（[論点24](decisions.md#論点24-テストデータの共通化)）
- **Checkout の Page Object**：ファイルは TS版と1対1で対応する checkout_page.py とし、クラスは画面ごとに分けています（CheckoutStepOnePage／CheckoutStepTwoPage／CheckoutCompletePage）（[論点16](decisions.md#論点16-checkout画面の-page-object-の構成)）
- **メニューの開閉の判定**：表示の有無ではなく aria-hidden 属性で判定します。URL で開いた直後は、閉じているメニューの項目も「表示されている」と判定されるためです（[論点17](decisions.md#論点17-メニューの開閉の判定方法)）
- **商品一覧画面の表示確認**：InventoryPage.expect_on_page() の1か所にまとめ、URL の完全一致と data-test で確認します。ログイン成功の確認や logged_page fixture もここを使います（[論点18](decisions.md#論点18-商品一覧画面の表示確認の置き場所)）
- **APIテストのモック**：テストごとに 127.0.0.1 の空いているポートでモックサーバーを立ち上げ、状態がテストをまたがないようにしています。返事は TS版のモックと同じにしています（[論点19](decisions.md#論点19-apiテストのモックの方式とファイルの置き場所)）
- **見た目の比較**：Python 用の Playwright には、TS版で使っている toHaveScreenshot に当たる機能がないため、Pillow で比較の仕組みを自作しています。基準画像は、実行環境による描画の違いを避けるため、CI（Linux）で撮影したものだけを使います（[論点21](decisions.md#論点21-visual-regression-の方式)）

設計判断の背景・詳細は [decisions.md](decisions.md) にまとめています。

---

## TS版との主な違い

decisions.md で「TS逆輸入候補」を「あり」「検討」とした論点です（今はすべて TS版に反映済み）。
TS版への横展開（TS版を Python版に揃える作業）で、TS版にも反映しました。

| 論点 | Python版での扱い | TS逆輸入候補 |
|---|---|---|
| [論点1](decisions.md#論点1-storagestate機構が未配線) storageState機構が未配線 | storage_state を正式に配線し、ログイン状態を再利用 | 反映済み（横展開2-2） |
| [論点2](decisions.md#論点2-ロケータのキャッシュ有無が不統一) ロケータのキャッシュ有無が不統一 | 全Page Objectで `__init__` にまとめて定義する方式に統一 | 反映済み（横展開2-3・2-4） |
| [論点5-a](decisions.md#論点5-a-resetxxxmockが未呼び出しテスト独立性の問題) モックのリセットが未呼び出し | テストごとにモックサーバーを立ち上げ、状態がテストをまたがないようにした（論点19） | 反映済み（横展開4-1） |
| [論点5-b](decisions.md#論点5-b-utilsloginhelperts-等のデッドコード) loginHelper.ts 等のデッドコード | loginHelper.ts 相当は移植しない | 反映済み（横展開2-5。API 関係は 4-1） |
| [論点10](decisions.md#論点10-utilsurlsts-の参照が徹底されていない) URL参照が徹底されていない | 最初から utils/urls.py の参照を徹底 | 反映済み（横展開2-3・2-4） |
| [論点12](decisions.md#論点12-products画面を独立した画面として扱う) Products画面を独立した画面として扱う | 仕様書・テストケースを独立させ、ソート・画面遷移・未ログイン時も検証 | 反映済み（横展開3） |
| [論点13](decisions.md#論点13-goto-と-expect_on_xxx-の使い分け) goto() と expect_on_xxx() の使い分け | goto() は移動のみ、表示確認は expect_on_xxx() に統一 | 反映済み（横展開2-3・2-4） |
| [論点15](decisions.md#論点15-cart画面テストの前提状態の作り方) Cart画面テストの前提状態の作り方 | TC-CART-003・010 と通しの購入のテスト以外は localStorage への直接書き込みで作る | 反映済み（横展開3） |
| [論点16](decisions.md#論点16-checkout画面の-page-object-の構成) Checkout画面の Page Object の構成 | ファイルは TS版と1対1で対応する checkout_page.py とし、クラスは画面ごとに分ける | 反映済み（横展開2-4） |
| [論点17](decisions.md#論点17-メニューの開閉の判定方法) メニューの開閉の判定方法 | 表示の有無ではなく aria-hidden 属性で判定する | 反映済み（横展開2-4） |
| [論点18](decisions.md#論点18-商品一覧画面の表示確認の置き場所) 商品一覧画面の表示確認の置き場所 | InventoryPage.expect_on_page() の1か所にまとめ、URL は完全一致、要素は data-test で確認する | 反映済み（横展開2-3・2-4） |
| [論点19](decisions.md#論点19-apiテストのモックの方式とファイルの置き場所) APIテストのモックの方式とファイルの置き場所 | 両版とも、テストごとに 127.0.0.1 の空いているポートでモックサーバーを立ち上げる。API専用のファイルは専用のフォルダにまとめる | 反映済み（横展開4-1） |
| [論点21](decisions.md#論点21-visual-regression-の方式) Visual Regression の方式 | 普段の pytest では実行せず明示したときだけ実行する、固定の待ちを使わない、前提状態は保存したログイン状態とカートの書き込みで作る（比較の仕組みは TS版が標準機能を使うため対象外） | 反映済み（横展開4-2。比較の仕組みは対象外） |

---

## 動作環境

- Python（動作確認環境：Python 3.14.4 / Windows）
- 依存パッケージ：pillow 13.0.0、playwright 1.63.0、pytest 9.1.1、pytest-playwright 0.9.0（[requirements.txt](requirements.txt) でバージョンを固定）

---

## セットアップ

リポジトリ直下で実行します。

### Windows

```powershell
cd python
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

### macOS / Linux

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

## 実行方法

venv を有効にした状態で、python/ ディレクトリで実行します（コマンドは Windows・macOS・Linux 共通です）。

### 全テスト実行

```bash
pytest
```

### 画面ごとに実行（例：Cart画面）

```bash
pytest tests/ui/cart -v
```

### APIテストだけ実行

```bash
pytest tests/api -v
```

### 見た目の比較テストだけ実行

```bash
pytest tests/visual -m visual
```

基準画像は CI（Linux）で撮影したものです。手元（Windows など）では描画の違いで失敗する場合があります。

### 失敗時のトレースを残して実行

```bash
pytest --tracing retain-on-failure
```

---

## CI

main へのプルリクエストと push のたびに、GitHub Actions（[.github/workflows/playwright.yml](../.github/workflows/playwright.yml)）で TS版のテストと一緒に実行されます。

- Python版のジョブは UI Tests (Python)・API Tests (Python)・Visual Tests (Python) の3つです（Python 3.14、Chromium）
- 失敗時は、画面のテストのトレースとスクリーンショット、見た目の比較テストの基準画像・今の画像・差分の画像を Artifact（7日間）で確認できます
- 結果は Slack に通知されます
- 基準画像の作り方・作り直し方は [visual_spec.md](../specs/visual_spec.md) の「基準画像の作り方・作り直し方」を参照してください

詳細は [論点20](decisions.md#論点20-ci-の構成)・[論点21](decisions.md#論点21-visual-regression-の方式) を参照してください。

---

## 関連ファイル

| ファイル | 内容 |
|---|---|
| [decisions.md](decisions.md) | TS版との設計差異に関する意思決定の記録 |
| [UPDATELOG.md](../UPDATELOG.md) | 作業履歴・最新の状況（Python版の2026-11-16 までの履歴は [python/UPDATELOG.md](UPDATELOG.md)） |
| [specs/](../specs/) | 画面ごと・APIの仕様書・テストケース（リポジトリ直下。両版共通） |
| [shared/data/](../shared/data/) | テストデータ（ログインユーザー・商品・購入者情報・URL・エラー文言・APIテストのモックが返す値）の JSON（リポジトリ直下。両版共通） |
| [TS版 README](../README.md) | 移植元の TypeScript 版ポートフォリオ |
