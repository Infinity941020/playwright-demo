# 移植方針 決定ログ（TypeScript → Python）

既存のPlaywright + TypeScriptポートフォリオを、Playwright + Python
（PEP8準拠）へ移植するにあたり、既存設計との差異について行った
意思決定を記録する。実装前に必ず本ファイルを参照すること。

※ 文中の CLAUDE.md・backlog.md は非公開の作業用ファイル（2026-11-17 に非公開に移した）。

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
- TS逆輸入候補: 反映済み（横展開2-2。当初は「あり（auth.setup.tsをplaywright.config.tsの
  projectsに正式配線すれば同じ恩恵を得られるが、本プロジェクトのスコープ外）」としていた）
- 決定日: 2026-07-30
- 追記（2026-10-07）: logged_page を pytest-playwright の new_context
  fixture 経由で生成する形に変更した。--screenshot / --tracing / --video
  等の設定が logged_page を使うテストにも適用されるようにするため。
- 追記（2026-11-18）: 横展開2-2 で TS版にも反映した。
  auth.setup.ts を playwright.config.ts の準備用のプロジェクト（setup）にし、UI の3プロジェクトを
  setup に依存させた。ログイン状態は playwright/.auth/standard_user.json に保存する。
  loggedPage は、loginFixture.ts の中で storageState の設定を保存したファイルに差し替え、
  Playwright が作る page で商品一覧画面を開いて表示を確かめてから渡す。
  browser.newContext() で自分で context を作ると config の video の設定が効かず、録画が取れなくなるため
  （Python版の 2026-10-07 の追記と同じ理由）。差し替えは loginFixture の test を使うテストだけに効き、
  プロジェクト全体の use には storageState を入れない（ログインしていない状態が必要なテストがあるため）。
- 追記（2026-11-19）: 横展開3-0 で、setup をやめて worker ごとに作る形に変えた（論点27）。
  ログイン状態は playwright/.auth/standard_user-〈ブラウザ名〉-〈parallelIndex〉.json に保存し、作ってから8分を過ぎたら作り直す。
  loggedPage の形（storageState の設定を差し替え、Playwright が作る page を使う）は変えていない。

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
- TS逆輸入候補: 反映済み（横展開2-3・2-4）。
  全 Page Object（LoginPage / InventoryPage / CartPage / HeaderComponent は 2-3、CheckoutPage / MenuPage は 2-4）で、
  ロケータをコンストラクタでまとめて定義し、指定を Python版と同じ data-test 属性にした
  （MenuPage の開閉ボタン・メニュー領域は data-test がないため、Python版と同じく id・CSS クラス）
  （当初は「あり（TS版は都度生成派が多数のため、統一する場合は InventoryPage / CartPage /
  CheckoutPage / HeaderComponent の書き換えが必要）」としていた）
- 決定日: 2026-07-30（初回）／2026-10-07（更新）

## 論点3: コンストラクタスタイルの不統一（TS特有）

- 分類: ③
- 判断: 該当なし（Pythonには相当構文がなく `__init__(self, page)` に
  自然に一本化される）
- 理由: TypeScript固有の構文差（parameter propertyの有無）であり、
  Python移植によって自動的に解消するため、意思決定自体が不要。
- 影響範囲: 全Page Objectクラスの__init__実装（統一形式に自然収束）
- TS逆輸入候補: 反映済み（横展開2-3・2-4）。
  TS版の書き方の決まりはなかったため、LoginPage の形（readonly の項目を宣言し、コンストラクタで代入する。
  parameter property は使わない）に、全 Page Object を揃えた
  （LoginPage / InventoryPage / CartPage / HeaderComponent は 2-3、CheckoutPage の3クラス / MenuPage は 2-4）。
  当初は「なし」としていた
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
- 追記（2026-11-25）: TS版の状態を戻す関数（mocks/handlers/cartHandlers.ts の resetCartMock、
  checkoutHandlers.ts の resetCheckoutMock）を、どこからも呼ばれていないため消した（横展開4-1 の1つ目のプルリクエスト）。
  呼ばれていなかったので、TS版のモックの状態がテストのあいだで残ることは、消す前と変わらない。
  テストのあいだで状態が混ざらないことは、2つ目のプルリクエストで、テストごとにサーバーを立てるモックの作りで保証する（まだ行っていない。論点19）。
- 追記（2026-11-25）: TS版のモックも、テストごとに新しいサーバーを立て、ハンドラーを新しい状態で作る形にした（横展開4-1 の2つ目のプルリクエスト。論点19）。
  これで両版とも、テストのあいだで状態（カートの中身、id の連番、Checkout の呼び出し回数）が混ざらないことを、状態を戻す処理に頼らず、モックの作りで保証する。
  手元で cart-api.spec.ts を1つの担当で流し、7件目の追加で返る id が 1 になること（作り直す前は 4）と、一覧に前のテストの行が出ないことを確かめた。

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
- TS逆輸入候補: 反映済み（横展開2-5。API 関係は 4-1 で判断）。
  TS版の pages/・flows/・fixtures/・data/・utils/ から、使われていない utils/loginHelper.ts、
  CartPage.backToInventory（continueShopping と同じボタンを押すだけの重複。CheckoutFlow.cancelFromCart は
  continueShopping を使う形にした）、CartFlow.getCartPage を削除した。
  使われていないが横展開3 で使う見込みのもの（Checkout の各画面の goto() など）は残した
  （当初は「あり（TS版でも不要コードとして削除する価値があるが、本プロジェクトのスコープ外）」としていた）
- 決定日: 2026-07-30（初回）／2026-11-15（更新：apiConfig.ts）
- 追記（2026-11-25）: TS版から、API 関係の使われていないものを消した（横展開4-1 の1つ目のプルリクエスト）。
  消したもの：utils/apiConfig.ts（JSONPLACEHOLDER_BASE_URL・REQRES_BASE_URL・API_KEY）、
  utils/apiAssertions/commonAssertions.ts の expectCreatedResource と、その中だけで使われていた expectResponseBody、
  loginAssertions.ts の expectLoginUnauthorized と、それだけが使っていた STATUS.UNAUTHORIZED、
  data/apiUsers.ts の inputPatterns（missingPassword・missingEmail・emptyRequest・wrongPassword）。
  理由：どれも定義の外から使われていないため。
  消す前に、typescript/ の .ts を名前で検索し（node_modules を除く）、定義の外から使われていないことを確かめた。
  消した後に、リポジトリ全体を拡張子を限らずに検索し（node_modules・.git・.venv・python/decisions.md を除く）、消したもの自体が残っていないことを確かめた。
  検索では、名前の一部が同じだけの別物（画面のテストのデータ wrongPasswordOnly、今も使っている確認の部品 expectSingleUserResponse）と、
  ログアウトの確認の部品の別の定義 UNAUTHORIZED（ログアウトの 401 の確認で使う）は出る。
  emptyRequest は Cart・Checkout にも同じ名前があるため、apiUsers の inputPatterns が使われていないことで確かめた。
  Python版の説明文2か所（cart_handlers.py・checkout_handlers.py）に、消した関数の名前が残る（横展開5 で直す）。
  これまでの方針では、後で使う見込みのものは残していたが、今回消したものは、次の理由で3つ目のプルリクエストでも使わない。
  ・apiConfig.ts（JSONPLACEHOLDER_BASE_URL・REQRES_BASE_URL・API_KEY）：外部の API を指す設定で、API のテストはモックだけを使うため使わない。
    外部の API のテストを行うときは、そのときの接続先と形で作る。
  ・ログインの入力の不足（missingPassword・missingEmail・emptyRequest）・ログインの 401（expectLoginUnauthorized）・ログアウトの reason：
    Python版のテストにもテストケース（specs/api_testcases.md）にもない。
  ・作成の返事に id があるかの汎用の確認（expectCreatedResource・expectResponseBody）：Python版は Cart の確認の部品の中で id を確かめている。
    3つ目でも Cart の確認の部品として書くため、汎用の部品は使わない。
  ・ユーザーの返事の型（UserData・SingleUserResponse）：Python版は値を直接確かめる形（論点6）のため使わない。
  ・ログインの本文の型（LoginRequest）：Python版は、ログインの本文をそのまま送る形（論点6）のため使わない。
  ・wrongPassword：TC-API-LOGIN-002 とメールアドレスの値が違う（wrongPassword は test@example.com、TC-API-LOGIN-002 は invalid@test.com）ため使えない。
    3つ目で、TC-API-LOGIN-002 の値のデータを足す。
  型の変更：utils/apiHelper.ts の LogoutPayload の body の型を、{ reason?: string } から、
  呼び出す側（fixtures/apiFixture.ts）と同じ Record<string, unknown> に広げた。
  reason はどこからも使われておらず、ログアウトのモックも読んでいない。
  また、TC-API-LOGOUT-003 は reason 以外の本文を送るため、どんな本文でも渡せる型の方がテストケースに合う。実行時の処理は変わらない。
  状態を戻す関数は論点5-a、types/api.ts は論点6 に書いた。

