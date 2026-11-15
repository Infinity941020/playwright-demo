# バックログ（今後の作業候補）

## 今後の拡張候補

- 特殊ユーザー（problem_user、performance_glitch_user、error_user、visual_user）のテスト。
  TS版にも同時に反映する前提とする。
- 商品詳細画面（inventory-item.html）の中身の検証。
  Products画面からの遷移までは TC-PROD-009/010 で検証済み。
- Reset App State、Dynamic Catalog（Lazy Load・Spinner・Slider）、About、
  PDF出力（ダウンロードとPDFの中身）のテスト。
- 外部APIのテスト（優先度低）。
  モックと同じ確認内容で接続先だけ変えて動かし、失敗してもCIは止めない（参考情報として通知する）。
  使う外部API（ReqResの現状や代わり）は着手時に調べる。
- 外部APIの仕様変更への対応フロー：
  テスト失敗の通知で自動検知 → AIが原因調査と修正案の作成 → プルリクエストの作成・push・マージは人が行う。

## 判断を保留している挙動

実機で確認したが、意図された仕様か不具合かを判断できないため、テスト対象に含めず保留している挙動。
詳細は各仕様書の「判断できない挙動」（Cart は「本仕様の対象外」）を参照。

### Login（login_spec.md）

- エラー時に、入力済みの欄も含めた両方の入力欄が赤表示になる
- 空白のみのユーザー名が未入力扱いにならない（認証情報不一致のエラーになる）
- ログイン済みでも Login画面の URL を開くと Login画面が表示される（ログイン状態は残っている）

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

- APIテストは Python側のモックで実装する（外部APIには戻さない。CLAUDE.md の通信方針どおり）。
  モックの具体的な作り方は、Stage 2-1 の着手時に TS版の MSW 構成を調べてから決める
- 見た目の比較テスト（Visual Regression）
  - CI上で基準画像を生成し、Artifactをダウンロードしてリポジトリに入れ、CI上で比較する
    （実行環境ごとに描画が微妙に異なるため。TS版で同じ手順で解決した実績あり）
  - Python版の Playwright には画像比較の標準機能がないため、比較の仕組みを用意する
- Python版のテストを CI に組み込む（今は CI で動いているのは TS版のテストだけ）。
  同じブランチに新しい push があったら古い実行を自動でキャンセルする設定
  （GitHub Actions の concurrency と cancel-in-progress）もこのときに入れる
  （CIのファイルはTS版と共通のため）
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

- README・UPDATELOG の TS版／Python版の統一：方針は Stage 2-1 の終わりに決め、
  作業は TS版への横展開のときに行う
- Wiki：TS版の記載の修正（「TS版の修正候補」の Wiki 関連の項目）は TS版のコードと一緒に直す。
  Python版の内容を Wiki に載せるかどうかは、Stage 2-1 の終わりに README と一緒に方針を決める
- TS版を typescript/ フォルダへ移し、python/ と対称な構成にする案：
  極力 Python版と同じ形・構成にしたい意向。実施するかどうかは、影響範囲（import、
  tsconfig.json・playwright.config.ts・package.json のパス、CI の設定）を調べたうえで、
  TS版への横展開のときに最終判断する

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
