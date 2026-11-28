"""画面の見た目を、基準画像と比べて確かめる。

- 基準画像は、両版で共通の1組（リポジトリ直下の shared/visual/）を使う
- 画面の表示の確認は、呼び出す側（前提を作る部品）で済ませておく
- 撮る前に、フォントと、ページの中の画像の要素（背景として描く絵は含まない）の読み込みが終わるのを待つ。
  画面によっては、見出しが出た後も画像の読み込みが続くため
- 固定の時間の待ちは使わない（環境によって足りなかったり無駄だったりするため）。
  撮る条件は specs/visual_spec.md の「撮影の条件」
- 失敗したときは、画像をファイルに保存する（保存するものは specs/visual_spec.md の「失敗したときに保存するもの」）
- pytest に --update-snapshots を付けたときは、比べずに撮って基準画像の場所に書き、成功にする。
  撮る前の待ちと塗りつぶしは、比べるときと同じ
"""

import io
from pathlib import Path

from PIL import Image
from playwright.sync_api import Page

from utils.visual_assertions.image_comparison import compare_images

_PYTHON_ROOT = Path(__file__).resolve().parent.parent.parent
SNAPSHOT_DIR = _PYTHON_ROOT.parent / "shared" / "visual"
RESULT_DIR = _PYTHON_ROOT / "test-results" / "visual"

# 撮る画面の大きさ（基準画像は、この大きさで撮ったもの）
_VIEWPORT = {"width": 1280, "height": 720}

# 画面の下の帯の著作権の文（「© 2026 Sauce Labs. …」）を、塗りつぶして撮る。
# 年はブラウザの時計で決まり、年が変わると画像が変わるため。年だけの要素はないので、文の全体を隠す。
# 帯がない画面や、帯が撮る範囲の外にある画面では、何も塗られない
_FOOTER_COPY_SELECTOR = '[data-test="footer-copy"]'

_update_snapshots = False


def set_update_snapshots(enabled: bool) -> None:
    """撮影のオプション（--update-snapshots）を指定したかを受け取る。pytest の設定を読み込むときに呼ぶ。"""
    global _update_snapshots
    _update_snapshots = enabled


def expect_screenshot_matches(page: Page, snapshot_name: str, max_diff_ratio: float) -> None:
    """表示している範囲を撮り、基準画像と違う画素の割合が上限以下であることを確かめる。

    基準画像のファイル名（例：login-page.png）と、違う画素の割合の上限（例：0.01 = 1%）を受け取る。
    """
    name = Path(snapshot_name).stem
    actual = _take_screenshot(page)

    expected_path = SNAPSHOT_DIR / snapshot_name
    if _update_snapshots:
        SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
        actual.save(expected_path)
        return

    # 基準画像がないのに成功にすると、比べ忘れに気づけないため、今の画像を保存して失敗させる
    if not expected_path.exists():
        _save(actual, f"{name}-actual.png")
        raise AssertionError(
            f"基準画像がない: shared/visual/{snapshot_name}\n"
            f"今の画像を python/test-results/visual/{name}-actual.png に保存した。"
            "基準画像は、撮影用の実行で撮ったものを shared/visual/ に置くこと"
            "（手順は README.md の「基準画像の撮り直し」）"
        )

    with Image.open(expected_path) as expected_file:
        expected = expected_file.copy()

    result = compare_images(expected, actual)

    if not result.sizes_match:
        _save(expected, f"{name}-expected.png")
        _save(actual, f"{name}-actual.png")
        raise AssertionError(
            f"画像の大きさが違う: {snapshot_name}"
            f"（基準画像 {expected.size[0]}×{expected.size[1]}、"
            f"今の画像 {actual.size[0]}×{actual.size[1]}）"
        )

    if result.diff_ratio > max_diff_ratio:
        _save(expected, f"{name}-expected.png")
        _save(actual, f"{name}-actual.png")
        _save(result.diff_image, f"{name}-diff.png")
        raise AssertionError(
            f"見た目が基準画像と違う: {snapshot_name}"
            f"（違う画素の割合 {result.diff_ratio:.2%}、許容値 {max_diff_ratio:.2%}）"
        )


def _take_screenshot(page: Page) -> Image.Image:
    """撮る前の待ちをしてから、表示している範囲を撮る。"""
    if page.viewport_size != _VIEWPORT:
        raise AssertionError(
            f"画面の大きさが {_VIEWPORT['width']}×{_VIEWPORT['height']} ではない: "
            f"{page.viewport_size}"
        )

    page.evaluate("async () => { await document.fonts.ready; }")
    page.wait_for_function("() => Array.from(document.images).every((image) => image.complete)")

    screenshot = page.screenshot(
        animations="disabled", caret="hide", mask=[page.locator(_FOOTER_COPY_SELECTOR)]
    )
    return Image.open(io.BytesIO(screenshot)).convert("RGB")


def _save(image: Image.Image, file_name: str) -> None:
    RESULT_DIR.mkdir(parents=True, exist_ok=True)
    image.save(RESULT_DIR / file_name)