## 論点6: types/api.ts の型定義が実質使われていない

- 分類: ②
- 判断: 変更（types/api.ts は移植しない。形をチェックする道具〈pydantic 等〉は導入せず、
  返事の値を直接確かめる）
- 理由: types/api.ts はどこからも使われていないため。APIテストの全件で値まで確かめるため、
  形の確認も含まれる。TS版は zod を2つの API にしか使っておらず、Python版のほうが確認は強い。
- 影響範囲: utils/api_assertions/（返事の値を直接確かめる確認関数）
- TS逆輸入候補: 未定
- 決定日: 2026-11-15
- 追記（2026-11-25）: TS版の types/api.ts（LoginRequest・UserData・SingleUserResponse）を、
  どこからも使われていないため消した（横展開4-1 の1つ目のプルリクエスト。types/ のフォルダもなくなった）。
  tsconfig.json の include に types/ が入っておらず、型の確認の対象にもなっていなかった。
  TS版での扱い（上の TS逆輸入候補：未定）は、ここで消すことに決めた。

## 論点7: Lint/Formatツールが一切導入されていない

- 分類: ③
- 判断: 未定（プロジェクト全体の方針として後日判断）
- 理由: Login画面の実装自体には影響しないため保留してよい。
- 影響範囲: プロジェクト全体のツール設定（ruff/black等の導入可否）
- TS逆輸入候補: 未定
- 決定日: -

## 論点8: tsconfig.json の設定不整合

- 分類: ③
- 判断: 解決済み（横展開2-1 で tsconfig.json を ESM に合わせて修正。論点24）
- 理由: 単なる設定ミスであり、Python版のpyproject.toml等には
  そもそも該当しない。当初は実害がないため保留とした。
  横展開2-1 で、JSON の読み込みのために module・moduleResolution を
  package.json の "type": "module" に合わせて直した。
- 影響範囲: なし（Python版設定ファイルへの影響なし）
- TS逆輸入候補: なし
- 決定日: 2026-11-18

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
- TS逆輸入候補: 反映済み（横展開2-3・2-4）。
  Page Object の URL をすべて utils/urls.ts の参照にした（LoginPage / InventoryPage / CartPage は 2-3、
  CheckoutPage の3クラスは 2-4。MenuPage の直書きは、ログイン画面の確認を LoginPage.expectOnPage() に移して 2-4 でなくした）。
  Visual のテストのファイルに残っている直書きは、テストのファイルを変える横展開3・4 で扱う
  （当初は「あり（TS版でも徹底する価値があるが、本プロジェクトのスコープ外）」としていた）
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
- 影響範囲: specs/products_*.md、pages/inventory_page.py、
  pages/header_component.py、flows/inventory_flow.py、tests/ui/inventory/
- TS逆輸入候補: 反映済み（Wiki の扱いは後の作業で判断）。当初は「検討（TS版のWikiの対象ドメインにProductsを追加するか
  どうかを含む）」としていた
- 決定日: 2026-10-07
- 追記（2026-11-20）: TS版に Products画面のテスト（typescript/tests/ui/inventory/ の6ファイル）を新しく作り、両版共通のテストケースと同じ14件を、
  Python版と同じ確かめ方で実装した（3ブラウザで実行）。
  両版の部品は、今回のテストで使うものだけを揃えた。Python版だけにある操作は、商品詳細画面を URL で開く操作。
  TS版だけにある操作は、全商品・先頭の商品をカートに入れる操作（Cart のテストで使う）。
  既存の部品（InventoryPage・HeaderComponent）は、説明文を役割と理由だけを書く形に直し、中身（画面の要素の探し方）を外から触れない形にした。
  Wiki の扱いは、Wiki を両版共通の内容に直す後の作業で判断する

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
- TS逆輸入候補: 反映済み（横展開2-3・2-4）。
  LoginPage / InventoryPage / CartPage（2-3）と CheckoutStepOnePage / CheckoutStepTwoPage / CheckoutCompletePage（2-4）の
  goto() を「開くだけ」にし、表示の確認を expectOnPage() に分けた
  （InventoryPage の今までの goto() は、表示を確かめるだけだったため expectOnPage() にした）。当初は「あり」としていた
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
  確かめる TC-CART-003 以外、localStorage への直接書き込みで作る）（2026-10-07 時点）
- 理由: Products画面の不具合でCart画面のテストまで失敗しないようにするため
  （判断基準4：テストの独立性）。画面操作による追加は TC-CART-003・010 と
  Products画面のテストで確認している。書き込みと画面表示が一致することは
  実機で確認済み。SauceDemo内部のキー名（cart-contents）に依存するため、
  書き込み処理は1か所にまとめた。
- 影響範囲: pages/cart_page.py（set_cart_contents：書き込み処理の唯一の実装）、
  flows/cart_flow.py（open_cart_with：前提状態を作ってカート画面を開く）、
  tests/ui/cart/（TC-CART-003・010 以外のテスト）。
  TS版は typescript/pages/CartPage.ts・flows/CartFlow.ts・tests/ui/cart/ と、
  flows/CheckoutFlow.ts（openStepOneWith・openStepTwoWith・openCompleteWith）・tests/ui/checkout/checkout-step-one-*.spec.ts・
  checkout-step-two-*.spec.ts・checkout-complete-*.spec.ts、tests/ui/logout/logout-success.spec.ts・logout-all-items.spec.ts
- TS逆輸入候補: 反映済み（Cart と Checkout の Step One・Step Two は 2026-11-21、Checkout の Complete と Logout は 2026-11-22）。
  当初は「検討（TS版のテスト時間短縮と独立性の向上につながるが、内部キー名への依存が増える）」としていた。
- 決定日: 2026-10-07
- 追記（2026-11-15）: Checkout画面と Logout機能のテストも、同じ方式（localStorage への
  直接書き込み）で前提状態を作っている。Checkout は CheckoutFlow.open_step_one_with
  （と、それを経由する open_step_two_with・open_complete_with）、Logout は
  CartFlow.open_cart_with を使う。書き込み処理は引き続き CartPage.set_cart_contents の
  1か所のみ。これにより、影響範囲に flows/checkout_flow.py、tests/ui/checkout/、
  tests/ui/logout/ の該当テストが加わる。
