# UPDATE LOG（Python版）
---
## 2026-11-09

### ■ Before

- Login（8件＋補助テスト1件）・Products（14件）・Cart（11件）・Checkout Step One（13件）の移植は完了していた
- Checkout Step Two・Checkout Complete・Logout は未着手だった
- Checkout Step Two への遷移確認は、Step One の移植時に CheckoutStepOnePage へ暫定で置いたままだった
- Python版には、左上のメニューを扱うコードがなかった

---

### ■ Action（実施内容）

## ■ Stage 1：Checkout Step Two・Complete・Logout の移植

---

### ■ Checkout Step Two 画面

実機確認をもとに仕様書・テストケースを作成し、実装。

- 仕様書：specs/checkout_step_two_spec.md
- テストケース：specs/checkout_step_two_testcases.md（14件）
- 小計・税・合計を、実機で確認した固定値で確認した（商品1件・2件・全6件）
- 税率8%は商品の組み合わせ63通りで確認し、端数処理の方式（四捨五入か切り上げか）は、
  画面操作で作れる状態では区別できないため規定しなかった
- 前提状態は Step One を経由して作る（Step Two を直接開けることは判断できない挙動のため、依存しない）
- TS版ではコードで確認していなかった Step Two の表示・金額、購入後にカートが空になること、
  Cancel でカートが変わらないことを確認した
- CheckoutStepTwoPage を新規作成し、CheckoutFlow／checkout_assertions に追加

判断できない挙動6件は、仕様書に事実として記録し、テストの対象外とした。

- 小計の桁あふれ（例：Item total: $59.980000000000004）
- Step One を経由せずに購入まで完了できる
- カートが空で $0 の購入ができる
- 空カートの小計だけが「$0」と表示される
- 購入完了後のブラウザの「戻る」で空の Step Two が表示される
- Step One の入力値が Step Two に表示されない

確認結果：

- 14件すべてPass
- 全6商品の各行の商品名・価格が、Products画面の表示および data/products.py と順番まで一致することを実機で確認

---

### ■ Checkout Complete 画面

実機確認をもとに仕様書・テストケースを作成し、実装。

- 仕様書：specs/checkout_complete_spec.md
- テストケース：specs/checkout_complete_testcases.md（6件）
- 前提状態は購入を完了して作る（購入せずに直接開けることは判断できない挙動のため、依存しない）
- PDF出力ボタン（Generate PDF order）は、購入直後に表示されることのみを確認し、
  ダウンロードと中身は今後の拡張候補とした
- CheckoutCompletePage を新規作成し、CheckoutFlow／checkout_assertions に追加

判断できない挙動4件は、仕様書に事実として記録し、テストの対象外とした。

確認結果：

- 6件すべてPass

---

### ■ Logout 機能（左上のメニュー）

実機確認をもとに仕様書・テストケースを作成し、実装。

- 仕様書：specs/logout_spec.md
- テストケース：specs/logout_testcases.md（10件）
- 範囲はメニューの開閉・Logout・All Items とし、Reset App State・Dynamic Catalog・About は今後の拡張候補とした
- ログアウト後に、URL での直接アクセスやブラウザの「戻る」でログイン後の画面に入れないことを確認した（TS版にはなかった確認）
- ログアウトしてもカートの中身が消えないなど、判断できない挙動は事実として記録し、テストの対象外とした
- MenuPage／LogoutFlow／logout_assertions を新規作成
- Login画面の状態（入力欄が空、エラーなし）の確認を、LoginPage／LoginFlow／login_assertions に追加

確認結果：

- 10件すべてPass
- 不安定になりやすいブラウザの「戻る」（TC-LOGOUT-009）は、3回続けて実行し、毎回Passすることを確認

---

### ■ メニューの開閉の判定方法の決定

- メニューの開閉は、表示の有無ではなく aria-hidden 属性で判定することを決定（論点17）
- URL で開いた直後は、閉じているメニューの項目も「表示されている」と判定されることを実機で確認したため

---

### ■ 暫定の遷移確認の移動

前の画面の移植時に暫定で置いていた遷移確認を、それぞれの画面のクラスへ移した。

- Step Two への遷移確認：CheckoutStepOnePage から CheckoutStepTwoPage.expect_on_page() へ
- Complete への遷移確認：CheckoutStepTwoPage から CheckoutCompletePage.expect_on_page() へ

---

### ■ 記録の更新

以下を backlog.md に記録。TS版自体の修正は行っていない。

