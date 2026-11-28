"""モックのリクエスト・レスポンス・ハンドラーの形。ハンドラー（handlers/）とサーバー（server.py）が共通で使う。"""

import json
from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class MockRequest:
    method: str
    path: str
    # ヘッダー名は小文字にそろえて持つ
    headers: dict[str, str]
    body: bytes
    # パスの {id} などに当てはまった値
    params: dict[str, str] = field(default_factory=dict)

    def header(self, name: str) -> str | None:
        """ヘッダーの値を返す（名前の大文字と小文字は区別しない）。"""
        return self.headers.get(name.lower())

    def json(self) -> Any:
        """本文を JSON として読む。本文が空のときは、値がないとして None を返す。

        JSON として読めないときは例外になる。例外をハンドラーの中で受け止めないとき（Logout 以外）は、サーバーが 500 を返す。
        """
        if not self.body:
            return None
        return json.loads(self.body)


@dataclass
class MockResponse:
    status: int
    body: Any


@dataclass
class Handler:
    method: str
    # 例：/api/cart/{id}（{名前} の部分は、リクエストの params に入る）
    path: str
    resolver: Callable[[MockRequest], MockResponse]


def to_number(value: str) -> float | None:
    """パスの値を数にする。数でなければ None を返す。"""
    try:
        return float(value)
    except ValueError:
        return None
