# Playwright 自動テストデモ（ECサイトE2Eテスト）

Playwright + TypeScript により構築した  
ECサイト向けE2E自動テストポートフォリオです。

ログイン / カート / 購入フローを対象に、保守性・CI運用まで意識して実装しています。

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

### 採用設計思想

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

### 実装テスト概要（全30件）

- Login：6件（正常系 / 異常系）
- Cart：8件（追加・削除・状態変化）
- Checkout：15件（正常系 / 異常系 / キャンセル系）
- Logout：1件

---

## Fixture対応（ログイン共通化）

ログイン済み状態（auth.json）を事前生成し、  
各E2Eテストではログイン処理を省略して実行できる構成にしています。

### 対応内容

- setupテストでログイン状態保存
- storageState による認証状態再利用
- カート / Checkout / ログアウト系テスト高速化
- テストコードの責務分離
- Checkoutテストでもログイン状態を再利用
- テスト実行の高速化（毎回ログイン不要）
- UIテストの安定化

---

## Data-driven testing対応

繰り返しパターンの多いCheckoutテストでは、  
テストデータを外部ファイル化し、保守性を向上させています。

### 対応内容

- checkoutData.ts に購入パターン定義
- forEach によるテスト生成
- ケース追加時のコード修正最小化

---

## フォルダ構成

```text
pages/
 ├ LoginPage.ts
 ├ InventoryPage.ts
 ├ CartPage.ts
 ├ HeaderComponent.ts
 └ CheckoutPage.ts

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

---

## 最近の改善実績

- README改善
- CI安定化対応
- ローカル動画証跡 / CI失敗時証跡対応

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