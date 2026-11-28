"""撮影用の実行で、両版が撮った基準画像を比べる。

両版の画像は、大きさと全画素が同じでなければならない（両版で1組の基準画像を共通に使うため）。
- 違うときは、ファイルごとの違う画素の数と範囲を書き、違う所に色を付けた差分の画像を作って、失敗にする
- 結果は標準出力と、GitHub Actions のジョブの要約（GITHUB_STEP_SUMMARY）に書く
両版を対等に比べるため、どちらの版のテストのコードも使わない。

使い方：python compare_visual_baselines.py <TS版の画像のフォルダ> <Python版の画像のフォルダ> <差分の画像の出力先>
"""

import os
import sys
from pathlib import Path

from PIL import Image, ImageChops

# 差分の画像で、違う画素を塗る色（赤）
_DIFF_COLOR = (255, 0, 0)


def _compare(ts_path: Path, py_path: Path, diff_dir: Path) -> str | None:
    """2枚が同じなら None を、違えば違いの説明を返す。違うときは差分の画像も作る。"""
    with Image.open(ts_path) as ts_file, Image.open(py_path) as py_file:
        ts_image = ts_file.convert("RGB")
        py_image = py_file.convert("RGB")

    if ts_image.size != py_image.size:
        ts_size = f"{ts_image.size[0]}×{ts_image.size[1]}"
        py_size = f"{py_image.size[0]}×{py_image.size[1]}"
        return f"大きさが違う（TS版 {ts_size}、Python版 {py_size}）"

    difference = ImageChops.difference(ts_image, py_image)
    box = difference.getbbox()
    if box is None:
        return None

    # 赤・緑・青のどれかが違う画素を 255、それ以外を 0 にした画像
    red, green, blue = difference.split()
    changed = ImageChops.lighter(ImageChops.lighter(red, green), blue).point(lambda value: 255 if value > 0 else 0)
    count = changed.histogram()[255]

    background = Image.blend(
        ts_image.convert("L").convert("RGB"), Image.new("RGB", ts_image.size, (255, 255, 255)), 0.7
    )
    diff_dir.mkdir(parents=True, exist_ok=True)
    Image.composite(Image.new("RGB", ts_image.size, _DIFF_COLOR), background, changed).save(
        diff_dir / f"{ts_path.stem}-diff.png"
    )

    left, top, right, bottom = box
    return f"違う画素 {count}、範囲 x={left}〜{right - 1}・y={top}〜{bottom - 1}"


def main() -> int:
    if len(sys.argv) != 4:
        print(__doc__)
        return 2

    ts_dir, py_dir, diff_dir = (Path(arg) for arg in sys.argv[1:])
    names = sorted({path.name for path in ts_dir.glob("*.png")} | {path.name for path in py_dir.glob("*.png")})

    rows = []
    failed = False
    for name in names:
        ts_path, py_path = ts_dir / name, py_dir / name
        if not ts_path.exists() or not py_path.exists():
            result = "TS版にない" if not ts_path.exists() else "Python版にない"
        else:
            result = _compare(ts_path, py_path, diff_dir)
        failed = failed or result is not None
        rows.append((name, result or "同じ"))

    lines = ["## 基準画像の比べ（TS版と Python版）", ""]
    if not names:
        failed = True
        lines.append("画像が1枚もない")
    elif failed:
        lines += ["| ファイル | 結果 |", "|---|---|"] + [f"| {name} | {result} |" for name, result in rows]
        lines += ["", "違う画像がある。差分の画像（違う画素を赤で塗ったもの）を成果物で確かめること"]
    else:
        lines.append(f"{len(names)}枚とも同じ（大きさと全画素）：" + "、".join(names))

    report = "\n".join(lines) + "\n"
    print(report)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as file:
            file.write(report)

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
