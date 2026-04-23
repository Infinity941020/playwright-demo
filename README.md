# Playwright 自動テストデモ（ECサイト自動化テスト）

このプロジェクトは、**Playwright + TypeScript** を使用した自動テストの学習・実践用プロジェクトです。  
SauceDemo（テスト用ECサイト）を対象に、ログイン機能・カート機能・Checkout（購入）機能・ログアウト機能などのE2Eテストを実装しています。

**Page Object Model（POM）** を採用し、保守性・再利用性を意識した設計にしています。  
さらに **Fixture によるログイン状態の共通化**、**Data-driven testingによるテスト設計**、**GitHub Actions による CI 自動実行** にも対応しています。

---

## 使用技術

- Playwright
- TypeScript
- Node.js
- Git / GitHub
- GitHub Actions（CI）
- Page Object Model（POM）
- Fixture（storageState）
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

## ログイン正常系

- 正しいID / パスワードでログイン
- 商品一覧画面（inventory）への遷移確認

---

## ログイン異常系（5パターン）

ログイン失敗ケースを網羅的に確認しています。

- パターン①：誤ったID / パスワード
- パターン②：ID未入力
- パターン③：パスワード未入力
- パターン④：ID / パスワード両方未入力
- パターン⑤：locked_out_user（ログイン不可ユーザー）

---

## カート機能

- 商品1件追加
- 複数商品追加
- カート内商品確認
- 商品削除

---

## カートバッジ検証

- 1件追加時の件数表示確認
- 全件追加時の件数表示確認
- 1件削除時の件数表示確認
- 2件削除時の件数表示確認
- 全件削除時の非表示確認

---

## Checkout機能（購入機能）

### 正常系
* 商品1件購入
* 複数商品購入
* 商品詳細から追加して購入
* カート確認後に購入
* 全件追加後に削除して購入
* 一覧へ戻り再追加して購入

### キャンセル系
* カート画面 → Continue Shopping（買い物を続ける）
* Checkout入力画面でCancel（キャンセル）
* 一部入力後にCancel（キャンセル）
* 全項目入力後にCancel（キャンセル）
* Confirm画面でCancel（キャンセル）

### 異常系
* First Name未入力（名未入力）
* Last Name未入力（姓未入力）
* Postal Code未入力（郵便番号未入力）
* 全項目未入力（入力なし）

---

## ログアウト機能

- ログイン済み状態からログアウトできること

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

## Data Driven対応

繰り返しパターンの多いCheckoutテストでは、  
テストデータを外部ファイル化し、保守性を向上させています。

### 対応内容

- CheckoutData.ts に購入パターン定義
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
 ├ Checkout/
 │   ├ Checkout-success.spec.ts
 │   ├ Checkout-failure.spec.ts
 │   └ Checkout-cancel.spec.ts
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
 └ CheckoutData.ts

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
npx playwright test tests/Checkout/Checkout-success.spec.ts

```

### setupのみ実行

```bash
npx playwright test tests/setup/auth.setup.ts

```

### Checkoutのみ実行

```bash
npx playwright test tests/Checkout --reporter=list

```

### cartのみ実行

```bash
npx playwright test tests/cart --reporter=list

```

## CI（GitHub Actions）

push時に自動で以下を実行：

- Node.jsセットアップ
- 依存関係インストール
- Playwright実行
- 全テスト検証

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

## このプロジェクトで意識した点

- UIテストの保守性（POM設計）
- テスト実行速度（fixture化）
- 状態ベースの検証設計
- 正常系・異常系の網羅性
- CIによる自動品質保証

---

## 改善予定

- テストデータの外部化（JSON化）
- APIテスト追加
- Visual Regressionテスト導入
- Page Objectのさらなる分割最適化
- レポート自動通知（Slack / Teams）

---

## ポートフォリオとしての価値

本プロジェクトは以下を含みます：

- E2Eテスト設計（実務レベル）
- Page Object Model設計
- Fixtureによる認証最適化
- CI/CD連携（GitHub Actions）
- テスト観点整理（正常/異常/状態遷移）

---

## 作成者

自動テスト学習・ポートフォリオ用プロジェクト