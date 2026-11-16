"""画像の比較（Visual Regression）

責務:
    - 基準画像と今の画像を比べ、違う画素の割合を求める
    - 違う画素を目立つ色にした画像（diff）を作る

Python版の Playwright には toHaveScreenshot がないため、Pillow で自作する
（decisions.md 論点21、visual_spec.md「■ 比較の方法」）。
"""

from dataclasses import dataclass

from PIL import Image, ImageChops

# 赤・緑・青の差の最大値がこの値を超えた画素を「違う画素」とする。
# Playwright の既定の比較のしきい値（threshold 0.2）に合わせた値（255 × 0.2）。
PIXEL_THRESHOLD = 51

# diff 画像で違う画素を塗る色（赤）
_DIFF_COLOR = (255, 0, 0)


@dataclass(frozen=True)
class ComparisonResult:
    """比較の結果。

    sizes_match が False の場合、diff_ratio は 1.0、diff_image は None。
    """

    sizes_match: bool
    diff_ratio: float
    diff_image: Image.Image | None


def compare_images(expected: Image.Image, actual: Image.Image) -> ComparisonResult:
    """基準画像（expected）と今の画像（actual）を比べる。"""
    if expected.size != actual.size:
        return ComparisonResult(sizes_match=False, diff_ratio=1.0, diff_image=None)

    expected_rgb = expected.convert("RGB")
    actual_rgb = actual.convert("RGB")

    # 1画素ごとに、赤・緑・青のそれぞれの差の最大値を求める
    red, green, blue = ImageChops.difference(expected_rgb, actual_rgb).split()
    max_channel_diff = ImageChops.lighter(ImageChops.lighter(red, green), blue)

    # 違う画素を 255、それ以外を 0 にした画像
    diff_mask = max_channel_diff.point(lambda value: 255 if value > PIXEL_THRESHOLD else 0)
    diff_pixel_count = diff_mask.histogram()[255]

    width, height = expected.size
    diff_ratio = diff_pixel_count / (width * height)

    return ComparisonResult(
        sizes_match=True,
        diff_ratio=diff_ratio,
        diff_image=_make_diff_image(expected_rgb, diff_mask),
    )


def _make_diff_image(expected_rgb: Image.Image, diff_mask: Image.Image) -> Image.Image:
    """基準画像を薄い白黒にし、違う画素を赤で塗った画像を作る。"""
    background = Image.blend(
        expected_rgb.convert("L").convert("RGB"),
        Image.new("RGB", expected_rgb.size, (255, 255, 255)),
        0.7,
    )
    highlight = Image.new("RGB", expected_rgb.size, _DIFF_COLOR)
    return Image.composite(highlight, background, diff_mask)
