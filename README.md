# Playwright 自動テストデモ（ECサイト自動化テスト）

このプロジェクトは、Playwright + TypeScript を使用した自動テストの学習・実践用プロジェクトです。
SauceDemo（テスト用ECサイト）を対象に、ログイン機能・カート機能・ログアウト機能などのE2Eテストを実装しています。

Page Object Model（POM）を採用し、保守性・再利用性を意識した設計にしています。
さらに Fixture によるログイン状態の共通化、および GitHub Actions による CI 自動実行にも対応しています。

---

## 使用技術

* Playwright
* TypeScript
* Node.js
* Git / GitHub
* GitHub Actions（CI）
* Page Object Model（POM）
* Fixture（storageState）

---

## テスト対象

SauceDemo（テスト用デモサイト）
https://www.saucedemo.com/

---

## 実装したテスト内容

## ログイン正常系

* 正しいID / パスワードでログイン
* 商品一覧画面（inventory）への遷移確認

---

## ログイン異常系（5パターン）

ログイン失敗ケースを網羅的に確認しています。

* パターン①：誤ったID / パスワード
* パターン②：ID未入力
* パターン③：パスワード未入力
* パターン④：ID / パスワード両方未入力
* パターン⑤：locked_out_user（ログイン不可ユーザー）

---

## カート機能

* 商品1件追加
* 複数商品追加
* カート内商品確認
* 商品削除

---

## カートバッジ検証

* 1件追加時の件数表示確認
* 全件追加時の件数表示確認
* 1件削除時の件数表示確認
* 2件削除時の件数表示確認
* 全件削除時の非表示確認

---

## ログアウト機能

* ログイン済み状態からログアウトできること

---

## Fixture対応（ログイン共通化）

ログイン済み状態（auth.json）を事前生成し、
各E2Eテストではログイン処理を省略して実行できる構成にしています。

### 対応内容

* setupテストでログイン状態保存
* storageState による認証状態再利用
* カート / ログアウト系テスト高速化
* テストコードの責務分離

---

## フォルダ構成

```text
pages/
 ├ LoginPage.ts
 └ CartPage.ts

tests/
 ├ setup/
 │   └ auth.setup.ts
 │
 ├ login/
 │   ├ Login-success.spec.ts
 │   └ Login-failure.spec.ts
 │
 ├ cart/
 │   ├ cart.spec.ts
 │   └ cart-badge.spec.ts
 │
 └ logout/
     └ logout.spec.ts
```

---

## 実行方法

### 全テスト実行

```bash
npx playwright test
```

### UIモード

```bash
npx playwright test --ui
```

### setupのみ実行

```bash
npx playwright test tests/setup/auth.setup.ts
```

---

## CI（GitHub Actions）

このプロジェクトは GitHub Actions により、push時に自動でテストが実行されます。

### 実行タイミング

* mainブランチへのpush
* Pull Request作成時

### 自動実行内容

* Node.js セットアップ
* 依存関係インストール
* Playwrightブラウザセットアップ
* Fixture生成
* 全17件テスト実行

---

## 工夫した点

* Page Object Model により画面操作を分離
* 正常系 / 異常系で観点整理
* 複数異常パターンで網羅性確保
* Fixture導入によるログイン共通化
* テスト保守性向上
* GitHub Actions によるCI自動化
* GitHubでソース管理

---

## 改善予定

* 購入フロー（Checkout）追加
* テストデータ外部化（JSON / CSV）
* Page Object追加分割
* APIテスト追加
* Visual Test追加

---

## ポートフォリオとしての位置付け

* Playwright実務レベル基礎理解
* テスト設計（正常系 / 異常系 / 状態遷移）
* Page Object設計
* Fixture運用
* Git / GitHub運用
* CI/CDによる自動化
* E2Eテスト構築経験

---

## 作成者

自動テスト学習・ポートフォリオ用プロジェクト
