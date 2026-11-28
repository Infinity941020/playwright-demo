"""複数の API で共通に使う確認。

返事の形を確かめる道具は使わず、テストケースの期待結果にある項目を値で確かめる（値が一致すれば、形も一致するため）。
ただし Python の比べ方では、True と 1、4.0 と 4 を同じとみなすため、その違いは見分けない。
値を決められない id などは、整数であることだけを確かめる（真偽値は除く）。
"""

from playwright.sync_api import APIResponse


def expect_status(response: APIResponse, expected_status: int) -> None:
    assert response.status == expected_status
