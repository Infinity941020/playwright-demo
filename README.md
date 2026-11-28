# Playwright 自動テストデモ（ECサイトE2Eテスト）

Playwright + TypeScript によるECサイト向けE2E自動テストポートフォリオです。

ログイン / カート / Checkout(購入) / ログアウト を対象に、保守性・拡張性・CI運用まで意識して実装しています。
単体の画面操作ではなく、業務フロー・状態変化を軸に設計することで、UI変更に強く長期運用しやすいテスト構成を目指しています。

**UI E2E + API Testing 対応 / GitHub Actions による CI自動実行対応**

---

## プロジェクトの強み

- Checkout APIで発生した仕様ドリフト（`id`と`checkoutId`の不一致）を発見・修正した実例など、実運用で起こりうる問題への対応経験
- テストごとに 127.0.0.1 に立てるモックのサーバーで、テスト同士の状態が混ざらない APIテストの実装
- 業務フロー単位で整理されたテスト構造による高い可読性と保守性
- UI / API / Mock を分離した責務設計による安定したテスト実行
- CI（GitHub Actions）による継続的な品質担保と自動化

---

## テスト規模

- UIテスト：234件（78件 × 3ブラウザ〈Chromium・Firefox・WebKit〉。78件はテストケース77件と、ログイン状態を再利用する準備の動作を確かめるテスト1件）
- APIテスト：18件
- Visual Regression：6件（UI回帰検知のためのスナップショット比較。機能検証とは異なる観点で運用）
- 合計：258件（CI で実行。失敗したテストは最大2回まで再実行する）

---

## 使用技術

- Playwright / TypeScript / Node.js
- GitHub Actions（CI自動実行）
- Page Object Model + Flow Layer Architecture など、責務分離を軸としたアーキテクチャ
- Fixture / storageState
- Data-driven testing
- テストごとに 127.0.0.1 に立てる小さなモックのサーバー（APIテスト用）

---

## テスト対象

**SauceDemo（テスト用デモサイト）**
<https://www.saucedemo.com/>

およびAPIテスト・状態制御検証用の、テストごとに 127.0.0.1 に立てるモックのサーバー

---

## Python版

本ポートフォリオを Playwright + Python（pytest）へ移植し、全画面の移植と、
APIテスト・見た目の比較テスト・CI への組み込みまで完了しています。
詳細・設計判断の記録は [python/README.md](python/README.md) を参照してください。

---

## 設計思想（概要）

状態変化を基準としたテスト設計と、UI / API責務分離を軸としたアーキテクチャ
（Page Object Model + Flow Layer など）を採用しています。

設計判断の背景・詳細は
[テスト設計方針（GitHub Wiki）](https://github.com/Infinity941020/playwright-demo/wiki/%E3%83%86%E3%82%B9%E3%83%88%E8%A8%AD%E8%A8%88%E6%96%B9%E9%87%9D%EF%BC%88%E8%A9%B3%E7%B4%B0%E8%A8%AD%E8%A8%88%EF%BC%89)
にまとめています。

API構成・モックの設計・フォルダ構成を含む全仕様一覧は
[GitHub Wiki トップ](https://github.com/Infinity941020/playwright-demo/wiki)
から辿れます。

---

## 動作環境

- Node.js 22 以上（CI環境：Node.js 22 / Ubuntu）
- npm（Node.js付属のもので可）
- OS：macOS / Linux / Windows（ローカル環境）

---

## セットアップ

初めての方へ:以下の手順でインストール後、「実行方法」のコマンドをそのまま
実行すれば動作確認できます。

TS版のファイルは typescript/ にあります。テストデータ（ログインユーザー・商品・購入者情報・URL・エラーの文言・APIテストのモックが返す値）は、Python版と共通の shared/data/ にあります。リポジトリ直下から次のように実行します。

```bash
cd typescript
npm install
npx playwright install
```

## 実行方法

typescript/ ディレクトリで実行します（セットアップの `cd typescript` の後）。

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

### 特定ファイル実行（例：Checkout Complete画面の表示）

```bash
npx playwright test tests/ui/checkout/checkout-complete-display.spec.ts --reporter=list
```

---

## CI（GitHub Actions）

mainブランチへのpush / Pull Request時に、TS版の4ジョブ（UI / API / Visual Regression / 型の確認）と
Python版の3ジョブ（UI / API / Visual Regression）の計7ジョブを自動実行し、継続的な品質確認を行っています。

実行結果はSlackへ自動通知されます（通知も1つのジョブとして動きます）。

Python版の CI の詳細は [python/README.md の「CI」](python/README.md#ci) を参照してください。

CIの詳細設定（retry / worker制御 / キャッシュ戦略等）は
[CI設計（GitHub Wiki）](https://github.com/Infinity941020/playwright-demo/wiki/CI%E8%A8%AD%E8%A8%88%EF%BC%88GitHub-Actions%E3%80%80Playwright%E9%81%8B%E7%94%A8%EF%BC%89)
を参照してください。

---

## 基準画像の撮り直し

見た目の比較（Visual Regression）の基準画像は、両版で共通の1組を、リポジトリ直下の shared/visual/ に置いています。
実行する環境によって描画が少しずつ違うため、基準画像には CI（Linux）で撮ったものだけを使います。
画面の下の帯の著作権の文（年を含む）は、年が変わるたびに画像が変わるのを避けるため、塗りつぶして撮ります。

### 撮り直すとき

- 画面が変わって、見た目の比較のテストが落ちたとき：失敗したときの差分の画像を見て、意図した変更か、
  テストの対象のサイト（SauceDemo）の側の変更だけなら撮り直します。表示崩れのときは撮り直しません
- Playwright の版を上げたとき
- 年が変わったとき（年の初めの見直し）

### 手順

1. GitHub の Actions の画面で、Visual Baselines（[.github/workflows/visual-baselines.yml](.github/workflows/visual-baselines.yml)）を手動で動かします。
   両版で撮り、2組が大きさと全画素まで同じかを比べます
2. 成功したら、Artifact の visual-baselines（6枚）をダウンロードし、shared/visual/ に置きます。
   失敗したときは、両版の画像が違います。ジョブの要約と、Artifact の visual-baselines-comparison の差分の画像で確かめます
3. プルリクエストで出し、GitHub の画像の差分の表示で、変わった所を確かめます

両版とも、手元でも撮れます（TS版：`npx playwright test --project=chromium-visual --update-snapshots=all`、
Python版：`pytest tests/visual -m visual --update-snapshots`）。ただし描画が CI と違うため、手元で撮った画像は基準画像にしません。
詳しくは [visual_spec.md](specs/visual_spec.md) の「基準画像の作り方・作り直し方」を参照してください。

---

## 作成者

テスト自動化の学習を通じて、実務に近い設計・運用を意識しながら作成した
Playwright E2Eテストポートフォリオです。

画面操作を記録するだけの自動化ではなく、保守性・責務分離・CI運用・API補助
検証まで含めて、長く運用できるテスト構成を目指しました。
今後もAPIテスト対象範囲の拡張やテストデータ管理の改善を続けていく予定です。