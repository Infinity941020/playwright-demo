# 仕様書：見た目の比較（Visual Regression）

## ■ 概要
各画面のスクリーンショットを撮影し、あらかじめ保存した基準画像と比べて、画面の表示崩れを見つける。
対象は両版とも同じ6画面とする。

対応するテスト：TS版は `typescript/tests/visual/*-visual.spec.ts`、Python版は `python/tests/visual/test_*_visual.py`
対応する設定：TS版の playwright.config.ts（snapshotPathTemplate、updateSnapshots、viewport、deviceScaleFactor）

| 項目 | 内容 |
|---|---|
| 対象画面 | Login、Products、Cart、Checkout Step One、Checkout Step Two、Checkout Complete |
| 撮影の範囲 | 表示中の範囲（1280×720）。スクロールしないと見えない部分は撮らない |
| ブラウザ | Chromium |
| 比較の方法 | TS版は Playwright 標準の toHaveScreenshot。Python版は、Python の画像ライブラリ Pillow で自作する（下の「■ 比較の方法」参照） |
| 基準画像 | CI（GitHub Actions の Linux）の撮影用の実行で撮ったものだけを使う（下の「■ 基準画像の作り方・作り直し方」） |
| 基準画像の置き場所 | リポジトリ直下の shared/visual/（両版で共通の1組。TS版は playwright.config.ts の snapshotPathTemplate、Python版は utils/visual_assertions/screenshot_assertions.py で指す） |

比べる仕組みの違い：Python 用の Playwright には toHaveScreenshot がないため、Python版だけ比べる仕組みを自分で用意する（判断の記録 python/decisions.md の「Visual Regression の方式」）。

---

## ■ 撮影の条件

| 項目 | 内容 |
|---|---|
| 画面の大きさ | 1280×720。撮影前に大きさを確かめる（Python版はこの値と、TS版は設定〈playwright.config.ts〉の値と比べる。設定の値は 1280×720） |
| 画素の密度（deviceScaleFactor） | 1（TS版は playwright.config.ts で指定、Python版は初期値） |
| アニメーション | 止める（animations="disabled"） |
| 入力欄のカーソル | 隠す（caret="hide"） |
| 塗りつぶす部分 | 画面の下の帯の著作権の文（data-test="footer-copy"。「© 2026 Sauce Labs. All Rights Reserved. …」）を、Playwright の mask で塗りつぶして撮る（色は初期値のピンク #FF00FF。両版とも同じ）。年はブラウザの時計で決まり、年が変わると画像が変わるため。年だけの要素はないので、文の全体を隠す。この文が撮る範囲に入るのは Cart と Checkout Complete だけで、ほかの画面では何も塗られない |
| 撮影前の待ち | ① 画面の表示確認（前提を作る部品の中で行う）② フォントの読み込み完了 ③ ページの中の画像の要素の読み込み完了（背景として描く絵は含まず、画面の外にある画像の要素は含む）。固定の時間の待ちは使わない（両版とも、比べる部品〈TS版は utils/visualAssertions/、Python版は utils/visual_assertions/〉の中で待つ）。画像の要素の読み込みを待つ上限は、TS版は5秒（テストの時間切れより先に、画像の待ちとして失敗させるため）、Python版は30秒（Playwright の初期値） |

「何が終わるのを待つか」を明確にし、固定の時間の待ちは使わない。不安定になった場合は待ち方を見直す。
TS版は、これに加えて、比べる機能（toHaveScreenshot）が、続けて撮った2枚が同じになるまで撮り直してから比べる。

---

## ■ 比較の方法

### TS版

Playwright 標準の toHaveScreenshot で比べる（Playwright の既定の比較のしきい値 0.2）。違う画素の割合の上限（maxDiffPixelRatio）に、下の許容値を渡す。
比べる処理と、失敗したときの画像の保存は、Playwright に任せる。

### Python版

1. 基準画像と今の画像の大きさが違う場合は、失敗とする
2. 1画素ごとに、赤・緑・青のそれぞれの差を求め、そのうち最も大きい差が 51（255 × 0.2）を超えた画素を「違う画素」とする
3. 違う画素の数を全体の画素の数で割った値（違う画素の割合）が、画面ごとの許容値を超えた場合は、失敗とする
4. 失敗のメッセージには、違う画素の割合と許容値を表示する

- 0.2 は、Playwright の既定の比較のしきい値（threshold 0.2）に合わせた値である
- ただし、色の差の測り方は Playwright とは同じではない。そのため、同じ許容値でも、両版で結果が多少異なる場合がある

