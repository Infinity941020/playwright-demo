# バックログ（今後の作業候補）

## 今後の拡張候補

- 特殊ユーザー（problem_user、performance_glitch_user、error_user、visual_user）のテスト。
  TS版にも同時に反映する前提とする。
- 商品詳細画面（inventory-item.html）の中身の検証。
  Products画面からの遷移までは TC-PROD-009/010 で検証済み。

## Cart画面の移植時に扱うもの

- 全商品を追加してバッジ＝件数になることのテスト（TS版 cart-badge.spec.ts ②）
- 画面遷移の確認（expect_on_cart_page など）を InventoryPage から CartPage へ移すかどうか
- バッジの確認関数の置き場所（現在は inventory_assertions.py。TS版は cartBadgeAssertions.ts）

## Stage 2-1 で扱うもの

- 見た目の比較テスト（Visual Regression）

## 全画面の移植後に整理するもの

- ロケータの書き方が混在している
  - 新規の Page Object は data-test 属性
  - LoginPage は id（#user-name 等）
  - 一部に CSS クラス（img.inventory_item_img、.inventory_list）
- 商品一覧画面の表示確認が3か所に分かれている
  （LoginPage.expect_on_inventory_page()、logged_page 内、InventoryPage.expect_on_page()）
- tests/ui/login/test_logged_page_fixture.py が URL を直接書いている（論点10）
- Login画面のエラー文言がテストファイル内に直接書かれている。文言データの置き場所を決める
- 並列実行（pytest-xdist）を導入する場合、storage_state ファイルの書き込み競合に注意する
