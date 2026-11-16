# 移植方針 決定ログ（TypeScript → Python）

既存のPlaywright + TypeScriptポートフォリオを、Playwright + Python
（PEP8準拠）へ移植するにあたり、既存設計との差異について行った
意思決定を記録する。実装前に必ず本ファイルを参照すること。

※ 配置場所について：.gitignoreのdocs/パターン（階層を問わず
"docs"という名前のディレクトリを除外）に引っかかるため、
python/直下（サブフォルダなし）に配置しています。

## 理想形を選ぶ際の判断基準

TS版に不統一・不備がある箇所についてPython版で「既存踏襲」ではなく
「理想形」を選ぶ場合は、以下の基準で判断する。

1. プロジェクト全体で多数派の実装スタイルを優先する
2. パフォーマンス・保守性の観点で明確な優位がある方を選ぶ
3. 迷ったらPython/pytestの一般的な慣習（イディオム）を優先する
4. ただし、テストの独立性・再現性に関わる場合は、上記より
   最優先で「正しい実装」を選ぶ（resetXxxMock問題のように）

### 安全弁

上記の基準に沿って理想形を追求した結果、当初の想定より実装コスト・
複雑さが大きく膨らむと判断した場合は、独断で進めず、その時点で
立ち止まって相談する。

## 記録フォーマット

```
## 論点N: <論点名>
- 分類: ①Login pilotに今すぐ影響 / ②Stage1以降・プロジェクト全体 / ③保留可
- 判断: 既存踏襲 or 変更
- 理由: <なぜその判断にしたか>
- 影響範囲: <どのファイル/層に影響するか>
- TS逆輸入候補: あり / なし
- 決定日: YYYY-MM-DD
```

「TS逆輸入候補」は、Python版で理想形に修正した内容のうち、
後日TS版にも反映する価値があるものを識別するための項目。
「あり」の場合でも、TS版自体の修正は本プロジェクトのスコープ外とし、
別途の作業として扱う。

---

## 論点1: storageState機構が未配線

- 分類: ①
- 判断: 変更（Python版では正式に配線する）
- 理由: pytest-playwrightではsession/moduleスコープのfixtureで
  storage_stateを再利用するのが一般的な慣習であり（判断基準3）、
  かつ毎テストの実ログインを避けられるため保守性・実行速度の両面で
  明確な優位がある（判断基準2）。ログイン状態の再利用はテストの
  独立性を損なわない読み取り専用の前提条件のため、判断基準4にも抵触しない。
  TS版の「実装はあるが未配線」という状態は意図的な設計ではなく
  単なる設計ドリフトと判断されるため踏襲しない。
- 影響範囲: conftest.py（storage_state生成・再利用fixture）、
  LoginFlow/LoginPage相当のPythonクラス
- TS逆輸入候補: あり（auth.setup.tsをplaywright.config.tsの
  projectsに正式配線すれば同じ恩恵を得られるが、本プロジェクトの
  スコープ外）
- 決定日: 2026-07-30
- 追記（2026-10-07）: logged_page を pytest-playwright の new_context
  fixture 経由で生成する形に変更した。--screenshot / --tracing / --video
  等の設定が logged_page を使うテストにも適用されるようにするため。

## 論点2: ロケータのキャッシュ有無が不統一

- 分類: ②
- 判断: 変更（Python版は全Page Objectを「__init__ でまとめて定義する方式」
  で統一する）
- 理由: 2026-07-30時点ではLoginPageのみ既存踏襲とし、統一は先送り
  していた。Products画面の実装にあたり、Python版の中で書き方を揃える
  ため統一を決定した。PlaywrightのLocatorは遅延評価のため性能面の不利は
  なく、Pythonの Page Object では一般的な書き方である（判断基準3）。
  商品ごとに変わる部品は、商品名を受け取るメソッドで扱う。
- 影響範囲: Python版の全Page Object
- TS逆輸入候補: あり（TS版は都度生成派が多数のため、統一する場合は
  InventoryPage / CartPage / CheckoutPage / HeaderComponent の書き換えが
  必要）
- 決定日: 2026-07-30（初回）／2026-10-07（更新）

## 論点3: コンストラクタスタイルの不統一（TS特有）

- 分類: ③
- 判断: 該当なし（Pythonには相当構文がなく `__init__(self, page)` に
  自然に一本化される）
- 理由: TypeScript固有の構文差（parameter propertyの有無）であり、
  Python移植によって自動的に解消するため、意思決定自体が不要。
- 影響範囲: 全Page Objectクラスの__init__実装（統一形式に自然収束）
- TS逆輸入候補: なし
- 決定日: 2026-07-30

