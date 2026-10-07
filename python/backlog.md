# バックログ（今後の作業候補）

## 今後の拡張候補

- 特殊ユーザー（problem_user、performance_glitch_user、error_user、visual_user）のテスト。
  TS版にも同時に反映する前提とする。
- 商品詳細画面（inventory-item.html）の中身の検証。
  Products画面からの遷移までは TC-PROD-009/010 で検証済み。
- カートが空の状態で Checkout に進めることの扱い。
  意図された仕様か不具合か判断できないため保留（cart_spec.md「本仕様の対象外」参照）。

## Stage 2-1 で扱うもの

- 見た目の比較テスト（Visual Regression）

## 全画面の移植後に整理するもの

- ロケータの書き方が混在している
  - 新規の Page Object は data-test 属性
  - LoginPage は id（#user-name 等）
  - 一部に CSS クラス（img.inventory_item_img、.inventory_list）
- 商品一覧画面の表示確認が3か所に分かれている
  （LoginPage.expect_on_inventory_page()、logged_page 内、InventoryPage.expect_on_page()）
- Login画面のエラー文言がテストファイル内に直接書かれている。文言データの置き場所を決める
- 並列実行（pytest-xdist）を導入する場合、storage_state ファイルの書き込み競合に注意する

## TS版の修正候補

- Wiki「Cart仕様」のテスト件数の記載（カート機能4件・バッジ検証4件）が、
  実態（cart.spec.ts 3件・cart-badge.spec.ts 5件）と違う
