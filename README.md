# Playwright 自動テストデモ（ECサイトE2Eテスト）

Playwright + TypeScript によるECサイト向けE2E自動テストポートフォリオです。

ログイン / カート / Checkout(購入) / ログアウト を対象に、保守性・拡張性・CI運用まで意識して実装しています。

**UI E2E + API Testing に対応 / GitHub ActionsによるCI自動実行対応**

---

## テスト設計概要

本プロジェクトでは、E2E観点に基づき「状態変化・業務フロー単位」でテストを設計しています。

---

### プロジェクト方針

本プロジェクトはE2E観点でのユーザー操作フロー再現性と保守性を重視したテスト設計を採用しています。

詳細な設計思想は後述の「テスト設計方針」に整理しています。

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
<https://www.saucedemo.com/>

および補助検証用API（MSW mock環境）

---

## GitHub Wiki

詳細設計・API仕様・テストアーキテクチャは
GitHub Wikiに整理しています。

<https://github.com/Infinity941020/playwright-demo/wiki>

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

本プロジェクトでは責務分離を重視し、
Spec / Flow / Page Object / Fixture / Assertions による構成を採用しています。

- Spec：業務シナリオ
- Flow：業務フロー制御
- Page Object：UI操作管理
- Fixture：共通前処理・状態管理
- Assertions：検証ロジック管理

詳細はGitHub Wikiを参照してください。

---

## テスト戦略（状態ベース設計）

本プロジェクトでは操作単位ではなく、
状態変化を基準としたテスト設計を採用しています。

例：

- 商品追加 → カート件数増加
- 商品削除 → カート件数減少
- 購入完了 → 完了画面表示
- ログアウト → 認証状態解除

ユーザー操作そのものではなく、
操作によって発生する状態遷移が正しいことを検証します。

詳細な設計思想・テスト観点はGitHub Wikiを参照してください。

---

### ■ テスト詳細仕様（設計補足）

各機能の詳細なテスト設計（観点・シナリオ・状態遷移）はGitHub Wikiに分離しています。

詳細設計（GitHub Wiki）：

<https://github.com/Infinity941020/playwright-demo/wiki>

- Login：認証フロー設計
- Cart：状態変化およびバッジ検証
- Checkout：E2E購入フロー設計
- Logout：セッション終了フロー

---

## テスト効率化設計

本プロジェクトでは Fixture / storageState および
Data-driven testing を利用し、
テスト保守性と実行効率を向上しています。

- 認証状態の再利用
- テストデータ管理の共通化
- 繰り返しケースの効率化
- 前処理の簡略化

詳細設計はGitHub Wikiを参照してください。

---

## APIテストアーキテクチャ（ハイブリッド構成）

本プロジェクトのAPIテストは以下の2層構造で設計されています。

---

### ■ ① 外部API層（ReqRes）

以下は実API（ReqRes）を直接利用しています。

- Login API
- User API

#### 目的
- 外部API連携の実通信検証
- APIレスポンス構造の実データ確認

---

### ■ ② Mock API層（MSW / localhost）

以下はMSWによりローカルでモック化しています。

- Cart API
- Checkout API
- Logout API

#### 目的
- 状態制御テスト（成功・失敗・異常系）
- CI環境での安定性確保
- エッジケース再現

---

### ■ MSWの役割

MSWは単なるモックではなく、テスト制御レイヤーとして機能します。

- APIレスポンス制御（成功/失敗/異常系）
- テスト用状態管理
- CI安定化
- 外部API依存の排除（Cart / Checkout領域）

---

## API実行レイヤー（apiHelper）

全APIリクエストは apiHelper.ts に集約しています。

#### 主な役割

- ReqRes API（外部API）実行
- MSW API（Mock API）実行
- HTTPリクエスト処理の共通化
- エンドポイント管理の一元化

#### 設計方針

apiHelperは業務ロジックを持たず、
HTTPリクエスト実行を統一するための共通レイヤーとして設計しています。

- API差異（ReqRes / MSW）を過度に隠蔽しない
- 実行処理のみを担当
- 業務フローはFixture側で制御

詳細設計はGitHub Wikiを参照してください。

---

## API Testing

本プロジェクトではUI E2Eテストに加えてAPIテストを実装しています。

対象API

- Login API
- Cart API
- Checkout API
- Logout API

主な検証内容

- HTTP Status Code
- レスポンス構造
- API Contract Validation
- Error Response Validation

また、MSW（Mock Service Worker）を利用し、
外部APIに依存しない安定したテスト構成を採用しています。

詳細はGitHub Wikiを参照してください。

---

## Visual Regression Testing（運用ルール）

Visual Regression TestingはCI（Ubuntu環境）を基準として実行しています。

- SnapshotはGitHub Actions（Ubuntu）で生成・管理
- ローカル（Windows）ではフォント差異により差分が発生する場合があります
- Visual差分の最終判定はCI結果（GitHub Actions）を採用します

対象画面

- Login（ログイン画面）
- Inventory（商品一覧画面）
- Cart（カート画面）
- Checkout Step One（購入情報入力画面）
- Checkout Step Two（購入確認画面）
- Checkout Complete（購入完了画面）

Visual Regression Testingでは、
レイアウト崩れや意図しないUI変更を検知し、
機能テストとは別観点で品質を担保しています。

詳細な運用ルールおよび設計方針はGitHub Wikiを参照してください。

---

## フォルダ構成

本プロジェクトは責務分離を前提に構成されています。

各ディレクトリの詳細設計はGitHub Wikiに記載しています。

```text
pages/     # Page Object（UI操作層）
flows/     # 業務フロー制御層
tests/     # UI / APIテストケース
fixtures/  # 共通前処理・状態管理
utils/     # helper / assertion / schema
mocks/     # MSW mock API
data/      # テストデータ
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

本プロジェクトではCIとローカルで実行設定を切り替え、
安定性とデバッグ効率のバランスを最適化しています。

CI環境では安定実行を重視し、
ローカル環境ではデバッグ効率を重視した設定を採用しています。

---

## プロジェクトの強み

本プロジェクトは、E2Eテストの保守性・安定性・拡張性を重視した設計となっています。

- 業務フロー単位で整理されたテスト構造による高い可読性と保守性
- UI / API / Mockを分離した責務設計による安定したテスト実行
- CI（GitHub Actions）による継続的な品質担保と自動化

---

## 継続改善

本プロジェクトでは実務運用を想定し、継続的な改善を前提とした設計・運用を行っています。

主に以下の観点で改善を継続しています。

- テストフロー（Flow）の責務整理と最適化
- 共通処理（Helper / Fixture）の分離と再利用性向上
- CIの安定性改善と実行時間最適化
- APIテストの拡張と検証精度向上
- MSWによるモック制御の改善
- データ駆動テストの最適化

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