## 論点4: Page Object内に画面レベルの検証が同居

- 分類: ①
- 判断: 既存踏襲
- 理由: grepによる全呼び出し箇所の確認の結果、Page Objectの
  expectXxx系メソッドは100%Flow層からのみ呼ばれており、
  spec/uiAssertions層から直接呼ばれている箇所は0件だった。
  コメント上の建前ではなく実装レベルでも一貫した設計規律と
  判断できるため、Python版でも同じ階層を踏襲する。
  Spec → uiAssertions → Flow.expect_xxx() → PageObject.expect_xxx() → assert
- 影響範囲: 全Page Object / Flowクラスの責務設計
- TS逆輸入候補: なし（既にTS側がこの設計）
- 決定日: 2026-07-30

## 論点5-a: resetXxxMock()が未呼び出し（テスト独立性の問題）

- 分類: ②（テスト独立性に関わるため優先度を引き上げて扱う）
- 判断: 変更（Python版ではautouse fixtureで確実にモック状態を
  リセットする設計にする）
- 理由: 判断基準4（テストの独立性・再現性に関わる場合は最優先で
  正しい実装を選ぶ）に該当する典型例。TS版では代替のリセット処理が
  存在せず、アサーションが緩く作られていることで偶然失敗を免れている
  だけと判明した（cart一覧アサーションが件数を検証しない等）。
  これは設計上の欠陥であり、Python版では踏襲しない。
- 影響範囲: conftest.py（モックサーバ/モックDB相当のautoused
  resetフィクスチャ）、API層のテスト全般
- TS逆輸入候補: あり（TS版にもserver.resetHandlers()を
  beforeEachに追加する価値があるが、TS版自体の修正は
  本プロジェクトのスコープ外。Python版完了後、余力があれば
  別途検討する）
- 決定日: 2026-07-30
- 追記（2026-11-15）: TS版の改善案として挙げていた server.resetHandlers() では、
  ハンドラーの中の変数（カートの中身など）は戻らないため、効果がないと考えられる。
  状態を戻すには resetCartMock／resetCheckoutMock を呼ぶ必要がある
  （2026-11-15 調査。TS版での実行による確認はしていない）。
  Python版はテストごとにモックサーバーを立ち上げる方式で解決した（論点19）。

## 論点5-b: utils/loginHelper.ts 等のデッドコード

- 分類: ①（loginHelper.ts部分）/②（apiConfig.ts, npm scripts部分）
- 判断:
  - loginHelper.ts相当: 除外（Python版には移植しない）
  - apiConfig.ts相当: 移植しない（2026-11-15。使われておらず、中身も外部API
    〈JSONPlaceholder・ReqRes〉を指しているため）
  - npm scripts相当: 未定（API層の移植では判断していない）
- 理由: loginHelper.tsはFlow/Page Objectを経由しない素のpage操作
  関数であり、LoginFlow/LoginPageに置き換わった後の残骸と判断できる。
  実装上の価値がなく、意図的な設計でもないため移植しない。
  apiConfig.ts等はAPI層に関わるため、Login画面の実装には影響せず、
  該当フェーズで改めて判断する。
- 影響範囲: Login画面実装（loginHelper.ts相当は作成しない）
- TS逆輸入候補: あり（TS版でも不要コードとして削除する価値が
  あるが、本プロジェクトのスコープ外）
- 決定日: 2026-07-30（初回）／2026-11-15（更新：apiConfig.ts）

## 論点6: types/api.ts の型定義が実質使われていない

- 分類: ②
- 判断: 変更（types/api.ts は移植しない。形をチェックする道具〈pydantic 等〉は導入せず、
  返事の値を直接確かめる）
- 理由: types/api.ts はどこからも使われていないため。APIテストの全件で値まで確かめるため、
  形の確認も含まれる。TS版は zod を2つの API にしか使っておらず、Python版のほうが確認は強い。
- 影響範囲: utils/api_assertions/（返事の値を直接確かめる確認関数）
- TS逆輸入候補: 未定
- 決定日: 2026-11-15

## 論点7: Lint/Formatツールが一切導入されていない

- 分類: ③
- 判断: 未定（プロジェクト全体の方針として後日判断）
- 理由: Login画面の実装自体には影響しないため保留してよい。
- 影響範囲: プロジェクト全体のツール設定（ruff/black等の導入可否）
- TS逆輸入候補: 未定
- 決定日: -

## 論点8: tsconfig.json の設定不整合

- 分類: ③
- 判断: 未定（Python版の設定ファイルには引き継がない方針を確認のみ）
- 理由: 単なる設定ミスであり、Python版のpyproject.toml等には
  そもそも該当しない。実害がないため保留してよい。
