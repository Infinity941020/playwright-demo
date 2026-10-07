# UPDATE LOG（Python版）
---
## 2026-10-07

### ■ Before

- Stage 0（Login パイロット）の成果物は完成していたが、未コミットのまま残っていた
- TS版との設計差異のうち、API層に関わる論点（論点5-b の一部、論点6・9）と、
  プロジェクト全体の方針に関わる論点（論点7・8）は判断を保留していた
- 依存パッケージ（requirements.txt）はバージョンが固定されていなかった
- Login画面のテストケースは確定していたが、ファイルとしては管理されていなかった
- Products画面・Cart画面は未着手だった

---

### ■ Action（実施内容）

## ■ Stage 0 の手直し

---

### ■ Stage 0 成果物のコミット

未コミットだった Stage 0 の成果物を、役割ごとに分けてコミット。

対象：

- CLAUDE.md（Claude Code への指示）
- python/decisions.md（移植方針の決定ログ）
- python/ 配下のコード一式（Login パイロット）

確認結果：

- コミット前に全8件のPassを確認
- .venv/・.auth/（ログイン状態の保存ファイル）等は .gitignore で除外されていることを確認

---

### ■ CLAUDE.md への運用ルール追加

以下のセクションを CLAUDE.md に追加。

- APIテストの通信方針：外部の実API（ReqRes等）には接続せず、localhost＋モックによる構成を踏襲する
- 実装依頼時の運用ルール（テストケースとの照合）：実装前にテストケース一覧を参照し、
  実装後にテストケースIDとテスト関数を対応させた「突合表」を作成する

---

### ■ 依存パッケージの更新と固定

依存パッケージを最新版に上げたうえで、バージョンを固定（論点14）。

| パッケージ | 更新前 | 更新後 |
|---|---|---|
| playwright | 1.61.0 | 1.63.0 |
| pytest-playwright | 0.8.0 | 0.9.0 |
| pytest | 9.1.1（requirements.txt に記載なし） | 9.1.1（requirements.txt に追加して固定） |

確認結果：

- 更新後に Stage 0 の全8件がPassすることを確認してから固定

---

### ■ goto() と logged_page の見直し

- LoginPage.goto() を「移動のみ」に変更し、表示確認は LoginFlow 側で expect_on_login_page() を呼ぶ形に統一（論点13）
- logged_page を pytest-playwright の new_context fixture 経由で生成する形に変更し、
  --screenshot / --tracing / --video 等の設定が適用されるようにした（論点1 追記）

確認結果：

- logged_page を使うテストで、--tracing on 指定時にトレースファイルが生成されることを確認

---

## ■ Stage 1：Products・Cart 画面の移植

---

### ■ Products画面

実機確認をもとに仕様書・テストケースを作成し、実装。

- 仕様書：specs/products_spec.md
- テストケース：specs/products_testcases.md（14件）
- TS版ではカート機能の一部として扱われていた Products画面を、独立した画面として扱うことを決定（論点12）
- ソート・画面遷移・未ログイン時のアクセス制御など、TS版で未検証だった挙動も対象とした
- InventoryPage／HeaderComponent／InventoryFlow／inventory_assertions を新規作成

確認結果：

- 14件すべてPass
- 商品ID（6件）とロケータに使う data-test 属性は、実機で確認した値のみを使用

---

### ■ Login画面の突き合わせと修正

Login画面の仕様書・テストケースをファイル化し、実装と期待結果単位で突き合わせを実施。

- 仕様書：specs/login_spec.md
- テストケース：specs/login_testcases.md（8件）

確認結果：

- TC-LOGIN-002〜007：エラー文言と「画面遷移しない」ことを確認していなかった
- TC-LOGIN-008（失敗後のユーザー名の入力値保持）が未実装だった
- 一覧にない補助テスト（logged_page fixture の動作確認）が1件あった

対応：

- TC-LOGIN-002〜007 にエラー文言・画面遷移なしの確認を追加
- TC-LOGIN-008 を新規実装（エラー表示を確認したうえで入力値を確認）
- parametrize の ids と docstring にテストケースIDを付与
- 補助テストはテストケースの件数に含めない旨を login_testcases.md に明記
- 使われなくなった検証メソッドを削除
- 突合を「関数が存在するか」ではなく「期待結果ごとにアサーションを対応させる」形で行うルールを
  CLAUDE.md に追加し、経緯を論点11 に追記

---

### ■ Cart画面

実機確認をもとに仕様書・テストケースを作成し、実装。

- 仕様書：specs/cart_spec.md
- テストケース：specs/cart_testcases.md（11件）
- 「追加した順」を確かめる TC-CART-003 以外は、ブラウザの保存領域（localStorage）への
  直接書き込みで前提状態を作ることを決定（論点15）
- 書き込み処理は CartPage.set_cart_contents の1か所にまとめた
- CartPage／CartFlow／cart_assertions を新規作成
- Products画面からカート画面への遷移確認を、CartPage.expect_on_page() に寄せた

確認結果：

- 11件すべてPass
- 全6商品をカートに入れた状態（バッジ「6」）と、各行の商品名・価格が Products画面と一致することを実機で確認
- 削除した行がページ内に見えない要素として残るため、それを数えないロケータを使用

---

### ■ ロケータ定義方式の統一

- Python版の全Page Objectで、ロケータを __init__ でまとめて定義する方式に統一することを決定（論点2 更新）
- 商品ごとに変わる部品は、商品名を受け取るメソッドで扱う

---

