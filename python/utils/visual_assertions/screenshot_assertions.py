"""Visual Assertions（TS版 toHaveScreenshot に対応）

責務:
    - 撮影前の待ち（フォント・画像の読み込み完了）と撮影
    - 基準画像との比較と、失敗時のファイルの保存

画面の表示確認（expect_on_page など）は、呼び出す前に Flow で済ませておくこと。
固定の時間の待ちは使わない（decisions.md 論点21、visual_spec.md「■ 撮影の条件」）。
"""

import io
from pathlib import Path

from PIL import Image
from playwright.sync_api import Page

from utils.visual_assertions.image_comparison import compare_images

_PYTHON_ROOT = Path(__file__).resolve().parent.parent.parent
SNAPSHOT_DIR = _PYTHON_ROOT / "tests" / "visual" / "__snapshots__"
RESULT_DIR = _PYTHON_ROOT / "test-results" / "visual"

# 撮影する画面の大きさ（TS版の playwright.config.ts と同じ）
_VIEWPORT = {"width": 1280, "height": 720}


def expect_screenshot_matches(page: Page, snapshot_name: str, max_diff_ratio: float) -> None:
    """表示中の範囲を撮影し、基準画像との違う画素の割合が許容値以下であること。

    snapshot_name は基準画像のファイル名（例：login-page.png）。
    max_diff_ratio は違う画素の割合の上限（例：0.01 = 1%）。
    """
    name = Path(snapshot_name).stem
    actual = _take_screenshot(page)

    expected_path = SNAPSHOT_DIR / snapshot_name
    if not expected_path.exists():
        _save(actual, f"{name}-actual.png")
        raise AssertionError(
            f"基準画像がない: tests/visual/__snapshots__/{snapshot_name}\n"
            f"今の画像を test-results/visual/{name}-actual.png に保存した。"
            f"CI の Artifact から取得し、{snapshot_name} に名前を変えて "
            "tests/visual/__snapshots__/ に置くこと"
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
    """撮影前の待ちを行ってから、表示中の範囲を撮影する。"""
    if page.viewport_size != _VIEWPORT:
        raise AssertionError(
            f"画面の大きさが {_VIEWPORT['width']}×{_VIEWPORT['height']} ではない: "
            f"{page.viewport_size}"
        )

    # フォントの読み込み完了
    page.evaluate("async () => { await document.fonts.ready; }")
    # 画面内のすべての画像の読み込み完了
    page.wait_for_function("() => Array.from(document.images).every((image) => image.complete)")

    screenshot = page.screenshot(animations="disabled", caret="hide")
    return Image.open(io.BytesIO(screenshot)).convert("RGB")


def _save(image: Image.Image, file_name: str) -> None:
    RESULT_DIR.mkdir(parents=True, exist_ok=True)
    image.save(RESULT_DIR / file_name)