- 追記（2026-11-21）: TS版の Cart のテスト（typescript/tests/ui/cart/）も、同じ方式で前提の状態を作るようにした。
  TC-CART-003 と TC-CART-010 は商品一覧画面での操作で作り、それ以外はブラウザの保存領域へ直接書き込む。書き込む処理は TS版でも
  CartPage.setCartContents の1か所だけ。あわせて両版とも、書き込んでカート画面を開いた後に、商品の行の数が入れた件数と
  同じことを確かめるようにした（書き込みが効かずに空のカートのままテストが進むのを防ぐため）。
  この行の数の確認は、Cart の前提づくり（CartFlow の openCartWith／open_cart_with）に入れた。
  Python版の Checkout の前提づくり（open_step_one_with）には、まだ入っていない。
  あわせて両版とも、TC-CART-003 の追加の順番を Bike Light → Backpack → Onesie（商品IDでは 0→4→2）に変え
  （それまでの順は商品名の降順そのもので、商品名の逆順に並ぶ不具合を見つけられなかったため）、
  TC-CART-010 の前提を、TC-CART-003 と同じく商品一覧画面での追加で作る形に変えた
  （保存領域への書き込みで作ると、画面で追加した内容が保存されない不具合を見つけられないため）。
  TS版の Checkout と Logout のテストへの反映は、それぞれの画面のテストを揃えるとき（横展開3-4・3-5）に行う予定。
- 追記（2026-11-21）: TS版の Checkout Step One のテスト（typescript/tests/ui/checkout/checkout-step-one-*.spec.ts）も、
  同じ方式で前提の状態を作るようにした。カートの中身はブラウザの保存領域へ直接書き込み（書き込む処理は CartPage.setCartContents の
  1か所だけ）、Checkout Step One画面は URL で開く（CheckoutFlow の openStepOneWith）。
  あわせて両版とも、Checkout Step One画面を開いた後に、カートアイコンのバッジの件数が入れた件数と同じことを確かめるようにした
  （本画面には商品の行がなく、カートが空でも先へ進めるため、書き込みが効かなくてもテストが成功してしまうのを防ぐ）。
  Python版は open_step_one_with に入れたので、それを経由する Step Two・Complete のテストの前提づくりにも効く。
  TS版の Step Two・Complete と Logout のテストへの反映は、それぞれのテストを揃えるときに行う予定。
- 追記（2026-11-21）: TS版の Checkout Step Two のテスト（typescript/tests/ui/checkout/checkout-step-two-*.spec.ts）も、
  同じ方式で前提の状態を作るようにした。Step Two画面は URL で直接開かず、Step One を開いて購入者情報を入れ、
  Continue を押して開く（CheckoutFlow の openStepTwoWith。Step One の前提づくりを経由するので、バッジの件数の確認も効く）。
  前提を作った後に、Step Two画面が表示されていることを確かめる。
  あわせて両版とも、TC-CO2-003 の順番を Bike Light → Backpack → Onesie（商品IDでは 0→4→2）に変えた
  （それまでの順は商品名の降順と価格の昇順に当たり、その順に並ぶ不具合を見つけられなかったため）。
  TS版の Complete と Logout のテストへの反映は、それぞれのテストを揃えるときに行う予定。
- 追記（2026-11-22）: TS版の Checkout Complete のテスト（typescript/tests/ui/checkout/checkout-complete-*.spec.ts）も、
  同じ方式で前提の状態を作るようにした。Complete画面は URL で直接開かず、Step Two の前提づくり（openStepTwoWith）を経由して
  Finish を押して開く（CheckoutFlow の openCompleteWith。バッジの件数と Step Two画面の確認も効く）。
  前提を作った後に、Complete画面が表示されていることを確かめる。
  これで TS版の Checkout のテストは、すべてこの方式になった。商品一覧画面の操作で前提を作っていた古いテスト（checkout-success.spec.ts）と、
  そのための部品（utils/checkoutHelper.ts、CheckoutFlow の古い操作、InventoryPage の addFirstItem・addAllItems）は削除した。
  消したものは、CheckoutFlow の addSingleItem・addMultipleItems・addItems・goToCart・startCheckout・verifyOrderComplete、
  確認の部品の expectCheckoutComplete、InventoryPage の allAddToCartButtons・addFirstItem・addAllItems、
  CheckoutCompletePage の completeHeader・expectCompleteHeaderVisible、utils/checkoutHelper.ts。
  古いテスト6件は名前（削除後購入・再追加後購入など）どおりの操作をしておらず、確かめていた内容（完了画面への遷移と見出し）は
  TC-CO2-007・TC-CO3-001 で確かめているため、古いテストを消しても確かめる範囲は減らない。
  画面での追加から購入完了までを1本で通すテストは、今はない。両版に1件足す（テストケースも足す）ことを、別のプルリクエストで行う。
  あわせて両版とも、TC-CO3-004 で Back Home の後に、商品一覧画面であることを確かめてから、カートの状態を確かめるようにした。
  TS版の Logout のテストへの反映は、そのテストを揃えるとき（横展開3-5）に行う予定。
- 追記（2026-11-22）: TS版の Logout のテスト（typescript/tests/ui/logout/）も、同じ方式で前提の状態を作るようにした。
  Cart画面から始めるテスト（TC-LOGOUT-005。カートは空）と、カートの中身が必要なテスト（TC-LOGOUT-010）は、
  Cart の前提づくり（CartFlow の openCartWith）でカート画面を開き、
  Checkout Complete画面から始めるテスト（TC-LOGOUT-006）は、Complete の前提づくり（CheckoutFlow の openCompleteWith）で開く。
  これで、TS版でもカートの中身を前提に使う画面のテストは、画面での追加そのものを確かめる TC-CART-003・010 を除き、すべてこの方式になった。
- 追記（2026-11-23）: 画面での追加から購入完了までを1本で通すテスト（TC-FLOW-001）を、両版に足した（論点28）。
  このテストは、ログイン済みの画面を用意した後は、この方式（保存領域への書き込み・URL での直接表示）を使わず、すべて画面の操作でつなぐ。

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
- TS逆輸入候補: 反映済み（横展開2-4）。
  TS版の CheckoutPage.ts の中を CheckoutStepOnePage / CheckoutStepTwoPage / CheckoutCompletePage の3クラスに分けた
  （ファイル名は変えない）。操作のメソッドはボタンを押す・入力するだけにし、移った先の画面の確認は Flow から
  各画面の expectOnPage() を呼ぶ。「Checkout を始める」（カート画面の Checkout ボタン）は CartPage.clickCheckout() に移した。
  完了メッセージの確認（expectCompleteHeaderVisible）は、今のテストが確かめている内容を減らさないため残した
  （当初は「あり（TS版も CheckoutPage.ts の中を画面ごとのクラスに分けるだけで同じ構造にできる）」としていた）
- 決定日: 2026-11-08
- 追記（2026-11-15）: Checkout Step Two・Checkout Complete の移植で CheckoutStepTwoPage・
  CheckoutCompletePage を追加し、3クラス（CheckoutStepOnePage／CheckoutStepTwoPage／
  CheckoutCompletePage）とも pages/checkout_page.py に実装済み。
- 追記（2026-11-22）: TS版の完了メッセージの確認（expectCompleteHeaderVisible）は削除した。
  見出しは Complete画面の表示の確認（TC-CO3-001）で文言まで確かめるようにしたため、確かめる範囲は減っていない。

## 論点17: メニューの開閉の判定方法