- 影響範囲: なし（Python版設定ファイルへの影響なし）
- TS逆輸入候補: なし
- 決定日: -

## 論点9: zodスキーマ検証の適用範囲が不統一

- 分類: ②
- 判断: 変更（形をチェックする道具〈zod・pydantic 等〉は導入せず、返事の値を直接確かめる）
- 理由: APIテストの全件で値まで確かめるため、形の確認も含まれる。TS版は zod を2つの API
  にしか使っておらず、Python版のほうが確認は強い。
- 影響範囲: utils/api_assertions/（返事の値を直接確かめる確認関数）
- TS逆輸入候補: 未定
- 決定日: 2026-11-15

## 論点10: utils/urls.ts の参照が徹底されていない

- 分類: ①
- 判断: 変更（Python版では最初からURL/設定モジュールの参照を徹底する）
- 理由: 判断基準2（保守性の観点で明確な優位）および判断基準3
  （pytestの慣習として設定値の一元管理が一般的）に該当する。
  ハードコードと参照が混在する現状は意図的な設計ではなく
  実装漏れと判断できるため、Python版では最初から徹底する。
  実装コストも小さく、安全弁（実装コスト膨張時の相談）には該当しない。
- 影響範囲: Python版LoginPage相当クラスのURL参照方法
- TS逆輸入候補: あり（TS版でも徹底する価値があるが、本プロジェクトの
  スコープ外）
- 決定日: 2026-07-30

## 論点11: テストケース一覧との照合漏れ（Login画面）

- 分類: 運用ルール（TS版との設計差異ではなく、実装依頼プロセスの改善のため①②③の対象外）
- 判断: 運用ルールを追加
- 内容: 確定していたTC-LOGIN-005/006の代わりに、除外を決定していた「ユーザー名・パスワード両方誤り」のパターンが実装されていた
- 理由: 実装時にテストケース一覧を明示的に参照せず実装した可能性があるため、実装の前後に照合の仕組みを設ける
- 対策:
  1. 実装前：テストケース一覧をファイルとして明示的に渡す
  2. 実装後：テストケースIDと実装したテスト関数の「突合表」を作成し、完了報告に含める
  詳細は CLAUDE.md「実装依頼時の運用ルール（テストケースとの照合）」に記載
- 影響範囲: Claude Codeへの実装依頼手順（全画面共通）
- TS逆輸入候補: なし
- 決定日: 2026-07-30
- 追記（2026-10-07）: Stage 0 の突合は「テストケースに対応する関数があるか」までで、期待結果の中身までは確認していなかった。その結果、002〜007 のエラー文言・画面遷移なしの確認漏れと、TC-LOGIN-008 の未実装が、テストケースをファイル化した時点（2026-10-07）まで見つからなかった。対策として、突合を期待結果単位で行うルールを CLAUDE.md に追加した。

## 論点12: Products画面を独立した画面として扱う

- 分類: ②
- 判断: 変更
- 理由: TS版ではProducts画面を独立したドメインとして扱っておらず、
  カート関連の挙動はWiki「Cart仕様」の一部だった。ソート・画面遷移・
  未ログイン時のアクセス制御は未検証だった。Python版は画面単位で
  「仕様書→観点→テストケース」を作る進め方のため、Products画面を
  独立させ、検証範囲を広げた（18観点・14件）。全商品を追加して
  バッジ＝件数を確認するテストは、TS版と同じくCart側で扱う。
- 影響範囲: python/specs/products_*.md、pages/inventory_page.py、
  pages/header_component.py、flows/inventory_flow.py、tests/ui/inventory/
- TS逆輸入候補: 検討（TS版のWikiの対象ドメインにProductsを追加するか
  どうかを含む）
- 決定日: 2026-10-07

## 論点13: goto() と expect_on_xxx() の使い分け

- 分類: ②
- 判断: 変更
- 理由: TS版では InventoryPage.goto() が「表示確認のみ（移動しない）」、
  CartPage.goto() が「移動する」と、同じ名前で意味が異なっていた。
  Python版では goto() を「移動のみ」、表示確認を expect_on_xxx() に
  統一する。goto() に表示確認を含めると、未ログイン時のテスト
  （TC-PROD-014）が成立しないという実害もあった。既存の
  LoginPage.goto() も同じ考え方に合わせて変更した。
- 影響範囲: pages/login_page.py、pages/inventory_page.py、
  flows/login_flow.py、fixtures/login_fixture.py（今後の全Page Object）
- TS逆輸入候補: あり
- 決定日: 2026-10-07

## 論点14: 依存パッケージの管理方法