- 今後の拡張候補（Reset App State、Dynamic Catalog、About、PDF出力）
- 判断を保留している挙動（Step Two・Complete・Logout）
- TS版の修正候補（Step Two の確認範囲、MenuPage の開閉の判定、LogoutFlow の重複処理、Wiki と実装の食い違いなど）

あわせて、完了報告を入れ子にしない1つのコードブロックにまとめるルールを CLAUDE.md に追加した。

---

### ■ プルリクエスト

プルリクエスト #2（Step Two）と #3（Complete・Logout）を、CI がすべて成功したことを確認してからマージした。
※ CI で実行しているのは TS版のテストで、Python版のテストはまだ CI に組み込んでいない。

---

### ■ Result（成果）

- Checkout Step Two（14件）・Checkout Complete（6件）・Logout（10件）の移植を完了
- Stage 1（全画面の Python 移植）を完了
- メニューの開閉の判定方法を決定し、URL で開いた直後でも正しく判定できるようにした
- 判断できない挙動を、テストの対象外として仕様書に記録
- テスト実行結果：77件すべてPass（149.39秒）
  - Login：9件（テストケース8件＋補助テスト1件）
  - Products：14件
  - Cart：11件
  - Checkout Step One：13件
  - Checkout Step Two：14件
  - Checkout Complete：6件
  - Logout：10件

---

### ■ Overall Status

- Login：完了（8件＋補助テスト1件）
- Products：完了（14件）
- Cart：完了（11件）
- Checkout Step One：完了（13件）
- Checkout Step Two：完了（14件）
- Checkout Complete：完了（6件）
- Logout：完了（10件）
- APIテスト：未実装（通信方針のみ決定。モックの実装方式は API層の移植着手時に決定）
- Visual Regression：未実装（Stage 2-1 で扱う予定）
- CI組み込み：未実装

---

### ■ Conclusion

本対応では、Checkout Step Two・Checkout Complete・Logout の移植を実施し、これで Stage 1（全画面の Python 移植）が完了した。

Step Two では金額を実機で確認した固定値で確認し、Complete では文言・画像・ボタンまで確認するなど、
TS版ではコードで確認していなかった範囲まで検証を広げた。Logout では、ログアウト後にログイン後の画面へ
入れないことも確認した。意図された仕様か不具合かを判断できない挙動は、テストで固定せず、事実として仕様書に記録した。

また、メニューの開閉は表示の有無では正しく判定できないことを実機で確認し、aria-hidden 属性で判定する方式とした。

---

## 2026-11-08

### ■ Before

- Login（8件＋補助テスト1件）・Products（14件）・Cart（11件）の移植は完了していた
- Checkout Step One 画面は未着手だった
- Checkout Step One への遷移確認は、Cart画面の移植時に CartPage へ暫定で置いたままだった
- ブランチの運用は決めておらず、すべて main に直接コミットしていた

---

### ■ Action（実施内容）

## ■ Stage 1：Checkout Step One 画面の移植

---

### ■ Checkout Step One 画面

実機確認をもとに仕様書・テストケースを作成し、実装。

- 仕様書：specs/checkout_step_one_spec.md
- テストケース：specs/checkout_step_one_testcases.md（13件）
- 入力チェック（未入力のエラー文言と優先順）、エラー表示の切り替わりと閉じ方、入力値の保持、
  画面遷移、カートへの影響、未ログイン時のアクセス制御を対象とした
- TS版では確認していなかったエラー文言まで確認した
- CheckoutStepOnePage／CheckoutFlow／checkout_assertions／checkout_data を新規作成
- 前提状態は Cart画面と同じく保存領域（localStorage）への直接書き込みで作り、
  画面は URL で直接開く（論点15）

確認結果：

- 13件すべてPass
- ロケータに使う data-test 属性は、実機で確認した値のみを使用

---

### ■ 判断できない挙動の扱い

意図された仕様か不具合かを判断できない以下の4件は、仕様書に事実として記録し、テストの対象外とした。

- 空白のみの入力が通る
- 入力欄の Enter で Cancel が動く
- エラー時に入力済みの欄も赤表示になる
- カートが空でも進める

Enter で Cancel が動くため、テストでは Continue を必ずボタンのクリックで押している。

---

### ■ Page Object の構成の決定

- ファイルは TS版の CheckoutPage.ts と1対1で対応する checkout_page.py とし、
  クラスは画面ごとに分けることを決定（論点16）