- 分類: ②
- 判断: 変更（TS版の MenuPage は表示されているかどうか〈isVisible〉で開閉を判定しているが、
  Python版は aria-hidden 属性で判定する）
- 理由: URL で開いた直後の画面では、閉じているメニューの Logout も「表示されている」と
  判定されることを実機で確認した。表示の有無では開閉を正しく判定できないため
  （判断基準4：テストの再現性）。
- 影響範囲: pages/menu_page.py（MenuPage）、flows/logout_flow.py、
  utils/ui_assertions/logout_assertions.py、tests/ui/logout/。
  TS版は typescript/pages/MenuPage.ts・flows/LogoutFlow.ts・utils/uiAssertions/logoutAssertions.ts・tests/ui/logout/
- TS逆輸入候補: 反映済み（部品は横展開2-4、テストは 2026-11-22）。
  TS版の MenuPage も、メニュー領域（.bm-menu-wrap）の aria-hidden 属性で開閉を判定するようにした（expectMenuOpened）。
  openMenu() はメニューボタンを押して開いたことを確かめ、logout() は Logout を押すだけにした
  （「開いていなければ開く」の判定とログイン画面の URL の確認をやめ、LogoutFlow がログイン画面の expectOnPage() を呼ぶ）。
  当初は「あり」としていた
- 決定日: 2026-11-09
- 追記（2026-11-22）: TS版の Logout のテストを、両版共通のテストケース（10件）に揃えた（typescript/tests/ui/logout/logout-*.spec.ts）。
  あわせて MenuPage の操作を、Python版と同じく押すだけの形（メニューを開くボタン・×ボタン・Esc キー・All Items・Logout）にし、
  メニューが開いたことの確認は LogoutFlow の openMenu で行う。メニューの項目を押す操作（logout・openAllItems）は、必ず openMenu を経由する。
  メニューが閉じていることの確認（expectMenuClosed）と、項目の並びの確認（expectMenuItems）を足した。
  項目の名前は画面のラベルなので、TS版では MenuPage に書いた（Python版はテストに書いている）。
- 追記（2026-11-22）: 画面を開いた直後（約0.5秒の、メニューが閉じる動きの間）にメニューを開くと、aria-hidden は "false"（開いた扱い）になるのに、
  閉じる動きの終わりにメニュー領域が隠され、項目が見えないまま押せなくなる競合があった。
  起きたブラウザ：直す前に、TS版の Logout のテスト（30件）を手元で2回流したとき、Cart画面を開いた直後のテストで
  Chromium（TC-LOGOUT-010）と Firefox（TC-LOGOUT-005）で1回ずつ時間切れになった。
  原因まで確かめたブラウザ：Firefox の回のトレースで、押した後に開いた扱い（aria-hidden="false"）のまま隠れていることを確かめた。
  閉じる動きの時間（URL で開いてから約0.5秒後に隠れる）は Chromium で測った（Chromium の回のトレースは、次の実行で上書きされて見ていない）。
  両版とも、次のように直した。
  ・メニューを開くボタンを押す前に、閉じたメニューの項目が見えなくなるまで待つ（閉じる動きが終わると項目が見えない扱いになることを使う。
    固定の時間の待ちは使わない）
  ・「メニューが開いた」の確認を、aria-hidden が "false" であることに加えて、最初の項目が見えることでも確かめる
  項目が見えなければ開き直す、という直し方は選ばなかった。画面の不具合（開いても項目が出ない）を隠すおそれがあるため。
  この競合は、仕様書（logout_spec.md）の「判断できない挙動」に記録した。
  直した後に Logout のテストを3ブラウザで5回ずつ（150件）流したところ、WebKit の TC-LOGOUT-006 で1回、同じ競合が残った
  （起きたブラウザは WebKit。原因はその回のトレースで確かめた）。
  Finish で画面の中で Complete画面へ移った直後にも、閉じる動きがやり直されることがあり、開く前の待ちでは、やり直しの前の瞬間を見分けられない
  （前の画面の閉じ終わった状態が残っている間に、待ちが通ってしまう）。
  見た目の指定に使う名前（クラス）や style の値に頼らずに、閉じる動きのやり直しを見分けられる目印は見つかっていない。
  調べた手段：失敗した回のトレースの、操作の前後の画面の記録（メニュー領域の aria-hidden・hidden・style）、
  Finish の後のメニュー領域の属性を 25ミリ秒ごとに読む一時的な処理（Chromium 1回・WebKit 5回。いずれも変化なし）、
  Complete画面へ移った直後にメニューを開く一時的な処理（WebKit 10回。失敗0回、うち2回は移った直後に項目が見えていた）。
  この残る競合は、記録して受け入れることにした。起きてもまれで（150件中1件）、
  起きたときは、メニューを開いた確認（最初の項目の表示）で、原因が分かる形で失敗するため。
  Complete画面を開き直して前提を作る案は選ばなかった（購入せずに開く・PDF出力ボタンが消えるなど、判断できない挙動に触れるため）。
  項目が見えないときだけ開き直す案も選ばなかった（メニューが本当に開かない不具合を隠すおそれがあるため）。
  起きたときに既知の競合だと分かるように、最初の項目の表示の確認には「メニューは開いた扱いだが項目が表示されない（logout_spec.md の判断できない挙動）」
  という説明を付けた（両版）。
  見直す目安：CI の結果（HTML レポート）で、再実行で成功したテストのうち「メニューは開いた扱いだが項目が表示されない」の説明で失敗した回を、
  プルリクエストごとに確かめる。直近10回の CI の実行で2回以上あれば、扱いを見直す。
  Firefox の準備の長さによる時間切れ（論点27）も再実行で成功するが、失敗の説明が違う（制限時間を超えた、と出る）ので区別できる。

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
- TS逆輸入候補: 反映済み（横展開2-3・2-4）。
  商品一覧画面の表示確認を InventoryPage.expectOnPage()（URL の完全一致と [data-test="inventory-list"] の表示）に
  まとめ、LoginPage.expectOnInventoryPage() を削除した（LoginFlow・auth.setup.ts・loginFixture.ts の loggedPage は
  InventoryPage.expectOnPage() を使う）。
  2-4 で、画面の移動の後に URL の部分一致（/inventory/）を確かめていた箇所（CartPage.continueShopping・backToInventory、
  CheckoutPage の Step Two の Cancel）をやめ、Flow から InventoryPage.expectOnPage() を呼ぶ形にした（当初は「あり」としていた）
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
- 追記（2026-11-25）: TS版も同じ作り（テストごとに 127.0.0.1 の空いているポートで小さなサーバーを立てる）にした（横展開4-1 の2つ目のプルリクエスト）。
  サーバーは Node の標準の機能（node:http）で作り、MSW と tests/setup/msw.setup.ts、package.json の msw は消した。
  ファイルは Python版と1対1で見比べられる並びにした（mocks/server.ts・handlerTypes.ts・mockData.ts・handlers/ の5つ）。
  ふるまい（返す値・状態コード・判断の順番）は Python版のハンドラーと同じにした。本文なしの POST は、両版とも「値がない」として扱い、
  Cart・Checkout は 400 を返す（作り直す前の TS版は、本文の読み取りで例外になり 500 を返していた）。
  登録していないメソッド・パスは、両版とも 404 {"error": "no mock handler"} を返す（作り直す前の TS版は、外の通信に流していた）。
  モックが返す値は、両版共通の shared/data/api_mock.json にまとめ、両版のモックがここから読む。テストの期待値は JSON から読まない
  （期待値とモックが同じ所を読むと、モックの値の誤りにテストが気づけないため）。
  理由：状態が混ざらないことを作りで保証できる（論点5-a、specs/api_testcases.md の観点 I-01）。Python版と1対1で見比べられる。
  登録していない通信が外へ流れなくなる。
  選ばなかった案：MSW のまま状態を戻す、MSW の書き方のままサーバーを立てる、担当ごとに1つのサーバーを立てる。
  状態を戻す処理に頼るか、Python版と作りが違ったままになるため。
  影響範囲（TS版）：mocks/（server.ts・handlerTypes.ts・mockData.ts・handlers/ の5つ）、fixtures/apiFixture.ts、utils/apiHelper.ts、
  tests/api/（読み込みと、使う部品の差し替えだけ）、tests/setup/msw.setup.ts（削除）、package.json・package-lock.json。
  影響範囲（Python版。ふるまいは変えていない）：mocks/mock_data.py（新規）、mocks/server.py・handlers/ の5つ（返す値を JSON から読む）

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

