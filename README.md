# Playwright 自動テストデモ（ECサイト自動化テスト）

このプロジェクトは、**Playwright + TypeScript** を使用した自動テストの学習・実践用プロジェクトです。  
SauceDemo（テスト用ECサイト）を対象に、ログイン機能・カート機能・Checkout（購入）機能・ログアウト機能などのE2Eテストを実装しています。

**Page Object Model（POM）** を採用し、保守性・再利用性を意識した設計にしています。  
さらに **Fixture によるログイン状態の共通化**、**data-drivenテスト設計**、**GitHub Actions による CI 自動実行** にも対応しています。

---

## 使用技術

- Playwright
- TypeScript
- Node.js
- Git / GitHub
- GitHub Actions（CI）
- Page Object Model（POM）
- Fixture（storageState）
- Data Driven Testing

---

## テスト対象

**SauceDemo（テスト用デモサイト）**  
https://www.saucedemo.com/

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
* Cart → Continue Shopping
* Checkout入力画面でCancel
* 一部入力後Cancel
* 全項目入力後Cancel
* Confirm画面でCancel

### 異常系
* First Name未入力
* Last Name未入力
* Postal Code未入力
* 全項目未入力

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
- checkoutテストでもログイン状態を再利用
- テスト実行の高速化（毎回ログイン不要）
- UIテストの安定化

---

## Data Driven対応

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

### checkoutのみ実行

```bash
npx playwright test tests/checkout --reporter=list

```

### cartのみ実行

```bash
npx playwright test tests/cart --reporter=list

```

## CI（GitHub Actions）

このプロジェクトは GitHub Actions により、push時に自動でテストが実行されます。

### 実行タイミング

* mainブランチへのpush
* Pull Request作成時

### 自動実行内容

* Node.js セットアップ
* 依存関係インストール
* Playwrightブラウザセットアップ
* setupテスト実行（auth.json生成）
* 全テスト実行

---

## 工夫した点

* Page Object Model により画面操作を分離
* 正常系 / 異常系 / キャンセル系で観点整理
* Checkout機能まで含めたE2Eシナリオ構築
* data-driven test による保守性向上
* Fixture導入によるログイン共通化
* 共通処理の utility 化
* GitHub Actions によるCI自動化
* GitHubでソース管理
* Checkoutフロー（正常・異常・キャンセル）を網羅
* Page Objectによる責務分離
* Component（Header）再利用設計
* テストの状態遷移（Cart → Checkout → Confirm）を再現

---

## 改善予定

* テストデータ外部化拡張（JSON / CSV）
* APIテスト追加
* Visual Regression Test追加
* 並列実行最適化
* レポート自動通知（Slack / Teams）

---

## ポートフォリオとしての位置付け

* Playwright実務レベル基礎理解
* テスト設計（正常系 / 異常系 / 状態遷移）
* Page Object設計
* Fixture運用
* data-driven test設計
* Git / GitHub運用
* CI/CDによる自動化
* E2Eテスト構築経験

---

## 作成者

自動テスト学習・ポートフォリオ用プロジェクト