### 画面ごとの許容値（両版で同じ）

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

### TS版

typescript/test-results/ の下に、テストごとのフォルダを作って保存する（ファイルの名前と中身は Playwright が決める）。
基準画像がないときは、CI では作らずに失敗する（設定の updateSnapshots を CI では 'none' にしている）。手元では、撮った画像を基準画像の場所に作って失敗する。
CI では Artifact（visual-artifacts）として7日間ダウンロードできる。

### Python版

python/test-results/visual/ に保存する（CI では Artifact〈python-visual-artifacts〉として7日間ダウンロードできる）。

| 場合 | 保存するファイル |
|---|---|
| 違う画素の割合が許容値を超えた、または大きさが違う | 〈名前〉-expected.png（基準画像）、〈名前〉-actual.png（今の画像）、〈名前〉-diff.png（違う画素を目立つ色にした画像。大きさが違う場合は作らない） |
| 基準画像がない | 〈名前〉-actual.png（今の画像） |

〈名前〉は基準画像のファイル名から「.png」を除いたもの（例：login-page）。

---

## ■ 基準画像の作り方・作り直し方

基準画像は、実行する環境（OS やフォント）によって描画が少しずつ違うため、CI で撮ったものだけを使う。
両版は同じ1組を使うため、撮影用の実行で両版が撮った画像が、大きさと全画素まで同じことを確かめてから入れる。

撮影用の実行（.github/workflows/visual-baselines.yml。GitHub の Actions の画面から手動で動かす）：
1. Capture (TS)：普段の Visual Tests (TS) と同じ環境で、npx playwright test --project=chromium-visual --update-snapshots=all で撮る
2. Capture (Python) and Compare：普段の Visual Tests (Python) と同じ環境で、pytest tests/visual -m visual --update-snapshots で撮り、
   両版の6枚を、大きさと全画素で比べる（.github/scripts/compare_visual_baselines.py）
3. 6枚とも同じなら成功にし、コミットに使う6枚を Artifact（visual-baselines）に出す。
   違えば、違う画素の数と範囲をジョブの要約に書き、両版の画像と差分の画像を Artifact（visual-baselines-comparison）に出して失敗にする。
   両版の画像と差分の画像は、成功したときも visual-baselines-comparison に出す（7日間ダウンロードできる）

この実行は、リポジトリに書き込まない。撮った6枚は、人が shared/visual/ に置き、プルリクエストで入れる。
撮り直すときと手順は、README.md の「基準画像の撮り直し」を参照。

普段の CI では、基準画像を書き換えない（TS版は、CI では updateSnapshots を 'none' にしている。Python版は、--update-snapshots を付けない限り書かない）。
両版とも、手元でも --update-snapshots で撮れるが、描画が CI と違うため、手元で撮った画像は基準画像にしない。

---

## ■ 実行の仕方

| 実行の仕方 | Visual のテスト |
|---|---|
| Python版：pytest（普段の実行） | 実行しない（除外する） |
| Python版：pytest tests/visual -m visual | 実行する |
| TS版：npx playwright test（普段の実行） | 実行する（chromium-visual のプロジェクト） |
| CI | 専用のジョブ（Visual Tests (TS)・Visual Tests (Python)）で実行する |
| 撮影用の実行（手動） | 両版で撮って比べる（基準画像は書き換えない。上の「■ 基準画像の作り方・作り直し方」） |

Python版は、手元（Windows など）で実行すると、基準画像（Linux で撮影）との描画の違いで失敗する場合がある。
手元での実行は、画面の様子を調べたいときに限る。
TS版は、手元（Windows）で確かめた範囲では許容値の中に収まったため、普段の実行に含めている。
環境によって失敗する場合は、普段の実行から外すことを検討する。
TS版は、手元で基準画像がないと、撮った画像がその場所（shared/visual/）に作られる。コミットしないこと。

---

## ■ 本仕様の対象外

| 項目 | 理由 |
|---|---|
| 画面の下の帯の著作権の文（年を含む）の中身 | 年が変わるたびに画像が変わるのを避けるため、塗りつぶして撮る（「■ 撮影の条件」）。文の中身は比べない |
| スクロールしないと見えない部分 | 両版とも、表示中の範囲だけを比べる |
| Chromium 以外のブラウザ | 両版とも、Visual は Chromium のみ |
| 特殊ユーザー（visual_user など） | 今後の拡張候補 |
| 画面の中の個々の文言・値の確認 | 各画面の UI テストで確認済み。Visual は表示崩れの検知に絞る |