## 論点21: Visual Regression の方式

- 分類: ②
- 判断: 変更（TS版は Playwright 標準の toHaveScreenshot で比べる。Python版の Playwright には
  この機能がないため、比べる仕組みを自作する）
  1. 比較の仕組み：Pillow で自作する（外部の Visual 用プラグインは使わない）。
     赤・緑・青の差の最大値が 51（255 × 0.2）を超えた画素を「違う画素」とし、
     その割合が画面ごとの許容値（TS版と同じ）を超えたら失敗とする
  2. 基準画像：基準画像がない場合は、今の画像を test-results/visual/ に保存してテストを失敗させる
     （TS版と同じ流れ）。基準画像は CI（Linux）で作ったものだけを使い、自動で作り直す仕組み
     （--update-snapshots など）は用意しない
  3. 手元での扱い：普段の pytest では実行せず（pytest.ini の addopts で -m "not visual"）、
     pytest tests/visual -m visual と明示したときだけ実行する
  4. 待ち方：固定の待ち（sleep・wait_for_timeout）は使わない。画面の表示確認（expect_on_page など）
     ＋フォントの読み込み完了＋画像の読み込み完了を待ってから撮影する
  - あわせて、Login画面を開いて表示を確認するだけの操作がなかったため、LoginFlow に
    open_login_page() を追加した（flows/ への変更はこれだけ）
- 理由:
  1. 外部の Visual 用プラグインは更新が止まりやすい。Pillow は広く使われていて、
     TS版と同じ「違う画素の割合」の考え方を再現できる
  2. 基準画像がないのに成功扱いにすると、比べ忘れに気づけないため
  3. 基準画像は CI（Linux）で作るため、手元（Windows など）では描画の違いで失敗する。
     普段の pytest を手元で全部通るように保つため
  4. 固定の待ちは、環境によって足りなかったり無駄だったりするため。何が終わるのを待つかを明確にした
- 影響範囲: utils/visual_assertions/（image_comparison.py・screenshot_assertions.py）、
  tests/visual/（test_login_visual.py・test_inventory_visual.py・test_cart_visual.py・
  test_checkout_step_one_visual.py・test_checkout_step_two_visual.py・
  test_checkout_complete_visual.py）、tests/visual/__snapshots__/、flows/login_flow.py、
  pytest.ini、requirements.txt（Pillow）、.github/workflows/playwright.yml（python-visual-tests）
- TS逆輸入候補: 比較の仕組みは「なし」（TS版は Playwright 標準の toHaveScreenshot を使う）。
  手元での扱い・待ち方・前提状態の作り方は「検討」（TS版への横展開のときに判断する）
- 決定日: 2026-11-16

## 論点22: CI の OS を固定する

- 分類: ②
- 判断: 変更（ubuntu-latest ではなく ubuntu-24.04 に固定する）
- 理由: ubuntu-latest が Ubuntu 26.04 に切り替わり、TS版の Playwright 1.59.1 が対応していなかったため
  （TS版の3ジョブが「Install Playwright browsers」で
  「Playwright does not support chromium on ubuntu26.04-x64」となり失敗した）。
  また、Visual の基準画像（TS版・Python版とも Ubuntu 24.04 で撮影）と環境を揃え、
  OS の切り替えで突然壊れることを防ぐため。
  OS を上げるときは、Playwright のバージョンと Visual の基準画像の作り直しとあわせて、意図的に行う。
- 影響範囲: .github/workflows/playwright.yml の全ジョブ（TS版3つ、Python版3つ、Slack Notification）
- TS逆輸入候補: なし（共通のファイルのため）
- 決定日: 2026-11-17

## 論点23: 完成形の構成と公開範囲

- 分類: ②
- 判断: 変更
  1. TS版をリポジトリ直下から typescript/ へ移す（横展開1で実施）
  2. 完成形の構成
     - 直下：README.md・UPDATELOG.md・decisions.md（公開。両版共通。横展開5で1つにまとめる）
     - specs/：仕様書・テストケース（両版共通。横展開1で python/specs/ から移す）
     - shared/：テストデータ・URL・エラー文言・APIモックの返事（JSON。横展開2で作る）
     - typescript/：TS版のコード
     - python/：Python版のコード
  3. 公開しないファイル：CLAUDE.md、backlog.md、auth.json（decisions.md は公開のまま）。
     構築中に一時的に公開していたものとして扱い、今後は公開しない。過去の履歴は書き換えない
  4. 公開しないファイルの保管：別の非公開リポジトリ（例：playwright-demo-internal）で管理する
     - 公開リポジトリのフォルダの中（例：internal/）に置き、公開リポジトリ側では .gitignore で除外する
     - Claude Code に CLAUDE.md を今までどおり読ませる方法は、横展開1で確認して決める
     - 非公開リポジトリの作成はユーザーが GitHub で行う
- 理由:
  1. 「極力 Python版と同じ形・構成にしたい」意向に合わせ、python/ と対になる構成にするため。
     調査の結果、TS版の import はすべて相対パスで、移しても中身の書き換えは不要。
     直す必要があるのは外側から TS版を指している箇所（CI、直下の .gitignore、Dockerfile、README・Wiki のリンク）だけ
  2. 言語に関係なく共通にできるものは共通のファイルにする方針
     （backlog.md「TS版への横展開のときに扱うもの」）を形にするため
  3. 第三者が見ることを想定すると、作業用のファイル（AI への作業指示、作業メモ、ログイン状態の保存ファイル）は
     見せる必要がないため。decisions.md は設計判断の経緯で、見せたい内容のため公開する
  4. PC が壊れても残り、変更履歴も含めて、後から公開リポジトリに取り込み直せるようにするため
- 影響範囲: リポジトリ全体の構成、.github/workflows/playwright.yml、直下の .gitignore、
  Dockerfile・.dockerignore、README・Wiki のリンク
- TS逆輸入候補: なし（リポジトリ全体の構成のため）
- 決定日: 2026-11-17

## 論点24: テストデータの共通化

