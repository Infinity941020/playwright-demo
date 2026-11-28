# 見た目の比較（Visual Regression）テストケース

共通の前提：
- 画面の大きさは 1280×720、ブラウザは Chromium
- 撮影の条件・比較の方法・許容値は visual_spec.md のとおり
- 基準画像は、両版で共通の shared/visual/ にある（CI の撮影用の実行で撮ったもの。visual_spec.md「基準画像の作り方・作り直し方」）
- 画面の下の帯の著作権の文（年を含む）は、塗りつぶして撮る（visual_spec.md「撮影の条件」）

前提状態の作り方（両版とも同じ）：
- Login は、ログインしていない画面のまま、ログイン画面を開いて表示を確かめる部品で開く
- Login 以外は、ログイン済みの状態を、保存したログイン状態を使うログイン済みの画面の部品で作る
- カートの中身は、ブラウザの保存領域（localStorage の cart-contents）への直接書き込みで作る（判断の記録 python/decisions.md の「Cart画面テストの前提状態の作り方」）
- Checkout Step Two・Complete は、Step One から購入者情報（両版共通の shared/data/checkout.json の値）を入力して進む
  （既存の UI テストと同じ開き方。直接開くことは判断できない挙動のため）
- カートに入れる商品は「Sauce Labs Backpack」の1件とする

対応するテスト：TS版は `typescript/tests/visual/*-visual.spec.ts`、Python版は `python/tests/visual/test_*_visual.py`
（両版とも同じ6件。下の「両版のテストとの対応」を参照）
実行するブラウザ：両版とも Chromium（TS版は chromium-visual のプロジェクト）

テストIDの付け方：「TC-VIS」とする

対応する仕様書：visual_spec.md

---

## ■ テスト観点

| 観点ID | 観点 |
|---|---|
| V-01 | 各画面の見た目が、基準画像と比べて許容値を超えて変わっていないこと（表示崩れがないこと） |

---

## TC-VIS-001
■ テスト内容：Login画面の見た目が、基準画像と一致すること
■ 前提条件：未ログイン状態である（ログイン状態を引き継がないブラウザで実行する）
■ 操作手順：
  1. Login画面を開く
  2. 画面の表示を確認してから、撮影して基準画像と比べる
■ 期待結果：違う画素の割合が 1% 以下である（基準画像：login-page.png）
■ 優先度：中

---

## TC-VIS-002
■ テスト内容：Products画面の見た目が、基準画像と一致すること
■ 前提条件：standard_user でログイン済みで、カートは空である
■ 操作手順：
  1. Products画面を開く
  2. 画面の表示を確認してから、撮影して基準画像と比べる
■ 期待結果：違う画素の割合が 2% 以下である（基準画像：inventory-page.png）
■ 優先度：中

---

## TC-VIS-003
■ テスト内容：Cart画面の見た目が、基準画像と一致すること
■ 前提条件：standard_user でログイン済みで、「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. Cart画面を開く
  2. 画面の表示を確認してから、撮影して基準画像と比べる
■ 期待結果：違う画素の割合が 1% 以下である（基準画像：cart-page.png）
■ 優先度：中

---

## TC-VIS-004
■ テスト内容：Checkout Step One画面の見た目が、基準画像と一致すること
■ 前提条件：standard_user でログイン済みで、「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. Checkout Step One画面を開く（入力欄は空のまま）
  2. 画面の表示を確認してから、撮影して基準画像と比べる
■ 期待結果：違う画素の割合が 1% 以下である（基準画像：checkout-step-one-page.png）
■ 優先度：中

---

## TC-VIS-005
■ テスト内容：Checkout Step Two画面の見た目が、基準画像と一致すること
■ 前提条件：standard_user でログイン済みで、「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. Checkout Step One画面を開き、購入者情報を入力して Continue を押す
  2. Checkout Step Two画面の表示を確認してから、撮影して基準画像と比べる
■ 期待結果：違う画素の割合が 1% 以下である（基準画像：checkout-step-two-page.png）
■ 優先度：中

---

## TC-VIS-006
■ テスト内容：Checkout Complete画面の見た目が、基準画像と一致すること
■ 前提条件：standard_user でログイン済みで、「Sauce Labs Backpack」がカートに入っている
■ 操作手順：
  1. Checkout Step One画面を開き、購入者情報を入力して Continue を押す
  2. Checkout Step Two画面で Finish を押す
  3. Checkout Complete画面の表示を確認してから、撮影して基準画像と比べる
■ 期待結果：違う画素の割合が 1% 以下である（基準画像：checkout-complete-page.png）
■ 優先度：中

---

## ■ サマリー表

| テストID | 画面 | 観点 | 許容値 | 優先度 | 実装方針 |
|---|---|---|---|---|---|
| TC-VIS-001 | Login | V-01 | 1% | 中 | 個別実装 |
| TC-VIS-002 | Products | V-01 | 2% | 中 | 個別実装 |
| TC-VIS-003 | Cart | V-01 | 1% | 中 | 個別実装 |
| TC-VIS-004 | Checkout Step One | V-01 | 1% | 中 | 個別実装 |
| TC-VIS-005 | Checkout Step Two | V-01 | 1% | 中 | 個別実装 |
| TC-VIS-006 | Checkout Complete | V-01 | 1% | 中 | 個別実装 |

実装方針：前提状態の作り方が画面ごとに違うため、両版とも画面ごとに1ファイルとする。

## ■ 実装時の注意

- Checkout Complete画面の画像は、見出しが表示された時点で読み込みが終わっていない場合がある
  （checkout_complete_spec.md「判断できない挙動」）。撮影前に、ページの中の画像の要素の読み込み完了を待つこと（背景として描く絵は含まない）
- 入力欄のカーソルの点滅で画像が変わらないよう、撮影時はカーソルを隠すこと
- 基準画像がない場合、テストは失敗するのが正しい動き（visual_spec.md「基準画像の作り方・作り直し方」）

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| 画面の下の帯の著作権の文（年を含む）の中身、スクロールしないと見えない部分、Chromium 以外、特殊ユーザー | visual_spec.md「本仕様の対象外」参照 |
| Checkout Step One のエラー表示中の見た目、商品詳細画面 | 今後の拡張候補 |

## ■ 両版のテストとの対応

両版とも、テストケースの6件を実装している。

| テストID | TS版（typescript/tests/visual/） | Python版（python/tests/visual/） |
|---|---|---|
| TC-VIS-001 | login-visual.spec.ts「TC-VIS-001：…」 | test_login_visual.py `test_login_page_matches_snapshot` |
| TC-VIS-002 | inventory-visual.spec.ts「TC-VIS-002：…」 | test_inventory_visual.py `test_inventory_page_matches_snapshot` |
| TC-VIS-003 | cart-visual.spec.ts「TC-VIS-003：…」 | test_cart_visual.py `test_cart_page_matches_snapshot` |
| TC-VIS-004 | checkout-step-one-visual.spec.ts「TC-VIS-004：…」 | test_checkout_step_one_visual.py `test_checkout_step_one_page_matches_snapshot` |
| TC-VIS-005 | checkout-step-two-visual.spec.ts「TC-VIS-005：…」 | test_checkout_step_two_visual.py `test_checkout_step_two_page_matches_snapshot` |
| TC-VIS-006 | checkout-complete-visual.spec.ts「TC-VIS-006：…」 | test_checkout_complete_visual.py `test_checkout_complete_page_matches_snapshot` |