- 分類: ②
- 判断: requirements.txt＋venv で管理し、直接使うパッケージは
  バージョンを固定（==）する
- 理由: 依存パッケージが少なく、Poetry等の専用ツールを入れるほどの
  規模ではない。CIへの組み込み時もそのまま使える（判断基準3）。
  最新版に上げたうえで Stage 0 のテストが全件Passすることを確認して
  から固定した。
- 影響範囲: python/requirements.txt
- TS逆輸入候補: なし
- 決定日: 2026-10-07

## 論点15: Cart画面テストの前提状態の作り方

- 分類: ②
- 判断: 変更（TS版はすべて画面操作で作っているが、Python版は「追加した順」を
  確かめる TC-CART-003 以外、localStorage への直接書き込みで作る）
- 理由: Products画面の不具合でCart画面のテストまで失敗しないようにするため
  （判断基準4：テストの独立性）。画面操作による追加は TC-CART-003 と
  Products画面のテストで確認している。書き込みと画面表示が一致することは
  実機で確認済み。SauceDemo内部のキー名（cart-contents）に依存するため、
  書き込み処理は1か所にまとめた。
- 影響範囲: pages/cart_page.py（set_cart_contents：書き込み処理の唯一の実装）、
  flows/cart_flow.py（open_cart_with：前提状態を作ってカート画面を開く）、
  tests/ui/cart/（TC-CART-003 以外のテスト）
- TS逆輸入候補: 検討（TS版のテスト時間短縮と独立性の向上につながるが、
  内部キー名への依存が増える）
- 決定日: 2026-10-07
- 追記（2026-11-15）: Checkout画面と Logout機能のテストも、同じ方式（localStorage への
  直接書き込み）で前提状態を作っている。Checkout は CheckoutFlow.open_step_one_with
  （と、それを経由する open_step_two_with・open_complete_with）、Logout は
  CartFlow.open_cart_with を使う。書き込み処理は引き続き CartPage.set_cart_contents の
  1か所のみ。これにより、影響範囲に flows/checkout_flow.py、tests/ui/checkout/、
  tests/ui/logout/ の該当テストが加わる。

## 論点16: Checkout画面の Page Object の構成

- 分類: ②
- 判断: 変更（折衷案）。ファイルは TS版の CheckoutPage.ts と1対1で対応する
  checkout_page.py を1つとし、クラスは画面ごとに分ける
  （CheckoutStepOnePage／CheckoutStepTwoPage／CheckoutCompletePage）
- 理由: TS版は Login・Products・Cart が1画面1クラスで、Checkout だけ3画面を
  1クラスにまとめていた。Python版は1画面1クラスで統一する（判断基準1：多数派優先）。
  一方で、ファイルは TS版と1対1で対応させ、見比べやすさと、将来TS版に反映するときの
  手間の小ささを両立させた。
- 影響範囲: pages/checkout_page.py（CheckoutStepOnePage。CheckoutStepTwoPage・
  CheckoutCompletePage は次回以降に追加）、flows/checkout_flow.py、
  utils/ui_assertions/checkout_assertions.py、data/checkout_data.py、
  tests/ui/checkout/、pages/cart_page.py と flows/cart_flow.py
  （CartPage.expect_on_checkout_step_one_page() を CheckoutStepOnePage.expect_on_page() へ移動）
- TS逆輸入候補: あり（TS版も CheckoutPage.ts の中を画面ごとのクラスに分けるだけで
  同じ構造にできる）
- 決定日: 2026-11-08
- 追記（2026-11-15）: Checkout Step Two・Checkout Complete の移植で CheckoutStepTwoPage・
  CheckoutCompletePage を追加し、3クラス（CheckoutStepOnePage／CheckoutStepTwoPage／
  CheckoutCompletePage）とも pages/checkout_page.py に実装済み。

## 論点17: メニューの開閉の判定方法

- 分類: ②
- 判断: 変更（TS版の MenuPage は表示されているかどうか〈isVisible〉で開閉を判定しているが、
  Python版は aria-hidden 属性で判定する）
- 理由: URL で開いた直後の画面では、閉じているメニューの Logout も「表示されている」と
  判定されることを実機で確認した。表示の有無では開閉を正しく判定できないため
  （判断基準4：テストの再現性）。
- 影響範囲: pages/menu_page.py（MenuPage）、flows/logout_flow.py、
  utils/ui_assertions/logout_assertions.py、tests/ui/logout/
- TS逆輸入候補: あり
- 決定日: 2026-11-09

## 論点18: 商品一覧画面の表示確認の置き場所

