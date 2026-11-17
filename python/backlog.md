# バックログ（今後の作業候補）

## 今後の拡張候補

- 特殊ユーザー（problem_user、performance_glitch_user、error_user、visual_user）のテスト。
  TS版にも同時に反映する前提とする。
- 商品詳細画面（inventory-item.html）の中身の検証。
  Products画面からの遷移までは TC-PROD-009/010 で検証済み。
- Reset App State、Dynamic Catalog（Lazy Load・Spinner・Slider）、About、
  PDF出力（ダウンロードとPDFの中身）のテスト。

## 判断を保留している挙動

実機で確認したが、意図された仕様か不具合かを判断できないため、テスト対象に含めず保留している挙動。
詳細は各仕様書の「判断できない挙動」（Cart は「本仕様の対象外」）を参照。

### Login（login_spec.md）

- エラー時に、入力済みの欄も含めた両方の入力欄が赤表示になる
- 空白のみのユーザー名が未入力扱いにならない（認証情報不一致のエラーになる）
- ログイン済みでも Login画面の URL を開くと Login画面が表示される（ログイン状態は残っている）
- ログイン失敗後もパスワードの入力値が残る

### Cart（cart_spec.md）

- カートが空の状態で Checkout に進める

### Checkout Step One（checkout_step_one_spec.md）

- 空白のみの入力が通る
- 入力欄の Enter で Cancel が動く
- エラー時に入力済みの欄も赤表示になる

### Checkout Step Two（checkout_step_two_spec.md）

- 小計の桁あふれ（例：Item total: $59.980000000000004）
- Step One を経由せずに購入まで完了できる
- カートが空で $0 の購入ができる
- 空カートの小計だけが「$0」と表示される
- 購入完了後のブラウザの「戻る」で空の Step Two が表示される
- Step One の入力値が Step Two に表示されない

### Checkout Complete（checkout_complete_spec.md）

- 購入せずに Complete 画面を直接開ける
- PDF出力ボタンが再読み込み等で消える
- Complete の画像の読み込みの遅れ
- Back Home 後の「戻る」で Complete に戻る

### Logout（logout_spec.md）

- ログアウトしてもカートが消えない（共用のPCでは、次の利用者に前の利用者のカートが見える）
- メニューの外側のクリックで閉じない
- Products 画面で All Items を押してもメニューが開いたまま
- Reset App State で画面の表示が更新されない

## Stage 2-1 で扱うもの

- APIテスト：完了（2026-11-15）。127.0.0.1 で立ち上げるモックサーバーで18件を実装
  （api_spec.md・api_testcases.md、decisions.md 論点19）
- 見た目の比較テスト（Visual Regression）：完了（2026-11-16）。Pillow で自作した比較の仕組みで6件を実装し、
  CI で作った基準画像をリポジトリに入れた（visual_spec.md・visual_testcases.md、decisions.md 論点21）
  - フッターの年（「© 2026 Sauce Labs」）が変わると画像が変わり、基準画像の作り直しが必要になる
    （TS版も同じ）
- CI への組み込み：完了（2026-11-16）。既存の playwright.yml に Python版の画面・APIテストの
  ジョブを追加し、ジョブの表示名と古い実行の自動キャンセル（concurrency）を設定
  （decisions.md 論点20）
- ドキュメント（*.md）だけの push で CI を動かさない設定（paths-ignore）。
  TS版の CI の動きも変わるため、影響を確かめてから入れる
- Slack 通知の Branch が、プルリクエストでの実行時に「6/merge」のような一時的な名前になる
  （github.ref_name を使っているため。TS版の CI のころからの動き）。
  プルリクエストのときは元のブランチ名（github.head_ref）を表示する
- テストの接続先と URL の管理（今は utils/urls.py に絶対URLを固定。pytest-base-url は未使用）
- エラー文言をまとめるかどうか：今はテストファイルに直接書く運用で、別ファイル間で同じ文言が
  2組重複している（'/inventory.html' の未ログインエラー、Postal Code is required）。
  API層のエラー文言と合わせて、まとめるかどうかを決める
