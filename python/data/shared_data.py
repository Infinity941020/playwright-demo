"""両版共通のテストデータ（リポジトリ直下の shared/data/ の JSON）を読み込む。

JSON の場所は、このファイルの場所から求める（pytest を実行する場所に左右されないようにするため）。
"""

import json
from pathlib import Path
from typing import Any

# このファイルから2つ上のフォルダ（リポジトリ直下）にある shared/data/
_SHARED_DATA_DIR = Path(__file__).resolve().parents[2] / "shared" / "data"


def load_shared_data(file_name: str) -> Any:
    """shared/data/ の JSON（例：users.json）を読み込む。"""
    with (_SHARED_DATA_DIR / file_name).open(encoding="utf-8") as file:
        return json.load(file)