- 分類: ②
- 判断: 変更（テストデータを両版共通の JSON にまとめ、TS版・Python版の両方から読み込む。横展開2-1）
  1. 置き場所：リポジトリ直下の shared/data/ に users.json・products.json・checkout.json・urls.json・messages.json を置く
  2. JSON の項目名は Python版と同じ書き方（first_name など）にする。
     TS版は読み込むファイルで TS の書き方（firstName など）に変換する
  3. 今のデータのファイル（Python版：data/users.py・products.py・checkout_data.py、utils/urls.py。
     TS版：data/users.ts・checkoutData.ts、utils/urls.ts）は残し、中身を「JSON を読み込んで、今と同じ名前・同じ形で渡すだけ」にする。
     テスト側の import や書き方は変えない
  4. 値の違いは次のように揃える
     - 購入者情報の郵便番号は Python版の値（1000001）にする（TS版の 1234567 は使わない）
     - ログインユーザーは、Python版の4種類に、TS版だけが使っている「ユーザー名・パスワードとも誤り」を
       wrong_both として加える。TS版の users.invalid はこれを指す
     - URL は Python版の7画面分にする。TS版にも商品詳細（inventoryItem）が増えるが、今は使わない
  5. エラー文言：Python版のテストに直接書いていたエラー文言を messages.json にまとめ、Python版のテストはそこから読む
     - 未ログインのときの文言は、画面のパスを {path} に差し込む1つの文言にする
     - TS版は今回は使わない（横展開3で使う）
  6. API のデータ（data/api/、data/apiUsers.ts など）は今回は変えない（横展開4-1 で扱う）
- 理由:
  1・3. 論点23 で決めた完成形の構成（shared/ に共通データ）に合わせるため。
     テスト側を変えずに済むように、今のデータのファイルを入り口として残す
  2. JSON は両版で1つなので、どちらかの書き方に決める必要がある。
     Python版の書き方は、Python版の今のデータとそのまま一致し、変換が要らない
  4. 両版で同じ値を使うため。郵便番号は Python版の値がテストケース
     （checkout_step_one_testcases.md の「入力に使う値」）と一致している
  5. 同じ文言が別のファイルに重複していたため（未ログインのエラー、Postal Code is required）。
     置き換えた後の文言が、置き換える前と一字一句同じであることを確かめた
  6. API のモックの方式が両版で違い、データの形も揃っていないため、方式を揃えるかの判断（横展開4-1）とあわせて扱う