- Lint／Format ツールの導入（論点7）、商品データなどの型（論点6・9）
- 並列実行（pytest-xdist）を導入する場合の storage_state ファイルの書き込みの競合

## 全画面の移植後に整理するもの

- InventoryPage の商品画像の確認が CSS クラス（img.inventory_item_img）のまま残っている。
  data-test の有無を実機で確かめ、あれば置き換える
  （ロケータの書き方の混在のうち、LoginPage の id と .inventory_list はプルリクエスト #4 で解消済み。
  MenuPage の開閉ボタンの id とメニュー領域の CSS クラスは、data-test がないためそのまま使う）

## TS版への横展開のときに扱うもの

- 進め方（2026-11-16 決定）：次の段階で進める。各段階の流れはこれまでと同じ
  （調査 → 方針 → 4役レビュー → 実装 → 確認 → 記録）
  - 横展開0：方針と調査（下の「横展開0で決めたこと」）
  - 横展開1：構成の変更（typescript/ への移動など。CI・設定ファイルのパスも直す）
  - 横展開2：共通部品（ログイン状態の再利用、ロケータ、URL管理、表示確認の置き場所、データの共通化）
  - 横展開3：画面ごと（Login → Products → Cart → Checkout → Logout の順に、テストの中身を Python版に揃える）
  - 横展開4：API・Visual・CI（APIモックの方式、Visual の待ち方、Node.js のバージョン）
  - 横展開5：仕上げ（Wiki の修正、README・UPDATELOG などの文書を1つにまとめる）
- 揃える範囲：テストの中身（確かめる内容）まで Python版に揃える。
  TS版の UI テストの3ブラウザ（Chromium・Firefox・WebKit）は残す
- 仕様書・テストケース：TS版用には作らず、Python版のものを両版共通で使う
- 共通ファイル化：言語に関係なく共通にできるものは、すべて共通のファイルにする
  - 文書：README、UPDATELOG、CLAUDE.md、decisions.md、backlog.md、仕様書・テストケース、Wiki
  - データ：ログインユーザー、商品データ、購入者情報、URL、エラー文言、APIモックの返事
    （JSON など言語に関係ない形式にし、両版から読み込む）
  - 言語ごとに分けるもの：Page Object、Flow、テスト本体、比較の仕組み、設定ファイル
  - 要検討：Visual の基準画像（両版とも Linux の Chromium で撮影しているが、比較の方法が違うため、試して判断）
- 横展開0で決めたこと（2026-11-17、decisions.md 論点23）
  - TS版はリポジトリ直下から typescript/ へ移す（横展開1で実施）。
    TS版の import はすべて相対パスのため、中身の書き換えは不要。直すのは外側から TS版を指している箇所
    （CI、直下の .gitignore、Dockerfile、README・Wiki のリンク）だけ
  - 仕様書・テストケース（python/specs/）は、横展開1でリポジトリ直下の specs/ へ移す（両版共通）
  - 共通データ（テストデータ・URL・エラー文言・APIモックの返事）は shared/ に JSON で置く（横展開2で作る）
  - 完成形の構成
    - 直下：README.md・UPDATELOG.md・decisions.md（公開。両版共通。横展開5で1つにまとめる）
    - specs/：仕様書・テストケース
    - shared/：共通データ
    - typescript/：TS版のコード
    - python/：Python版のコード
  - 公開しないファイル：CLAUDE.md、backlog.md、auth.json（decisions.md は公開のまま）。
    構築中に一時的に公開していたものとして扱い、今後は公開しない。過去の履歴は書き換えない
  - 公開しないファイルの保管：別の非公開リポジトリ（例：playwright-demo-internal）で管理する
    - 公開リポジトリのフォルダの中（例：internal/）に置き、公開リポジトリ側では .gitignore で除外する
    - Claude Code に CLAUDE.md を今までどおり読ませる方法は、横展開1で確認して決める
    - 非公開リポジトリの作成は、ユーザーが GitHub で行う
  - 過去の履歴に残っている情報への対応（ユーザーが行う作業）
    - 以前 TS版で使っていた外部APIのキーが、過去のコミットに残っている（今のファイルからは削除済み）。
      外部APIのサービス側でキーを無効にする（作り直す）。無効にすれば履歴の書き換えは不要
    - コミットの作成者情報にメールアドレスが入っている。GitHub の設定でメールアドレスを非公開にし、
      今後のコミットは GitHub が用意する匿名のアドレス（noreply）で行う。過去分は書き換えない
