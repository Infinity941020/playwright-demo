# Playwright 自動テストデモ（ログイン機能）

このプロジェクトは、Playwright + TypeScript を使用した自動テストの学習・実践用プロジェクトです。  
Page Object Model（POM）を採用し、保守性・再利用性を意識した設計にしています。

正常系・異常系テストを実装し、テスト観点の整理と網羅性を意識しています。  
さらに GitHub Actions による CI 自動実行にも対応しています。

---

## 使用技術

- Playwright
- TypeScript
- Node.js
- Git / GitHub
- GitHub Actions（CI）

---

## テスト対象

SauceDemo（テスト用デモサイト）  
https://www.saucedemo.com/

---

## 実装したテスト内容

### 正常系

- 正しいID / パスワードでログイン
- 商品一覧画面（inventory）への遷移確認

---

### 異常系（5パターン）

ログイン失敗ケースを網羅的に確認しています。

- パターン①：誤ったID / パスワード
- パターン②：ID未入力
- パターン③：パスワード未入力
- パターン④：ID / パスワード両方未入力
- パターン⑤：locked_out_user（ログイン不可ユーザー）

---

## フォルダ構成

pages/
 └ LoginPage.ts

tests/login/
 ├ Login-success.spec.ts
 └ Login-failure.spec.ts

---

## 実行方法

### テスト実行

npx playwright test

### UIモード

npx playwright test --ui

---

## CI（GitHub Actions）

このプロジェクトはGitHub Actionsにより、push時に自動でテストが実行されます。

### 実行タイミング

- mainブランチへのpush
- Pull Request作成時

### 自動実行内容

- 環境構築（Node.js）
- 依存関係インストール
- Playwrightブラウザセットアップ
- テスト実行

---

## 工夫した点

- Page Object Model（POM）を採用し画面操作を分離
- 正常系・異常系を分けてテスト設計
- 複数異常パターンで網羅性を確保
- UI Modeでブラウザ確認
- GitHubでバージョン管理
- CI導入により自動テスト化

---

## 改善予定

- 商品購入フロー追加
- テストデータ外部化（JSON / CSV）
- エッジケース追加
- E2Eシナリオ拡張

---

## ポートフォリオとしての位置付け

- Playwrightの基礎理解
- テスト設計（正常系・異常系）
- POM設計の実践
- Git / GitHub運用
- CI/CDによる自動化
- UI確認による品質担保

---

## 作成者

自動テスト学習用ポートフォリオとして作成
