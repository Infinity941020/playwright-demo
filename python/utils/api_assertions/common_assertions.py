"""Common API Assertions（TS版 utils/apiAssertions/commonAssertions.ts に対応）

責務:
    - 複数の API で共通に使う確認（HTTPステータス）

返事の形をチェックする道具（pydantic 等）は使わず、値を直接確かめる（decisions.md 論点6・9）。
"""

from playwright.sync_api import APIResponse


def expect_status(response: APIResponse, expected_status: int) -> None:
    assert response.status == expected_status
