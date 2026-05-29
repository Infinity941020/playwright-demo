# Playwright 自動テストデモ（ECサイトE2Eテスト）

Playwright + TypeScript によるECサイト向けE2E自動テストポートフォリオです。

ログイン / カート / Checkout(購入) / ログアウト を対象に、保守性・拡張性・CI運用まで意識して実装しています。

**UI E2E + API Testing に対応 / GitHub ActionsによるCI自動実行対応**
---

## テスト設計概要

本プロジェクトでは、E2E観点に基づき「状態変化・業務フロー単位」でテストを設計しています。

---

### 合計件数について

本プロジェクトでは、
UI E2EテストおよびAPIテストを
業務シナリオ単位で実装しています。

テストケースは機能追加・改善に応じて継続的に拡張しています。

---

### プロジェクト方針

本プロジェクトはE2E観点でのユーザー操作フロー再現性と保守性を重視したテスト設計を採用しています。

詳細な設計思想は後述の「テスト設計方針」に整理しています。

---

### アーキテクチャ方針

保守性・拡張性・CI運用を考慮し、
Flow Layer / Page Object Model / Fixture / API Layer を組み合わせた構成を採用しています。

詳細な責務分離構成は後述の「テストアーキテクチャ構造」に整理しています。

- Page Object Model（POM）
- Fixtureによるログイン共通化
- Data-driven testing
- GitHub Actions による CI 自動実行

---

## 使用技術

- Playwright
- TypeScript
- Node.js
- GitHub Actions
- API Testing（APIRequestContext）
- Page Object Model
- Flow Layer Architecture
- Fixture / storageState
- Data-driven testing
- MSW（Mock Service Worker：APIモックレイヤー）

---

## テスト対象

**SauceDemo（テスト用デモサイト）**  
https://www.saucedemo.com/

および補助検証用API（MSW mock環境）

---

## GitHub Wiki

詳細設計・API仕様・テストアーキテクチャは
GitHub Wikiに整理しています。

https://github.com/Infinity941020/playwright-demo/wiki

---

## テスト設計方針

本プロジェクトでは、
E2E観点でのユーザー操作フロー再現性と
保守性を重視した設計を採用しています。

主な設計方針：

- Page Object Model（POM）
- Flow Layerによる業務フロー抽象化
- 状態ベーステスト設計
- UI / API責務分離
- Fixtureによる前処理共通化

詳細はGitHub Wikiを参照してください。

---

## テストアーキテクチャ

本プロジェクトでは、Spec / Flow / Page Object に責務分離した構成を採用しています。

- Spec：業務シナリオ
- Flow：業務フロー制御
- Page Object：UI操作管理

詳細はGitHub Wikiを参照してください。

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

### ■ テスト詳細仕様（設計補足）

各機能の詳細なテスト設計（観点・シナリオ・状態遷移）はGitHub Wikiに分離しています。

詳細設計（GitHub Wiki）：

https://github.com/Infinity941020/playwright-demo/wiki

- Login：認証フロー設計
- Cart：状態変化およびバッジ検証
- Checkout：E2E購入フロー設計
- Logout：セッション終了フロー

---

## テスト効率化設計

本プロジェクトでは、
Fixture・Data-driven testing を利用し、
テスト保守性と実行効率を向上しています。

- login状態の共通化
- テストデータ共通化
- 繰り返しケースの効率化
- setup処理の簡略化

詳細はGitHub Wikiを参照してください。

---

## API Testing

本プロジェクトではUI E2Eテストに加えて、
API Testing を実装しています。

- Login API
- Cart API
- Checkout API
- Logout API

APIテストでは以下を検証しています。

- HTTP status code
- request / response
- validation
- レスポンス構造整合性

また、MSW（Mock Service Worker）を利用し、
外部APIに依存しない安定したテスト構成を採用しています。

詳細はGitHub Wikiを参照してください。

---

## API Mock設計

本プロジェクトでは、MSW（Mock Service Worker）を利用して
APIテストをMock化しています。

- APIレスポンス制御
- HTTP契約検証
- 外部API依存排除
- CI安定化

詳細はGitHub Wikiを参照してください。

---

## フォルダ構成

```text
pages/ # Page Object
flows/ # 業務フロー
tests/ # UI / APIテスト
fixtures/ # 共通前処理
utils/ # helper / assertions / schema
mocks/ # MSW mock API
data/ # テストデータ
```

詳細はGitHub Wikiを参照してください。

---

### ディレクトリ責務

- pages/：UI操作実装層（Page Object）
- flows/：業務フロー抽象化層
- fixtures/：共通前処理・ログイン状態管理
- utils/：API制御・検証・schema・Helper管理層
- data/：テストデータ管理
- mocks/：MSW mock API管理層
- tests/：テストケース本体

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
npx playwright test tests/checkout/checkout-success.spec.ts --reporter=list

```

### Checkoutのみ実行

```bash
npx playwright test tests/checkout --reporter=list

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

## Playwright実行設定

本プロジェクトでは、
CI環境とローカル開発環境で
Playwright設定を切り替えています。

CIでは安定実行を重視し、
retry・worker制御・trace取得を最適化しています。

ローカル環境では、
デバッグ効率を重視した設定を採用しています。

設定例：

```ts
const isCI = !!process.env.CI;

retries: isCI ? 2 : 0
workers: isCI ? 2 : undefined
trace: isCI ? 'on-first-retry' : 'on'
```

---

## プロジェクトの強み

本プロジェクトは以下の特徴を持つE2E自動テスト構成です。

- 業務フロー単位で設計されたE2Eテスト（Flowレイヤー導入）
- Page Object + Fixtureによる高い保守性と再利用性
- 状態ベース設計による安定したE2E検証
- GitHub ActionsによるCI自動化で継続品質担保

---

## 継続改善

本プロジェクトでは、
実務運用を想定し継続的に改善を行っています。

- Flow責務整理
- Helper分離
- CI安定化
- APIテスト拡張
- MSW導入
- data-driven最適化

詳細な改善履歴は UPDATELOG を参照してください。

---

## 今後の拡張予定

- Visual Regression Testing
- APIテスト拡張
- テストデータ管理改善
- CI通知連携
- ブラウザ並列実行最適化

継続運用を前提として改善を続けています。

---

## 作成者

テスト自動化学習および実務レベルの設計・運用を意識して作成した
Playwright E2Eテストポートフォリオです。

単純なUI自動化ではなく、
保守性・責務分離・CI運用・API補助検証まで含めた
継続運用可能なテスト構成を目指して設計しています。