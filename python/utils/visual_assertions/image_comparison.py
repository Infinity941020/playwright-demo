"""画面の画像を、基準画像と比べる。

違う画素の割合を求め、違う画素を目立つ色にした画像（差分の画像）を作る。
Python 用の Playwright には、画面を基準画像と比べる機能がないため、Pillow で作る
（比べ方は specs/visual_spec.md の「比較の方法」）。
"""

from dataclasses import dataclass

from PIL import Image, ImageChops

# 赤・緑・青の差の最大値がこの値を超えた画素を「違う画素」とする。
# Playwright の既定の比較のしきい値（0.2）に合わせた値（255 × 0.2）
PIXEL_THRESHOLD = 51

# 差分の画像で、違う画素を塗る色（赤）
_DIFF_COLOR = (255, 0, 0)


@dataclass(frozen=True)
class ComparisonResult:
    """比べた結果。

    大きさが違うときは、違う画素の割合を 1.0 とし、差分の画像は作らない。
    """

    sizes_match: bool
    diff_ratio: float
    diff_image: Image.Image | None


def compare_images(expected: Image.Image, actual: Image.Image) -> ComparisonResult:
    """基準画像と今の画像を比べる。"""
    if expected.size != actual.size:
        return ComparisonResult(sizes_match=False, diff_ratio=1.0, diff_image=None)

    expected_rgb = expected.convert("RGB")
    actual_rgb = actual.convert("RGB")

    # 1画素ごとに、赤・緑・青のそれぞれの差の最大値を求める
    red, green, blue = ImageChops.difference(expected_rgb, actual_rgb).split()
    max_channel_diff = ImageChops.lighter(ImageChops.lighter(red, green), blue)

    # 違う画素を 255、それ以外を 0 にした画像を作る
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