- README・UPDATELOG：最終的に TS版・Python版で1つのファイルにする（2026-11-16 決定）。
  まとめる作業は、TS版への横展開がすべて完了した後に行う
  （横展開で TS版の構成が変わるため、構成が固まってから1回でまとめる）
  - それまでは、TS版の変更はリポジトリ直下の UPDATELOG.md、Python版の変更は python/UPDATELOG.md に書く
  - TS版の今後の回の見出しは、Python版と同じ「## 日付（Stage〇〇：項目名）」の形にする
  - UPDATELOG は、TS版の記録が 2026-07-16 まで、Python版が 2026-07-30 からで日付が重ならないため、
    Python版の回を TS版の回の上に積む形でまとめられる見込み
- Wiki：TS版の記載の修正（「TS版の修正候補」の Wiki 関連の項目）は、TS版のコードと一緒に直す。
  横展開で TS版を Python版に揃えると設計はほぼ共通になるため、Wiki は版ごとに分けず両版共通の内容とし、
  README・UPDATELOG を1つにまとめるときに、必要な箇所に Python版と TS版の違い
  （言語の書き方、API のモック、画像比較など）を追記する（2026-11-16 決定）
- TS版を typescript/ フォルダへ移し、python/ と対称な構成にする案：
  極力 Python版と同じ形・構成にしたい意向。実施するかどうかは、影響範囲（import、
  tsconfig.json・playwright.config.ts・package.json のパス、CI の設定）を調べたうえで、
  TS版への横展開のときに最終判断する

## Stage 3（追加チャレンジ・任意）

Stage 2-1 と TS版への横展開が終わった後に、任意で取り組むもの。
基盤（モックによるAPIテスト、CI、Visual Regression）が揃ってから着手する。

- 外部APIのテスト（優先度低）。
  モックと同じ確認内容で接続先だけ変えて動かし、失敗してもCIは止めない（参考情報として通知する）。
  使う外部API（ReqResの現状や代わり）は着手時に調べる。
  今のAPIテストは、接続先（モックサーバーのURL）を fixture から受け取る作りのため、
  リクエストを送る部分（utils/api_helper.py）は接続先を外部APIに差し替えて流用できる見込み。
  期待値（トークン・エラー文言・返ってくる値）はモックの返事に合わせているため、
  外部APIの実際の返事に合わせた見直しが必要（fixtures/api_fixture.py、論点19）。
  外部APIのキーはコードに直接書かない。CI では GitHub の Secrets、手元では .gitignore で除外したファイル
  （.env など）か環境変数に入れて使う（過去に TS版でキーをコードに書いていたため）。
- 外部APIの仕様変更への対応フロー：
  テスト失敗の通知で自動検知 → AIが原因調査と修正案の作成 → プルリクエストの作成・push・マージは人が行う。

## TS版の修正候補

- Wiki「Cart仕様」のテスト件数の記載（カート機能4件・バッジ検証4件）が、
  実態（cart.spec.ts 3件・cart-badge.spec.ts 5件）と違う
- checkout-success.spec.ts の ⑤「削除後購入」⑥「再追加後購入」は、削除・再追加をしておらず手順が②と同じ。
  ③④も手順が①と同じ