- 補足（TS版の読み込み方）:
  TS版は package.json が "type": "module"（ESM）のため、JSON の import に with { type: 'json' } が必要になる。
  あわせて tsconfig.json を ESM に合わせて直した（module: CommonJS → ESNext、moduleResolution: Node → Bundler、
  rootDir を削除、include に ../shared/data/*.json を追加）。
  JSON から読み込んだ値は as const のような「値そのものの型」にならないため、読み込むファイルで型を書き添える。
  tsconfig.json の設定の食い違いは論点8（tsconfig.json の設定不整合）にも関係する
- 影響範囲: shared/data/、Python版 data/・utils/urls.py・エラー文言を使うテスト（9ファイル）、
  TS版 data/users.ts・data/checkoutData.ts・utils/urls.ts・tsconfig.json
- TS逆輸入候補: なし（両版共通のため）
- 決定日: 2026-11-18
- 追記（2026-11-20）: wrong_both は横展開3-1 で削除した。TS版の Login のテストを両版共通のテストケースに揃え、
  「ユーザー名・パスワードとも誤り」のテスト（仕様書で対象外にしたもの）をなくしたため、使われなくなった。
  あわせて、TS版もエラーの文言を messages.json から読むようにした（typescript/data/messages.ts）

## 論点25: CI の実行環境

- 分類: ②
- 判断: 変更（UI・API・Visual の6ジョブすべてを Playwright 公式の Docker イメージで動かす）
  1. UI Tests (TS)・API Tests (TS)・Visual Tests (TS)：mcr.microsoft.com/playwright:v1.59.1-noble
     （typescript/package-lock.json の Playwright のバージョンに合わせる）
  2. UI Tests (Python)・API Tests (Python)・Visual Tests (Python)：
     mcr.microsoft.com/playwright/python:v1.63.0-noble
     （python/requirements.txt の playwright のバージョンに合わせる）
  3. 6ジョブの「Install Playwright browsers」とブラウザのキャッシュのステップは削除する
     （イメージにブラウザと部品が入っているため）。書き方は Playwright 公式ドキュメントの
     「Continuous Integration」の GitHub Actions のコンテナの例に従う（TS版は options: --user 1001）
  4. Python のジョブは、--user 1001 を外して（root のまま）動かす。
     Python 3.14 は uv（astral-sh/setup-uv@v10.3.3）で準備し、python/ に仮想環境（.venv）を作って
     requirements.txt のパッケージを入れ、その環境の Python（.venv/bin/python -m pytest）でテストを実行する（2026-11-19）
     - 経緯1（2026-11-18）：当初は setup-python を使っていたが、Python 用のイメージに lsb_release が入っておらず
       「Setup Python」が失敗したため、--user 1001 を外し、setup-python の前に apt-get で lsb-release を入れた
     - 経緯2（2026-11-18）：setup-python が用意した pip・pytest のコマンドがコンテナの中で起動できなかったため、
       python -m で実行した（pip のキャッシュは使わない）
     - 経緯3（2026-11-19）：Python のジョブは、setup-python が必要とする lsb_release の apt でのインストールに
       数分かかることがあったため、uv で Python 3.14 を準備する形に変えた。apt と setup-python は使わない
     - setup-uv は v8 以降メジャーバージョンだけのタグ（@v10 など）がないため、細かい版のタグ（@v10.3.3）で指定する
  5. Node.js 22 は、今と同じ準備のステップ（setup-node）で入れる
  6. Visual の2ジョブも、当初は基準画像の見た目がずれるのを避けるため今のままとしたが、
     Ubuntu の部品のダウンロードで引き続き遅れていたため、イメージで動かすことにした。基準画像は変えない
- 理由: 毎回の Ubuntu の部品のダウンロードが遅く、CI が10分以上かかることが続いたため
- 確認: 基準画像との見た目のずれがないことを、プルリクエストの CI で確かめた（両版とも基準画像の作り直しは不要だった）
- 結果: CI 全体の所要時間は、10分以上かかることが続いていたのが、約1分40秒になった（2026-11-18）
- 注意: Playwright のバージョンを上げるときは、イメージのバージョンも同時に上げる
  （ずれるとブラウザが見つからない。横展開4-3、Dependabot の検討とあわせて）
- 影響範囲: .github/workflows/playwright.yml（ui-tests・api-tests・visual-tests・python-ui-tests・
  python-api-tests・python-visual-tests）
- TS逆輸入候補: なし（共通のファイルのため）
- 決定日: 2026-11-18

## 論点26: TS版の型の確認

- 分類: ②
- 判断: 変更（TypeScript を devDependencies に入れ、CI の独立したジョブで tsc --noEmit を実行する）
  1. typescript/package.json の devDependencies に TypeScript 7.0.2 を固定のバージョンで入れる
     （--save-exact。入れた時点の最新の安定版で、型のエラーが0件であることを確かめた）
  2. scripts に "typecheck": "tsc --noEmit -p tsconfig.json" を追加する
  3. CI に独立したジョブ「Type Check (TS)」（ts-typecheck）を追加する。ブラウザは使わないため container は使わない。
     Slack 通知の needs・失敗の判定・Results（所要時間を含む）にも追加する
- 理由: tsconfig.json と package.json の設定の食い違い（論点8）に、型の確認がなかったため長く気づけなかった
- 影響範囲: typescript/package.json・package-lock.json、.github/workflows/playwright.yml（ts-typecheck、notify）
- TS逆輸入候補: なし。Python版の型の確認（mypy など）は、Lint・整形とあわせて別に検討する
- 決定日: 2026-11-18

## 論点27: ログイン状態の期限切れ対策

- 分類: ②
- 判断: 変更（TS版は worker ごとにログイン状態を作り、作ってから8分を過ぎたら作り直す。
  setup の準備用のプロジェクトはなくす。手元の trace・video は失敗したときだけ残す）
  （2026-11-23 追記）ログイン状態の作り直しとログイン済みの画面を開く部品に、テストとは別の制限時間を付ける
  1. fixtures/loginFixture.ts：同時に動く担当（worker）ごとに、playwright/.auth/standard_user-〈ブラウザ名〉-〈parallelIndex〉.json を使う。
     ファイル名にブラウザ名を含めるのは、ブラウザによって保存される Cookie の属性が違い（WebKit は sameSite: None・
     secure: false で保存し、Chromium はそれを受け付けない）、別のブラウザが作ったファイルは使えないため。
     parallelIndex だけで分けたところ、WebKit が作ったファイルを Chromium が使って、ログイン画面に戻されることを確かめた
     テストごとにファイルを作ってからの時間を確かめ、ファイルがない、または8分を過ぎていたら、
     テスト用の画面とは別の一時的な context でログインし直してファイルを作り直す（作り直しの処理は1か所にまとめる）。
     8分は、確かめのときだけ環境変数 STORAGE_STATE_MAX_AGE_MINUTES で短くできる
  2. 形は Playwright 公式ドキュメント（Authentication の「worker ごとにアカウントを使う」例）に沿い、時間の確認と作り直しを足した。
     公式の例は、ファイルがあれば古くても使い回すため、そのままでは期限切れを防げない
  3. playwright.config.ts：準備用のプロジェクト（setup）と UI の3プロジェクトの dependencies を削除し、
     tests/setup/auth.setup.ts を削除する。trace・video は手元でも retain-on-failure にする（workers・retries などは変えない）
- 理由: saucedemo のログイン状態（Cookie の session-username）が約10分で切れ、TS版のテストが増えると
  実行が10分を超えるため（setup で最初に1回だけログインする形では、後半のテストがログイン画面に戻されて失敗する）。
  テストのたびのログイン（遅い）や、Cookie の期限の書き換え（アプリの決まりをごまかす形）は選ばなかった。
  手元の trace・video を常に残すと実行が遅くなるため（測った根拠はない）、CI と同じく失敗したときだけ残す
- Python版: テストの実行全体で1回だけログインする今の形のまま（手元でも約3分で終わるため）。
  実行が10分に近づいたら、TS版と同じ形に揃える
- 影響範囲: typescript/fixtures/loginFixture.ts、typescript/playwright.config.ts、typescript/tests/setup/auth.setup.ts（削除）
- TS逆輸入候補: なし（TS版の対策）。Python版への反映は上のとおり
- 決定日: 2026-11-19
- 追記（2026-11-22）: Firefox では、テストの前の準備（ログイン状態の作り直し、閲覧環境を作る処理）が長く、制限時間（30秒）を超えることがある
  （Logout のテストを3ブラウザで5回ずつ流したとき、ログイン状態の作り直しに 18.4秒、閲覧環境を作るのに 15.3秒・ページを作るのに 8.4秒かかった回が
  時間切れになった）。全画面を揃えた後に、制限時間と作り直しの置き場所を見直す。
- 追記（2026-11-23）: 上の「全画面を揃えた後に見直す」について、テストの時間の内訳（UI テスト全体のトレース）と、
  Playwright の処理の中身を調べ、次のように見直した。
  ・測定の出どころ（どれも手元。CPU 4つ、並列の数は初期値の2）：
    ①11-22 の Logout の測定：Logout のテストを3ブラウザで5回ずつ、再実行なしで流した（150件）
    ②11-22 の TC-CO3-001 の測定：Firefox で5回、トレースを残して流した（5回とも成功し、時間切れは0回）
    ③11-22 夜の UI テスト全体の測定：3ブラウザで2回、トレースを残して流した（1回目はトレースの移動に失敗して、内訳が失われた。下の値は2回目）
    ④11-23 の測り直し：B の後に、Firefox の UI テスト全体を1回（トレースは失敗したときだけ）
  ・調べた結果：
    手元の Playwright 1.59.1 の処理の中身で確かめたところ、テストごとの準備の部品（ログイン状態の作り直し、ログイン済みの画面を開く処理、
    Playwright 自身の閲覧環境・ページを作る処理）は、別の制限時間を付けなければテストの制限時間に数えられる。
    ブラウザの起動と、並列の単位ごとの準備の部品は数えられない（並列の単位ごとの部品は、プロジェクトの制限時間と同じ長さの、別の枠で動く）。
    ③では、Firefox が全体の約57%を占め、Firefox の1件の準備（平均6.7秒）が本体（平均4.0秒）より長かった（どちらも77件あたりの平均）。
    Firefox の内訳：ログイン状態の作り直しは3回で平均8.9秒・最大11.7秒（回数あたり）、ログイン済みの画面を開く処理は平均3.6秒・最大8.2秒
    （この部品を使う64件あたり）、閲覧環境を作る処理は平均1.6秒、ページを作る処理は平均1.5秒（77件あたり）、本体の最大は11.63秒。
    そのほかの測定では、ログイン状態の作り直しが ① で最大18.4秒、② で最大14.3秒だった。
    ③の1回目では、Firefox の TC-CO3-001 が43.4秒で時間切れになったが、トレースが失われ、原因の内訳はわかっていない。
    CI の直近5回（main への push）では、UI Tests (TS) は2分41秒〜3分40秒で、再実行で成功したテストも失敗もなかった。
  ・直し方：ログイン状態の作り直しの部品（storageState）と、ログイン済みの画面を開く部品（loggedPage）に、テストとは別の制限時間（30秒）を付けた（B）。
    長さは、作り直しの最大（① の18.4秒）と画面を開く処理の最大（③ の8.2秒）より長くした。
    画面を開く部品も30秒にしたのは、値を1つにまとめ（typescript/utils/timeouts.ts）、テストの制限時間とそろえて、
    本当に止まったときに、テストと同じくらいの時間で気づけるようにするため。
    遅すぎるときは、時間切れが部品の名前つきで出るので、テストの本体の遅さと区別できる（下の「確かめ」）。
  ・B で外れる分と残る分（③ の Firefox の値から計算）：外れるのは、画面を開く処理（この部品を使う64件で平均約3.6秒。
    77件あたりに直すと約3.0秒）と、まれな作り直し（3回、1回平均8.9秒）。
    残るのは、閲覧環境とページを作る処理（77件あたり約3.1秒＝1.6秒＋1.5秒）で、テストの制限時間に数えられたまま残る。
    ① の例（閲覧環境を作る 15.3秒、ページを作る 8.4秒）では、本体に使えるのは約6秒しか残らず、Firefox の本体の最大（11.63秒）を考えると、
    同じ条件では今でも時間切れになりうる。B は時間切れが起きる頻度を下げる見込みで、防げるのは作り直しと画面を開く処理の遅さによるものだけ。
  ・B で変わること：
    1件の時間の上限は、実質的に延びる（作り直し・画面を開く処理がそれぞれ最大30秒、そのうえに閲覧環境・ページを作る処理と本体で30秒）。
    ログインしてから商品一覧を開くまでの遅さに、テストの時間切れとして気づく力は下がる（部品の制限時間の30秒を超えるまで失敗しない）。
    テストの中で制限時間を変えても（test.setTimeout など）、この2つの部品には効かない。
  ・確かめ（2026-11-23）：手元で一時的にログイン済みの画面を開く部品の制限時間を1ミリ秒にして、Chromium で TC-PROD-001 を1件流した。
    結果は時間切れ（timedOut）で、表示は「Fixture "loggedPage" timeout of 1ms exceeded during setup.」だった。
    ログイン状態の作り直しの部品も、制限時間を1ミリ秒にし、環境変数 STORAGE_STATE_MAX_AGE_MINUTES を短くして作り直しが起きるようにして、
    同じテストを1件流した。結果は時間切れ（timedOut）で、表示は「Fixture "storageState" timeout of 1ms exceeded during setup.」だった
    （作り直しの途中〈一時的な閲覧環境を作る所〉で止まったことも、表示で確かめた）。2つの部品とも、部品の名前つきで時間切れになる。
    どちらも、確かめた後は元に戻した。
    公式の説明：https://playwright.dev/docs/test-timeouts（Fixture timeout）、https://playwright.dev/docs/test-fixtures
  ・選ばなかった案：
    作り直しを並列の単位ごとの準備に移す案（A）は、ログイン状態が約10分で切れ、手元の Firefox では1つの並列の単位が10分近く動くため、
    途中の作り直しをテストごとに残すことになり、仕組みが2か所に分かれるため。ただし、この理由は手元の Firefox の話で、
    CI（UI Tests (TS) は3分前後）では成り立たない。
    手元の並列の数を決める案（C）は、今も初期値で2並列で、Firefox だけを2並列で流しても差が小さく、効き目が見えなかったため。
    2並列と1並列は比べていない。
    制限時間を延ばす案（D）は採らない。本当に止まったときに気づくのが遅れ、遅い原因も残るため。
    B で延びるのは2つの部品の中で止まった場合だけで、どこで止まったかは部品の名前でわかるが、D はテストのどこで止まっても気づくのが遅れる。
  ・測り直し（④）：77件すべて成功。1件の時間は中央 8.9秒・最大 26.1秒、20秒を超えたのは2件（③の Firefox は、中央 12.1秒・最大 21.7秒・20秒超 3件）。
    ③ はすべてのテストのトレースを残し、④ は失敗したときだけ残す条件で流したため、1件の時間はそのままでは比べられない。
    1回だけの測定で、B の効き目を示す根拠としては弱い。B は時間の数え方を変えるもので、速くするものではないため、1件の時間の差は回ごとのばらつきと見ている。
    20秒を超えた2件の時間には、別の制限時間にした部品の時間も入っているので、テストの制限時間に数えられる分はそれより短いと見ている（その分は測っていない）。
  ・残ること・時間切れが続いたときの候補：
    閲覧環境・ページを作る処理の遅さによる時間切れは残る。時間切れが続いたときは、まず Firefox のプロジェクトだけ制限時間を延ばす
    （本当に止まったときに気づくのが遅れる範囲を、Firefox だけに絞れる）。あわせて、録画を切った場合に閲覧環境を作る時間が変わるか、
    1並列と2並列で変わるかを比べる。
- 影響範囲（追記）: typescript/utils/timeouts.ts（新規）、typescript/fixtures/loginFixture.ts、typescript/playwright.config.ts（制限時間の読み込みと説明文）

## 論点28: 通しの購入のテスト

- 分類: ②
- 判断: 変更（両版に、商品の追加から購入完了までを1本で通すテスト TC-FLOW-001 を1件足す。テストケースは specs/purchase_flow_testcases.md）
  1. 前提の状態は、ログイン済みで Products画面を開いた状態だけを、ログイン済みの画面を用意する部品で作る。
     カートの中身は Products画面の Add to cart で入れ、Cart画面・Checkout Step One画面・Checkout Step Two画面・Checkout Complete画面は、
     前の画面のボタンやアイコンを押して開く。
     ブラウザの保存領域への書き込み（CartPage.setCartContents／set_cart_contents）と、URL での直接表示は使わない
  2. 追加の順は、TC-CART-003・TC-CO2-003 と同じ Bike Light → Backpack → Onesie にする。商品名・商品の番号（0→4→2）・価格（$9.99→$29.99→$7.99）の
     どの昇順・降順にも当たらないため、追加した順のまま Cart画面と Checkout Step Two画面に引き継がれていることを区別できる
  3. 画面が移るたびに、中身（並び順・金額）より先に、移った先の画面であることを確かめる。
     バッジが表示されないことは、Checkout Complete画面であることを確かめた後に確かめる
     （バッジがないことは、Finish の後に Checkout Complete画面以外のバッジのない画面へ移っても成り立つため）
  4. Checkout Step Two画面の金額（Item total: $47.97、Tax: $3.84、Total: $51.81）は、2026-11-23 に手元で Playwright調査用スクリプト（Chromium）を使い、
     テストと同じ手順で画面を操作して、表示された値を確かめた。テストには、計算で作らず、テストケースと同じ値を書く（TC-CO2-004〜006 と同じ）。
     手順1のバッジの件数も、追加する商品を変えたときに、テストケースを直さないまま成功しないように、追加する商品の数から作らず、
     期待結果と同じ値（3）をテストに書く
  5. 部品は今あるものだけを使い、新しいメソッドは足していない。
     画面ごとの確認の部品を使い分けると、同じ名前の確認を2つ、別名で読み込むことになり、その形は既存のテストにないため、
     バッジの確認は、Products画面・Checkout Complete画面とも Checkout の確認の部品で行う
     （TC-CO3-004 も、Back Home の後の Products画面のバッジを Checkout の確認の部品で確かめている）
  6. 確かめる範囲は、購入を完了した直後の Checkout Complete画面でバッジが表示されないことまでとする。
     購入後にほかの画面へ移ってもカートが空のままであることは、TC-CO3-004・TC-CO3-005 で確かめているため、このテストでは確かめない
  7. テストの制限時間（30秒）に対して、手元で再実行なしの3回（2026-11-23）では、1回の最長は Chromium 4.9秒・Firefox 14.9秒・WebKit 8.1秒だった。
     この時間は Playwright が報告した1件ごとの時間で、ログイン済みの画面を用意する部品と、ログイン状態の作り直しの部品の時間は入っていない。
     この2つの部品はテストとは別の制限時間で動き（論点27）、手元の Playwright 1.59.1 の処理の中身では、報告する時間は、
     テストの制限時間に数える分（閲覧環境・ページを作る処理とテストの本体）と後片付けの分だけを足していて、別の制限時間で動く部品の時間は足していないため。
     最長の Firefox でも制限時間の半分ほどのため、このテストだけ制限時間を変えることはしない
- 理由: 画面ごとのテストは、前の画面の不具合で失敗しないように、前提の状態を保存領域への書き込みや URL での直接表示で作っている（論点15）。
  そのため、前の画面で操作した内容が次の画面に引き継がれない、といった画面と画面のつなぎ目の不具合を見つけられない。
  #25 のレビューで、通しの購入のテストがないことを指摘された（論点15 の 2026-11-22 の追記）。
  近道を使うと、確かめたいつなぎ目の操作をテストの外で済ませてしまうため、このテストでは使わない
- 画面ごとのテストとの役割の分け方:
  画面ごとのテストは、各画面の表示の細かい確認・入力の誤り・戻る操作・金額の組み合わせなどを、ほかの画面から切り離して確かめる。
  通しの購入のテストは、購入が完了するまでの1本の道筋で、画面と画面のつなぎ目（カートの中身と並び順の引き継ぎ、画面の操作で入れた中身からの金額、
  購入を完了した直後の Checkout Complete画面でバッジが表示されないこと）だけを確かめる。各画面の表示の細かい確認は、重ねて行わない。
  このテストが失敗し、画面ごとのテストが成功しているときは、つなぎ目の不具合を疑う
- 影響範囲: specs/purchase_flow_testcases.md（新規）、typescript/tests/ui/flow/purchase-flow.spec.ts（新規）、
  python/tests/ui/flow/test_purchase_flow.py・__init__.py（新規）。設定ファイル・既存のテストと部品は変えていない
- TS逆輸入候補: なし（両版に同時に足した）
- 決定日: 2026-11-23
