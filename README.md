# Playwright 自動テストデモ（ECサイトE2Eテスト）

E2Eテストの設計・実装・CI運用までを一貫して構築した、自動テストアーキテクチャのポートフォリオです。

Playwright + TypeScript により構築した  
ECサイト向けE2E自動テストポートフォリオです。

ログイン / カート / Checkout(購入) / ログアウト を対象に、保守性・拡張性・CI運用まで意識して実装しています。

**総テスト数：30件 / GitHub ActionsによるCI自動実行対応**

- ログイン機能
- カート機能
- Checkout（購入）機能
- ログアウト機能

また、保守性と運用性を意識し、以下の構成を採用しています。

- Page Object Model（POM）
- fixtureによるログイン共通化
- Data-driven testing
- GitHub Actions による CI 自動実行

---

## 使用技術

- Playwright
- TypeScript
- Node.js
- GitHub Actions
- Page Object Model
- Flow Layer Architecture
- Fixture / storageState
- Data-driven testing

---

## テスト対象

**SauceDemo（テスト用デモサイト）**  
https://www.saucedemo.com/

---

## テスト設計方針（重要）

本プロジェクトでは、単なる機能テストではなく、  
E2E観点でのユーザー操作フローの再現性と保守性を重視した設計としています。

---

### 設計思想

#### ① Page Object Model（POM）
画面操作を以下の単位で分離しています：

- InventoryPage：商品一覧操作
- CartPage：カート操作
- CheckoutPage：購入処理
- HeaderComponent：共通UI（バッジなど）

目的：
- UI変更時の修正影響を局所化
- テストコードの可読性向上
- 再利用性の確保

---

#### ② Fixtureによる認証状態の共通化

loginFixtureによりログイン状態を共有し、  
各テストでログイン処理を省略しています。

目的：
- テスト実行速度の改善
- 前処理の重複排除
- 本質的な検証ロジックに集中

---

### Flow Layer（業務フロー）

各Page Objectを組み合わせて、
業務単位の操作として再構成したテスト実行レイヤーです。

specからUI操作（セレクタ・DOM構造）を完全に排除し、
テストコードは「業務シナリオのみ」を記述する構造にしています。

Flow Layerの役割は以下の通りです：

- 業務シナリオの抽象化（login / cart / checkout / logout）
- Page Objectの統合制御
- UI詳細（セレクタ・DOM操作）の隠蔽
- テストコードの可読性向上
- 再利用可能な業務API化

---

## テストアーキテクチャ構造（3層モデル）

本プロジェクトは以下の3層構造でテストを設計しています。

### ■ Spec層（業務シナリオ層）
- テストケースの定義
- 業務フローの組み立て
- Flow Layerのみを呼び出す
- UI操作は一切記述しない

例：
- 「商品を購入できること」
- 「ログイン失敗時にエラーが出ること」

---

### ■ Flow層（業務API層）
- 業務単位の操作を提供
- Page Objectを組み合わせてフロー化
- UI詳細（セレクタ・DOM構造）を完全に隠蔽
- specからUI依存を排除

例：
- login()
- addItems()
- startCheckout()
- finishCheckout()

---

### ■ Page層（UI実装層）
- 画面単位の操作を定義
- セレクタ・DOM操作を集約
- UI変更時の影響をこの層に閉じ込める
- Flow / SpecにはUI詳細を漏らさない

例：
- LoginPage
- CartPage
- CheckoutPage
- InventoryPage

---

## テスト戦略（状態ベース設計）

本プロジェクトでは「操作ベース」ではなく  
状態変化ベースのテスト設計を採用しています。

---

### 例：カートテスト

商品追加 → カート件数増加  
商品削除 → カート件数減少  
全削除 → バッジ非表示  

---

このように「操作」ではなく  
状態遷移の正しさを検証しています。

---

#### ③ テスト観点の分離

テストは以下の観点で分類しています：

| 区分 | 内容 |
|------|------|
| Login | 認証成功・失敗パターン |
| Cart | 商品追加・削除・状態確認 |
| Checkout | 購入成功・入力エラー・キャンセル |
| Logout | セッション終了 |

---

## 実装したテスト内容

本プロジェクトではE2E観点に基づき、以下のテスト構成を実装しています。

- Login：6件（認証成功 / 失敗パターン）
- Cart：8件（商品操作 / 状態変化 / バッジ検証）
- Checkout：15件（購入フロー / 入力バリデーション / キャンセル）
- Logout：1件（セッション終了）

合計：30件

---

