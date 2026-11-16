# 仕様書：見た目の比較（Visual Regression）

## ■ 概要
各画面のスクリーンショットを撮影し、あらかじめ保存した基準画像と比べて、画面の表示崩れを見つける。
対象は TS版の tests/visual/ と同じ6画面とする。

対応するTS版：tests/visual/ 配下の6ファイル、playwright.config.ts（snapshotPathTemplate、viewport、deviceScaleFactor）

| 項目 | 内容 |
|---|---|
| 対象画面 | Login、Products、Cart、Checkout Step One、Checkout Step Two、Checkout Complete |
| 撮影の範囲 | 表示中の範囲（1280×720）。スクロールしないと見えない部分は撮らない（TS版と同じ） |
| ブラウザ | Chromium |
| 比較の方法 | Python の画像ライブラリ Pillow で自作する（下の「■ 比較の方法」参照） |
| 基準画像 | CI（GitHub Actions の Linux）で撮影したものだけを使う |
| 基準画像の置き場所 | python/tests/visual/__snapshots__/（ファイル名は TS版と同じ） |

TS版との違い：TS版は Playwright 標準の toHaveScreenshot で比べる。Python版の Playwright にはこの機能がないため、
比べる仕組みを自分で用意する（decisions.md 論点21）。

---

## ■ 撮影の条件

| 項目 | 内容 |
|---|---|
| 画面の大きさ | 1280×720（撮影前に、この大きさであることを確認する） |
| 画素の密度（deviceScaleFactor） | 1（Python版の初期値。TS版の playwright.config.ts と同じ） |
| アニメーション | 止める（animations="disabled"） |
| 入力欄のカーソル | 隠す（caret="hide"） |
| 撮影前の待ち | ① 画面の表示確認（各画面の expect_on_page など）② フォントの読み込み完了 ③ 画面内のすべての画像の読み込み完了。固定の時間の待ちは使わない |

TS版との違い：TS版は networkidle ＋ フォントの読み込み待ち ＋ 固定の 300ミリ秒待ち。
Python版は「何が終わるのを待つか」を明確にし、固定の時間の待ちは使わない。不安定になった場合は待ち方を見直す。

---

## ■ 比較の方法

1. 基準画像と今の画像の大きさが違う場合は、失敗とする
2. 1画素ごとに、赤・緑・青のそれぞれの差を求め、そのうち最も大きい差が 51（255 × 0.2）を超えた画素を「違う画素」とする
3. 違う画素の数を全体の画素の数で割った値（違う画素の割合）が、画面ごとの許容値を超えた場合は、失敗とする
4. 失敗のメッセージには、違う画素の割合と許容値を表示する

- 0.2 は、Playwright の既定の比較のしきい値（threshold 0.2）に合わせた値である
- ただし、色の差の測り方は Playwright とは同じではない。そのため、TS版と同じ許容値でも、結果が多少異なる場合がある

### 画面ごとの許容値（TS版と同じ）

| 画面 | 基準画像のファイル名 | 許容値（違う画素の割合の上限） |
|---|---|---|
| Login | login-page.png | 1% |
| Products | inventory-page.png | 2% |
| Cart | cart-page.png | 1% |
| Checkout Step One | checkout-step-one-page.png | 1% |
| Checkout Step Two | checkout-step-two-page.png | 1% |
| Checkout Complete | checkout-complete-page.png | 1% |

---

## ■ 失敗したときに保存するもの

python/test-results/visual/ に保存する（CI では Artifact として7日間ダウンロードできる）。

| 場合 | 保存するファイル |
|---|---|
| 違う画素の割合が許容値を超えた、または大きさが違う | 〈名前〉-expected.png（基準画像）、〈名前〉-actual.png（今の画像）、〈名前〉-diff.png（違う画素を目立つ色にした画像。大きさが違う場合は作らない） |
| 基準画像がない | 〈名前〉-actual.png（今の画像） |

〈名前〉は基準画像のファイル名から「.png」を除いたもの（例：login-page）。

---

## ■ 基準画像の作り方・作り直し方

基準画像は、実行する環境（OS やフォント）によって描画が少しずつ違うため、CI で撮影したものだけを使う（TS版と同じ）。

1. 基準画像がない状態で CI を実行すると、Visual のテストは失敗し、今の画像が Artifact に保存される（基準画像がないのに成功扱いにはしない）
2. Artifact をダウンロードし、〈名前〉-actual.png を〈名前〉.png に名前を変えて、python/tests/visual/__snapshots__/ に置く
3. もう一度 CI を実行し、成功することを確認する

作り直すとき（画面のデザインが変わったときなど）は、該当する基準画像を削除して、上の手順を行う。
基準画像を自動で作り直す仕組み（--update-snapshots など）は用意しない。

---

## ■ 実行の仕方

| 実行の仕方 | Visual のテスト |
|---|---|
| pytest（普段の実行） | 実行しない（除外する） |
| pytest tests/visual -m visual | 実行する |
| CI | 専用のジョブ（Visual Tests (Python)）で実行する |

手元（Windows など）で実行すると、基準画像（Linux で撮影）との描画の違いで失敗する場合がある。
手元での実行は、画面の様子を調べたいときに限る。

---

## ■ 本仕様の対象外

| 項目 | 理由 |
|---|---|
| フッターの年（「© 2026 Sauce Labs」）の変化 | 年が変わると画像が変わり、基準画像の作り直しが必要になる（TS版も同じ）。今回は対象から外さず、backlog.md に記録する |
| スクロールしないと見えない部分 | TS版と同じく、表示中の範囲だけを比べる |
| Chromium 以外のブラウザ | TS版の Visual も Chromium のみ |
| 特殊ユーザー（visual_user など） | 今後の拡張候補 |
| 画面の中の個々の文言・値の確認 | 各画面の UI テストで確認済み。Visual は表示崩れの検知に絞る |
