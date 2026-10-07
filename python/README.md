# Playwright 自動テストデモ（Python版）

Playwright + Python（pytest）によるECサイト向けE2E自動テストです。

リポジトリ直下の TypeScript 版ポートフォリオをもとに、Python へ移植しながら
「AIを活用したテスト設計・自動化」を学習するプロジェクトです。
TS版の設計（Page Object / Flow Layer / Fixture の責務分離）を踏襲しつつ、
TS版との差異について行った意思決定も記録しており、その比較・記録自体もポートフォリオの一部としています。

---

## テスト規模

- Login：8件＋補助テスト1件（[仕様書](specs/login_spec.md) ／ [テストケース](specs/login_testcases.md)）
- Products：14件（[仕様書](specs/products_spec.md) ／ [テストケース](specs/products_testcases.md)）
- Cart：11件（[仕様書](specs/cart_spec.md) ／ [テストケース](specs/cart_testcases.md)）
- 合計：34件（テストケース33件＋補助テスト1件）

※補助テストは、ログイン状態を再利用する fixture（logged_page）の動作確認用で、テストケースの件数には含めていません。
※最新の状況・作業履歴は [UPDATELOG.md](UPDATELOG.md) を参照してください。

---

## 使用技術

- Playwright / Python / pytest（pytest-playwright）
- Page Object Model + Flow Layer など、責務分離を軸としたアーキテクチャ（TS版を踏襲）
- Fixture / storage_state
- Data-driven testing（pytest.mark.parametrize。ids にテストケースIDを付与）

---

## テスト対象

**SauceDemo（テスト用デモサイト）**
<https://www.saucedemo.com/>

対象ユーザーは standard_user（ロック確認用の locked_out_user を含む）です。

---

## ディレクトリ構成

TS版の構成をミラーリングしています（`pages/`・`flows/`・`fixtures/`・`data/`・`utils/`・`tests/ui/`）。

```text
python/
├── conftest.py              # fixtureモジュールの登録
├── pytest.ini               # pytest設定（testpaths = tests）
├── requirements.txt         # 依存パッケージ（バージョン固定）
├── data/
│   ├── users.py             # ログインユーザー情報
│   └── products.py          # 商品情報（商品名・価格・商品ID）とソート選択肢
├── fixtures/
│   └── login_fixture.py     # storage_state の生成・再利用、logged_page
├── pages/                   # Page Object（要素取得・単体操作・画面レベルの検証）
│   ├── login_page.py
│   ├── inventory_page.py
│   ├── cart_page.py
│   └── header_component.py  # ヘッダー共通部品（カートアイコン・バッジ）
├── flows/                   # Flow（業務単位の操作と検証）
│   ├── login_flow.py
│   ├── inventory_flow.py
│   └── cart_flow.py
├── utils/
│   ├── urls.py              # URL定義（一元管理）
│   └── ui_assertions/       # Specから呼ぶ検証関数（Flow経由）
├── tests/
│   ├── setup/               # TS版の auth.setup.ts 相当（fixtureに統合したため空）
│   └── ui/
│       ├── login/
│       ├── inventory/       # Products画面
│       └── cart/
├── specs/                   # 画面ごとの仕様書・テストケース
├── decisions.md             # TS版との設計差異に関する意思決定の記録
└── backlog.md               # 今後の作業候補
```

---

## 設計の考え方（概要）