各機能は状態変化ベースの設計により、UI操作の正確性とフローの整合性を検証しています。

---

## ■ テスト詳細仕様（設計補足）

各機能の詳細なテスト設計（観点・シナリオ・状態遷移）はGitHub Wikiに分離しています。

詳細設計（GitHub Wiki）
https://github.com/Infinity941020/playwright-demo/wiki

- Login：認証フロー設計
- Cart：状態変化およびバッジ検証
- Checkout：E2E購入フロー設計
- Logout：セッション終了フロー

---

## Fixture対応（ログイン共通化）

本プロジェクトでは、
ログイン状態共通化のために fixture と storageState を併用しています。

### 対応内容

- loginFixture.ts によるログイン済みPage配布
- loggedPage の型安全な共通利用
- setup/auth.setup.ts による認証状態保存
- storageState（auth.json）対応
- 前処理重複排除
- Cart / Checkout / Logoutテスト高速化
- テストコード可読性向上
- UIテスト保守性向上

---

## Data-driven testing対応

繰り返しパターンの多いCheckoutテストでは、
テストケース配列を利用したdata-driven形式を採用しています。

また、購入者情報は checkoutData.ts に共通化し、
入力データ管理を分離しています。

### 対応内容

- テストケース配列によるパターン管理
- for ... of によるテスト生成
- checkoutData.ts による入力データ共通化
- ケース追加時の修正影響最小化

---

## フォルダ構成

```text
pages/
 ├ LoginPage.ts
 ├ InventoryPage.ts
 ├ CartPage.ts
 ├ HeaderComponent.ts
 ├ MenuPage.ts
 └ CheckoutPage.ts

flows/
 ├ LoginFlow.ts
 ├ CartFlow.ts
 ├ CheckoutFlow.ts
 └ LogoutFlow.ts

tests/
 ├ setup/
 │   └ auth.setup.ts
 │
 ├ login/
 │   ├ login-success.spec.ts
 │   └ login-failure.spec.ts
 │
 ├ cart/
 │   ├ cart.spec.ts
 │   └ cart-badge.spec.ts
 │
 ├ checkout/
 │   ├ checkout-success.spec.ts
 │   ├ checkout-failure.spec.ts
 │   └ checkout-cancel.spec.ts
 │
 └ logout/
     └ logout.spec.ts

fixtures/
 └ loginFixture.ts

utils/
 ├ loginHelper.ts
 └ urls.ts

data/
 ├ users.ts
 └ checkoutData.ts

```

## 実行方法

### 全テスト実行

```bash
npx playwright test

```

### UIモード

```bash
npx playwright test --ui

```

### 特定ファイル実行

```bash
npx playwright test tests/checkout/checkout-success.spec.ts

```

### setupのみ実行

```bash
npx playwright test tests/setup/auth.setup.ts

```

### Checkoutのみ実行

```bash
npx playwright test tests/checkout --reporter=list

```

### cartのみ実行

```bash
npx playwright test tests/cart --reporter=list

```

## CI（GitHub Actions）

mainブランチへのpush / Pull Request時に  
自動で全テストを実行し、品質確認を継続的に行える構成です。

---

### 実行タイミング

- mainブランチへのpush
- Pull Request作成時

---

### 自動実行内容

- Node.jsセットアップ
- 依存関係インストール
- Playwrightブラウザセットアップ
- 全テスト実行

---

## Checkout設計思想

Checkoutは以下3段階で構成されています：

① 商品選択（Inventory）  
② 情報入力（Checkout Form）  
③ 確認・完了（Complete）

---

### テスト分類

- 正常系：購入完了までのフロー
- 異常系：入力バリデーション
- キャンセル系：途中離脱動作

---

## プロジェクトの強み

本プロジェクトは以下を重視しています：

- E2Eテスト設計（実務レベル）
- Page Object Model設計
- Fixtureによる認証最適化
- CI/CD連携（GitHub Actions）
- テスト観点整理（正常/異常/状態遷移）
- UIテストの保守性（POM設計）
- テスト実行速度（fixture化）
- 状態ベースの検証設計
- Flow層導入による操作シナリオの再利用性向上

---

## 最近の改善実績

- Checkout / Logout機能のFlow化
- CI安定化対応
- E2Eテスト全30件の安定動作

---

## 改善予定

- テストデータの外部化（JSON化）
- APIテスト追加
- Visual Regressionテスト導入
- Page Objectのさらなる分割最適化
- レポート自動通知（Slack / Teams）

---

## 作成者

テスト自動化学習・実務活用を目的とした個人ポートフォリオ