### ■ ドキュメント整備

- python/README.md を作成
- python/backlog.md を作成し、今後の作業候補を整理
- リポジトリ直下の README.md に Python版への案内を追加

---

### ■ Result（成果）

- Stage 0 の成果物をコミットし、移植方針の決定ログを管理対象とした
- 依存パッケージを最新版で固定し、実行環境の再現性を確保
- Products画面（14件）・Cart画面（11件）の移植を完了
- Login画面の確認漏れを期待結果単位の突合で発見・修正し、8件すべてをテストケースと対応させた
- 突合を期待結果単位で行うルールを定め、同種の漏れを防ぐ仕組みを整備
- テスト実行結果：34件すべてPass（30.83秒）
  - Login：9件（テストケース8件＋補助テスト1件）
  - Products：14件
  - Cart：11件

---

### ■ Overall Status

- Login：完了（8件＋補助テスト1件）
- Products：完了（14件）
- Cart：完了（11件）
- Checkout Step One：未着手
- Checkout Step Two：未着手
- Checkout Complete：未着手
- Logout：未着手
- APIテスト：未実装（通信方針のみ決定。モックの実装方式は API層の移植着手時に決定）
- Visual Regression：未実装（Stage 2-1 で扱う予定）
- CI組み込み：未実装

---

### ■ Conclusion

本対応では、Stage 0 の成果物をコミットして管理対象とし、依存パッケージの固定や
goto() の意味の統一など、Stage 0 の土台を見直したうえで、Products画面・Cart画面の
移植を実施した。

Products画面では、TS版でカート機能の一部として扱われていた画面を独立させ、
ソート・画面遷移・未ログイン時のアクセス制御まで検証範囲を広げた。Cart画面では、
前提状態を保存領域への直接書き込みで作ることで、Products画面の不具合の影響を
受けない独立したテストとした。

また、Login画面のテストケースをファイル化して期待結果単位で突き合わせたことで、
関数の有無だけでは見つからなかった確認漏れを発見・修正した。この経験をもとに、
突合を期待結果単位で行うルールを定めた。

---

## 2026-07-30

### ■ Before

- TS版（Playwright + TypeScript）はPhase30まで完了し、完成状態だった
- Python版への移植にあたり、TS版の設計（Page Object / Flow Layer / Fixture の責務分離）を
  踏襲しつつ、TS版との差異をどう扱うかの方針が決まっていなかった

---

### ■ Action（実施内容）

## ■ Stage 0：Login パイロット

---

### ■ TS版の解析と移植方針の決定

TS版のコード全体を解析し、設計上の不統一・不備を洗い出して、Python版での扱いを決定。

対象：

- storageState機構の配線（論点1）
- ロケータの定義方法（論点2）
- コンストラクタの書き方（論点3）
- Page Object 内の画面レベルの検証（論点4）
- モックのリセット処理・不要コード（論点5-a・5-b）
- 型定義・Lint/Format・tsconfig・スキーマ検証（論点6〜9）
- URL定義の参照（論点10）

確認結果：

- 「既存踏襲」と「理想形」を選ぶ際の判断基準（多数派優先、性能・保守性、Pythonイディオム優先、
  テストの独立性・再現性は最優先）と、コストが膨らむ場合に相談する安全弁を定めた
- API層・プロジェクト全体に関わる論点（論点5-b の一部、論点6〜9）は、該当フェーズまで判断を保留
- 決定内容は python/decisions.md に記録

---

### ■ Python版の土台作成

Login画面をパイロットとして、Python版の基本構成を作成。

- Page Object（LoginPage）／Flow（LoginFlow）／ui_assertions（login_assertions）の構成
- storage_state をセッション内で1回だけ生成し、logged_page fixture で再利用する仕組み（論点1）
- URL定義（utils/urls.py）、ユーザー情報（data/users.py）

---

### ■ Login画面のテスト実装

Login画面の正常系・異常系テストと、logged_page fixture の動作確認テストを実装。

確認結果：

- 確定していたテストケース（TC-LOGIN-005/006）の代わりに、除外を決定していたパターンが
  実装されていたことを発見し、テストケース一覧を明示的に渡す運用を決定（論点11）

---

### ■ Result（成果）

- Python版の基本構成（Page Object / Flow / Fixture / ui_assertions）を作成
- storage_state によるログイン状態の再利用を配線
- TS版との設計差異について、論点1〜11 の扱いを決定・記録
- テスト実行結果：8件すべてPass（9.61秒）
- ※ 当時の8件は、TC-LOGIN-008 を含まず、logged_page fixture の動作確認用の補助テストを含む件数だった（2026-10-07 の突き合わせで判明し、修正）

※ この時点の成果物は未コミットで、コミットは 2026-10-07 に実施した。

---

### ■ Overall Status

- Login：Stage 0（パイロット）完了
- Products：未着手
- Cart：未着手
- Checkout Step One：未着手
- Checkout Step Two：未着手
- Checkout Complete：未着手
- Logout：未着手
- APIテスト：未実装
- Visual Regression：未実装
- CI組み込み：未実装

---

### ■ Conclusion

本対応では、TS版の解析をもとに移植方針の判断基準と各論点の扱いを決め、
Login画面をパイロットとして Python版の土台を作成した。

TS版で実装されながら配線されていなかった storage_state を正式に配線するなど、
TS版の設計を踏襲しつつ、Python/pytest の慣習に沿った形で移植する方針を確立した。
また、テストケースとの照合漏れを通じて、実装時の運用ルールを定めた。