- 今回は CheckoutStepOnePage のみを作成。CheckoutStepTwoPage・CheckoutCompletePage は次回以降に追加する
- Step Two への遷移確認は、CheckoutStepTwoPage を作るまで CheckoutStepOnePage に置く（URLのみ確認）

---

### ■ Cart画面からの遷移確認の移動

- Cart画面の移植時に暫定で CartPage に置いていた Step One への遷移確認を、
  CheckoutStepOnePage.expect_on_page() へ移した
- Cart のテスト（TC-CART-007）もこれを使う形に変更

確認結果：

- Cart の11件すべてPass

---

### ■ TS版の修正候補の記録

以下を backlog.md に記録。TS版自体の修正は行っていない。

- Checkout系テストの名前と中身の食い違い（checkout-success.spec.ts の ③〜⑥）
- エラー文言の未確認（checkout-failure.spec.ts）
- Wiki「Checkout仕様」と実装の食い違い

---

### ■ ブランチ運用の決定

ブランチの運用を決めて CLAUDE.md に記載。

- コードを含む変更：作業ブランチからプルリクエストで取り込む（作成・マージはユーザーが行う）
- ドキュメントだけの変更：main に直接コミットする

この運用で初めてのプルリクエスト（#1）を作成し、CI（UI・API・Visual のテストと Slack通知）が
すべて成功したことを確認してからマージした。
※ CI で実行しているのは TS版のテストで、Python版のテストはまだ CI に組み込んでいない。

---

### ■ Result（成果）

- Checkout Step One 画面（13件）の移植を完了
- Checkout の Page Object の構成を決定し、次の画面を同じファイルへ追加できる形にした
- 判断できない挙動4件を、テストの対象外として仕様書に記録
- ブランチの運用を決定し、最初のプルリクエストをマージ
- テスト実行結果：47件すべてPass（85.10秒）
  - Login：9件（テストケース8件＋補助テスト1件）
  - Products：14件
  - Cart：11件
  - Checkout Step One：13件

---

### ■ Overall Status

- Login：完了（8件＋補助テスト1件）
- Products：完了（14件）
- Cart：完了（11件）
- Checkout Step One：完了（13件）
- Checkout Step Two：未着手
- Checkout Complete：未着手
- Logout：未着手
- APIテスト：未実装（通信方針のみ決定。モックの実装方式は API層の移植着手時に決定）
- Visual Regression：未実装（Stage 2-1 で扱う予定）
- CI組み込み：未実装

---

### ■ Conclusion

本対応では、Checkout Step One 画面の移植を実施し、TS版では確認していなかったエラー文言や
入力値の保持、カートへの影響まで検証範囲を広げた。意図された仕様か不具合かを判断できない
挙動は、テストで固定せず、事実として仕様書に記録した。

Page Object は、ファイルを TS版と1対1で対応させつつ、クラスを画面ごとに分ける構成とした。

また、ブランチの運用を決め、コードを含む変更はプルリクエストで取り込む形に切り替えた。

---

## 2026-10-31

### ■ Before

- 2026-10-07 に Stage 2-1 の方針と今後の拡張候補を決めていたが、backlog.md には記録していなかった
- 開発環境の移行後に、python/README.md のセットアップ手順で環境を再構築できるかは未確認だった

---

### ■ Action（実施内容）

## ■ 開発環境の移行

---

### ■ 新しいPCでの環境再構築

開発環境を新しいPCに移行し、python/README.md のセットアップ手順で環境を再構築。

確認結果：

- Python 3.14.4 で再構築できることを確認
- requirements.txt で固定したバージョンがそのまま入ることを確認
- 全34件Pass

---

## ■ 方針の記録

---

### ■ backlog.md への記録

2026-10-07 に決めた内容を backlog.md に記録。

Stage 2-1 の方針：

- APIテストは Python側のモックで実装する
- Visual Regression は CI上で基準画像を生成して比較する

今後の拡張候補：

- 外部APIのテスト
- 外部APIの仕様変更への対応フロー

---

### ■ Result（成果）

- 新しいPCで、README の手順どおりに環境を再構築できることを確認
- Stage 2-1 の方針と今後の拡張候補を backlog.md に記録
- テスト実行結果：34件すべてPass（1回目 101.84秒、2回目 50.07秒。1回目は新しい環境での初回起動のため時間がかかった）

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

本対応では、開発環境を新しいPCへ移行し、README のセットアップ手順と固定したバージョンで
環境を再構築できることを確認した。あわせて、Stage 2-1 の方針と今後の拡張候補を backlog.md に記録した。

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