- **責務分離**：Spec → ui_assertions → Flow.expect_xxx() → Page Object.expect_xxx() の階層で検証を呼び出します。テストは ui_assertions を通して検証し、UIの詳細を直接扱いません（[論点4](decisions.md#論点4-page-object内に画面レベルの検証が同居)）
- **ログイン状態の再利用**：standard_user の storage_state をセッションごとに1回だけ生成し、logged_page fixture で各テストに渡します。ログイン状態を引き継がない確認（未ログイン時のアクセス）は、通常の page を使います（[論点1](decisions.md#論点1-storagestate機構が未配線)）
- **goto() と expect_on_page() の使い分け**：goto() は移動のみ、画面の表示確認は expect_on_xxx() で行います（[論点13](decisions.md#論点13-goto-と-expect_on_xxx-の使い分け)）
- **ロケータの定義**：`__init__` でまとめて定義し、商品ごとに変わる部品は商品名を受け取るメソッドで扱います（[論点2](decisions.md#論点2-ロケータのキャッシュ有無が不統一)）
- **カートの前提状態**：Cart画面のテストは、「追加した順」を確かめる TC-CART-003 を除き、ブラウザの保存領域（localStorage）への直接書き込みで前提状態を作ります。書き込み処理は1か所（CartPage.set_cart_contents）にまとめています（[論点15](decisions.md#論点15-cart画面テストの前提状態の作り方)）
- **URLの一元管理**：URL は原則として utils/urls.py から参照します（[論点10](decisions.md#論点10-utilsurlsts-の参照が徹底されていない)）

設計判断の背景・詳細は [decisions.md](decisions.md) にまとめています。

---

## TS版との主な違い

decisions.md で「TS逆輸入候補」を「あり」「検討」としている論点です。
TS版自体の修正は本プロジェクトのスコープ外としています。

| 論点 | Python版での扱い | TS逆輸入候補 |
|---|---|---|
| [論点1](decisions.md#論点1-storagestate機構が未配線) storageState機構が未配線 | storage_state を正式に配線し、ログイン状態を再利用 | あり |
| [論点2](decisions.md#論点2-ロケータのキャッシュ有無が不統一) ロケータのキャッシュ有無が不統一 | 全Page Objectで `__init__` にまとめて定義する方式に統一 | あり |
| [論点5-a](decisions.md#論点5-a-resetxxxmockが未呼び出しテスト独立性の問題) モックのリセットが未呼び出し | autouse fixture でリセットする方針（API層は未実装） | あり |
| [論点5-b](decisions.md#論点5-b-utilsloginhelperts-等のデッドコード) loginHelper.ts 等のデッドコード | loginHelper.ts 相当は移植しない | あり |
| [論点10](decisions.md#論点10-utilsurlsts-の参照が徹底されていない) URL参照が徹底されていない | 最初から utils/urls.py の参照を徹底 | あり |
| [論点12](decisions.md#論点12-products画面を独立した画面として扱う) Products画面を独立した画面として扱う | 仕様書・テストケースを独立させ、ソート・画面遷移・未ログイン時も検証 | 検討 |
| [論点13](decisions.md#論点13-goto-と-expect_on_xxx-の使い分け) goto() と expect_on_xxx() の使い分け | goto() は移動のみ、表示確認は expect_on_xxx() に統一 | あり |
| [論点15](decisions.md#論点15-cart画面テストの前提状態の作り方) Cart画面テストの前提状態の作り方 | TC-CART-003 以外は localStorage への直接書き込みで作る | 検討 |

---

## 未実装（予定）

TS版にあって、Python版ではまだ実装していないものです。

- APIテスト（モックの実装方式は、API層の移植着手時に決める。外部の実APIには接続しない方針。詳細は [CLAUDE.md](../CLAUDE.md)）
- 見た目の比較テスト（Visual Regression）
- CI（GitHub Actions）への組み込み

---

## 動作環境

- Python（動作確認環境：Python 3.14.4 / Windows）
- 依存パッケージ：playwright 1.63.0、pytest 9.1.1、pytest-playwright 0.9.0（[requirements.txt](requirements.txt) でバージョンを固定）

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

### 失敗時のトレースを残して実行

```bash
pytest --tracing retain-on-failure
```

---

## 関連ファイル

| ファイル | 内容 |
|---|---|
| [CLAUDE.md](../CLAUDE.md) | Claude Code への指示（移植方針・APIテストの通信方針・実装依頼時の運用ルール） |
| [decisions.md](decisions.md) | TS版との設計差異に関する意思決定の記録 |
| [backlog.md](backlog.md) | 今後の作業候補 |
| [UPDATELOG.md](UPDATELOG.md) | 作業履歴・最新の状況 |
| [specs/](specs/) | 画面ごとの仕様書・テストケース |
| [TS版 README](../README.md) | 移植元の TypeScript 版ポートフォリオ |