- 分類: ②
- 判断: 変更（TS版は LoginPage.expectOnInventoryPage など複数の場所で商品一覧画面の
  表示を確認しているが、Python版は InventoryPage.expect_on_page() の1か所にまとめる）
- 理由: Stage 2-0 の棚卸しで、同じ確認が4か所に分かれ、確認の条件（URLの部分一致と
  完全一致、CSSクラスと data-test）もばらばらであることがわかったため。1か所にまとめ、
  URLは完全一致、要素は data-test で確認する形に揃えた（論点2・10）。
- 影響範囲: pages/inventory_page.py、pages/login_page.py、flows/login_flow.py、
  flows/inventory_flow.py、fixtures/login_fixture.py、
  utils/ui_assertions/inventory_assertions.py、tests/ui/login/
- TS逆輸入候補: あり
- 決定日: 2026-11-15

## 論点19: APIテストのモックの方式とファイルの置き場所

- 分類: ②
- 判断: 変更（TS版は MSW でテストのプロセスの中の通信を横取りする方式。Python版は
  127.0.0.1 の空いているポートで小さなモックサーバーを立ち上げる方式）。ファイルは
  画面のテストと分け、API専用のものは専用のフォルダ（mocks/、utils/api_assertions/、
  data/api/、tests/api/）にまとめる
- 理由: Python版の Playwright では、route による横取りが APIRequestContext の通信に
  効かないことを実機で確認したため（2026-11-15）。標準ライブラリだけで作り、API ごとに
  ファイルを分けて TS版の mocks/handlers/ と見比べられる形にした。テストごとにサーバーを
  立ち上げ、状態が混ざらないようにした（論点5-a）。データは画面用と混ざらないよう
  data/api/ に分けた（TS版は data/ の直下）。Visual Regression も同じ考え方で専用の
  フォルダにまとめる。
- 影響範囲: mocks/server.py、mocks/handler_types.py、
  mocks/handlers/（login_handlers.py・user_handlers.py・cart_handlers.py・
  checkout_handlers.py・logout_handlers.py）、fixtures/api_fixture.py、conftest.py、
  utils/api_helper.py、utils/api_assertions/（common_assertions.py・login_assertions.py・
  user_assertions.py・cart_assertions.py・checkout_assertions.py・logout_assertions.py）、
  data/api/（api_users.py・api_carts.py・api_checkout.py）、
  tests/api/（test_login_api.py・test_user_api.py・test_cart_api.py・
  test_checkout_api.py・test_logout_api.py）
- TS逆輸入候補: 検討（TS版も同じ方式・置き場所に揃えるかは、TS版への横展開のときに判断する）
- 決定日: 2026-11-15

## 論点20: CI の構成

- 分類: ②
- 判断: 変更（TS版の CI の設定ファイルに Python版のジョブを追加し、あわせて表示名と
  古い実行の自動キャンセルを設定する）
  1. 設定ファイル：既存の .github/workflows/playwright.yml に Python版のジョブ
     （python-ui-tests・python-api-tests）を追加する（別ファイルは作らない）
  2. ジョブの表示名：TS版・Python版の両方に付ける（UI Tests (TS)／API Tests (TS)／
     Visual Tests (TS)／UI Tests (Python)／API Tests (Python)）。ジョブID（ui-tests など）は
     変えない。Slack 通知の Results も同じ名前で5つのジョブを並べる
  3. 古い実行の自動キャンセル：ワークフロー全体に concurrency を設定し、プルリクエストでは
     古い実行を止め、main への push では止めない
     （cancel-in-progress: ${{ github.event_name == 'pull_request' }}）
  4. ドキュメント（*.md）だけの push で CI を動かさない設定（paths-ignore）：今回は入れない
     （backlog.md に候補として記録）
- 理由:
  1. 結果を見る場所（GitHub の画面・Slack の通知）を1つにするため
  2. TS版のジョブは表示名だけを変え、手順・コマンド・キャッシュ・Artifact には触れないことで、
     TS版への影響を最小にするため。ジョブIDを変えないため、needs や通知の参照も変わらない
  3. プルリクエストは最新の push の結果だけ確認すれば十分だが、main はマージごとの結果を
     残したいため
  4. 1つのプルリクエストは1つの目的に絞るため（paths-ignore は TS版の CI の動きも変わるため、
     影響を確かめてから別に入れる）
- 影響範囲: .github/workflows/playwright.yml（TS版のジョブの表示名、python-ui-tests・
  python-api-tests の追加、concurrency、Slack Notification の needs・失敗の判定・Results）
- TS逆輸入候補: なし（TS版と共通のファイルで、すでに両方に効くため）
- 決定日: 2026-11-16
