# Playwright 自動テストデモ（ECサイトE2Eテスト）

Playwright + TypeScript によるECサイト向けE2E自動テストポートフォリオです。

ログイン / カート / Checkout(購入) / ログアウト を対象に、保守性・拡張性・CI運用まで意識して実装しています。
単体の画面操作ではなく、業務フロー・状態変化を軸に設計することで、UI変更に強く長期運用しやすいテスト構成を目指しています。

**UI E2E + API Testing 対応 / GitHub Actions による CI自動実行対応**

---

## プロジェクトの強み

- Checkout APIで発生した仕様ドリフト（`id`と`checkoutId`の不一致）を発見・修正した実例など、実運用で起こりうる問題への対応経験
- モックの仕組みそのものを検証対象とするMSW intercept確認テストの実装
- 業務フロー単位で整理されたテスト構造による高い可読性と保守性
- UI / API / Mock を分離した責務設計による安定したテスト実行
- CI（GitHub Actions）による継続的な品質担保と自動化

---

## テスト規模

- UIテスト：90件（30シナリオ × 3ブラウザ）
- APIテスト：19件
- Visual Regression：6件（UI回帰検知のためのスナップショット比較。機能検証とは異なる観点で運用）
- 合計：115件（すべてCI上で安定実行）

※最新の内訳は [GitHub Wiki Home](https://github.com/Infinity941020/playwright-demo/wiki) と同期しています。

---

## 使用技術

- Playwright / TypeScript / Node.js
- GitHub Actions（CI自動実行）
- Page Object Model + Flow Layer Architecture など、責務分離を軸としたアーキテクチャ
- Fixture / storageState
- Data-driven testing
- MSW（Mock Service Worker：APIモックレイヤー）

---

## テスト対象

**SauceDemo（テスト用デモサイト）**
<https://www.saucedemo.com/>

およびAPIテスト・状態制御検証用のMSW（Mock Service Worker）環境

---

## Python版（移植中）

本ポートフォリオを Playwright + Python（pytest）へ移植しています。
進捗・設計判断の記録は [python/README.md](python/README.md) を参照してください。

---

## 設計思想（概要）

状態変化を基準としたテスト設計と、UI / API責務分離を軸としたアーキテクチャ
（Page Object Model + Flow Layer など）を採用しています。

設計判断の背景・詳細は
[テスト設計方針（GitHub Wiki）](https://github.com/Infinity941020/playwright-demo/wiki/%E3%83%86%E3%82%B9%E3%83%88%E8%A8%AD%E8%A8%88%E6%96%B9%E9%87%9D%EF%BC%88%E8%A9%B3%E7%B4%B0%E8%A8%AD%E8%A8%88%EF%BC%89)
にまとめています。

API構成・MSW設計・フォルダ構成を含む全仕様一覧は
[GitHub Wiki トップ](https://github.com/Infinity941020/playwright-demo/wiki)
から辿れます。

---

## 動作環境

- Node.js 18 以上（CI環境：Node.js 20 / Ubuntu）
- npm（Node.js付属のもので可）
- OS：macOS / Linux / Windows（ローカル環境）

---

## セットアップ

初めての方へ:以下の手順でインストール後、「実行方法」のコマンドをそのまま
実行すれば動作確認できます。

```bash
npm install
npx playwright install
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

### UIテストのみ実行

```bash
npx playwright test tests/ui --reporter=list
```

### APIテストのみ実行

```bash
npx playwright test tests/api --reporter=list
```

### 特定ファイル実行（例：Checkout成功パターン）

```bash
npx playwright test tests/ui/checkout/checkout-success.spec.ts --reporter=list
```

---

## CI（GitHub Actions）

mainブランチへのpush / Pull Request時に、UI / API / Visual Regression の
3ジョブを自動実行し、継続的な品質確認を行っています。

実行結果はSlackへ自動通知されます。

CIの詳細設定（retry / worker制御 / キャッシュ戦略等）は
[CI設計（GitHub Wiki）](https://github.com/Infinity941020/playwright-demo/wiki/CI%E8%A8%AD%E8%A8%88%EF%BC%88GitHub-Actions%E3%80%80Playwright%E9%81%8B%E7%94%A8%EF%BC%89)
を参照してください。

---

## 作成者

テスト自動化の学習を通じて、実務に近い設計・運用を意識しながら作成した
Playwright E2Eテストポートフォリオです。

画面操作を記録するだけの自動化ではなく、保守性・責務分離・CI運用・API補助
検証まで含めて、長く運用できるテスト構成を目指しました。
今後もAPIテスト対象範囲の拡張やテストデータ管理の改善を続けていく予定です。