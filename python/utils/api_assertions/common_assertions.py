"""Common API Assertions（TS版 utils/apiAssertions/commonAssertions.ts に対応）

責務:
    - 複数の API で共通に使う確認（HTTPステータス）を提供する

返事の形をチェックする道具（pydantic 等）は使わず、テストケースの期待結果にある項目を値で確かめる
（値を決められない id などは、整数であることだけを確かめる）。
"""

from playwright.sync_api import APIResponse


def expect_status(response: APIResponse, expected_status: int) -> None:
    assert response.status == expected_status