- checkout-failure.spec.ts はエラーが表示されていることのみを確認し、文言を確認していない
- Wiki「Checkout仕様」と実装の食い違い：
  - Step Two の Cancel の遷移先（Wiki は Cart、実際は inventory）
  - キャンセル系の状態保持の検証（Wiki は検証するとしているがURLのみ）
  - UI Assertions の範囲（Wiki は各ステップとしているが expectCheckoutComplete のみ）
  - Page Object の例（Wiki の enterFirstName 等と実コードの fillInfo が異なる）
- CheckoutPage.expectOnStepTwo は定義のみで、どこからも呼ばれていない
- Wiki「Flow-Layer設計」で CheckoutFlow の責務とされている「購入確認」に対応する確認コードがない
- TS版は Step Two の表示と金額をコードでは確認していない（スクリーンショット比較のみ）
- MenuPage が開閉の判定に isVisible を使っている（URL で開いた直後は、閉じていても true になる）
- MenuPage.expectMenuOpened が定義のみで、どこからも呼ばれていない
- LogoutFlow で openMenu を呼んだ後、menu.logout の中でも開く処理を行っている（重複）
- Wiki「Flow-Layer設計」の LogoutFlow の例（loginPage.clickLogout）と実コード（MenuPage）の食い違い
- Wiki「Page-Object設計」の HeaderComponent の説明（メニュー表示）と実コード（バッジの確認のみ）の食い違い
- Wiki「Checkout仕様」の「購入完了画面が正常に表示されること」に対し、確認しているのは URL と見出しの表示のみ
- Wiki「Logout仕様」の「ログイン状態が解除されること」に対応するテストがない
- Complete 画面の Visual スナップショットのフッターが Twitter のアイコンで、実機は X のアイコン
- cart-api.spec.ts の「MSW動作確認（Cart追加）」はアサーションがなく、何も確かめていない
- モックの状態がテストの間でリセットされていない（resetCartMock／resetCheckoutMock が未使用）
- commonAssertions の expectCreatedResource、loginAssertions の expectLoginUnauthorized が未使用
- checkoutAssertions.ts で STATUS.OK に 201 を入れている（名前と値が合っていない）
- apiLogger は JSON 以外の返事で失敗する
- apiConfig.ts・types/api.ts・data/apiUsers.ts の inputPatterns が未使用。コメントに ReqRes・JSONPlaceholder の記載が残る
- Cart API のテストで、quantity 省略時に 1 になること、削除後の一覧、一覧の件数と中身を確認していない
- Cart・Checkout のハンドラーは、本文が空のリクエストを読むと読み取りエラーになり、400 を返す分岐に届かない（500 になると考えられる）
- Wiki の API 関連のページ（MSW構成、API-Test-Specifications、API-Assertions設計、各 API 仕様、Schema設計）と実装の食い違い
- CI の Node.js が 18（サポート終了済み）。
  リポジトリ直下の README の「動作環境」には「CI環境：Node.js 20」と書かれていて、実際の CI（18）と食い違っている。
  バージョンを上げるときに、README もあわせて直す
- Visual のテストで固定の待ち（waitForTimeout 300）を使っている
- Visual のテストで、各テストが画面からログインしている（保存したログイン状態を使っていない）
- TS版の Playwright を最新に上げる（今は 1.59.1。Ubuntu 26.04 に対応していない）。
  横展開4で Node.js の更新とあわせて行い、CI の OS を上げるかどうかもそのときに判断する
- package.json の npm scripts のパスが古い（例：test:login が tests/login を指しているが、実際は tests/ui/login）。
  横展開1で typescript/ へ移すときに直す
- Dockerfile の Playwright のイメージが v1.49.0（実際に使っているのは 1.59.1）。
  横展開1で typescript/ へ移すときに、扱い（直すか、使っていなければ削除するか）を決める
- バージョンの更新を自動で知らせる仕組み（Dependabot）の導入を検討する。
  横展開4で Playwright・Node.js を更新するときに決める
