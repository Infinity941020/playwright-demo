# バックログ（今後の作業候補）

## 今後の拡張候補

- 特殊ユーザー（problem_user、performance_glitch_user、error_user、visual_user）のテスト。
  TS版にも同時に反映する前提とする。
- 商品詳細画面（inventory-item.html）の中身の検証。
  Products画面からの遷移までは TC-PROD-009/010 で検証済み。
- カートが空の状態で Checkout に進めることの扱い。
  意図された仕様か不具合か判断できないため保留（cart_spec.md「本仕様の対象外」参照）。
- 外部APIのテスト（優先度低）。
  モックと同じ確認内容で接続先だけ変えて動かし、失敗してもCIは止めない（参考情報として通知する）。
  使う外部API（ReqResの現状や代わり）は着手時に調べる。
- 外部APIの仕様変更への対応フロー：
  テスト失敗の通知で自動検知 → AIが原因調査と修正案の作成 → プルリクエストの作成・push・マージは人が行う。

## Stage 2-1 で扱うもの

- APIテストは Python側のモックで実装する（外部APIには戻さない。CLAUDE.md の通信方針どおり）。
  モックの具体的な作り方は、Stage 2-1 の着手時に TS版の MSW 構成を調べてから決める
- 見た目の比較テスト（Visual Regression）
  - CI上で基準画像を生成し、Artifactをダウンロードしてリポジトリに入れ、CI上で比較する
    （実行環境ごとに描画が微妙に異なるため。TS版で同じ手順で解決した実績あり）
  - Python版の Playwright には画像比較の標準機能がないため、比較の仕組みを用意する
- CIで、同じブランチに新しい push があったら古い実行を自動でキャンセルする設定
  （GitHub Actions の concurrency と cancel-in-progress）。
  CIのファイルはTS版と共通のため、Python版をCIに組み込むときに合わせて入れる

## 全画面の移植後に整理するもの

- ロケータの書き方が混在している
  - 新規の Page Object は data-test 属性
  - LoginPage は id（#user-name 等）
  - 一部に CSS クラス（img.inventory_item_img、.inventory_list）
- 商品一覧画面の表示確認が3か所に分かれている
  （LoginPage.expect_on_inventory_page()、logged_page 内、InventoryPage.expect_on_page()）
- Login画面のエラー文言がテストファイル内に直接書かれている。文言データの置き場所を決める
- 並列実行（pytest-xdist）を導入する場合、storage_state ファイルの書き込み競合に注意する
- README を最終的に TS版と別のまま整えるか、TS版と統合するかを決める

## TS版の修正候補

- Wiki「Cart仕様」のテスト件数の記載（カート機能4件・バッジ検証4件）が、
  実態（cart.spec.ts 3件・cart-badge.spec.ts 5件）と違う
