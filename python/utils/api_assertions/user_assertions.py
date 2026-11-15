"""User API Assertions（TS版 utils/apiAssertions/userAssertions.ts に対応）"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_OK = 200
_STATUS_NOT_FOUND = 404


def expect_single_user_response(response: APIResponse, user: dict) -> None:
    """ユーザー取得成功（200、data の項目と値が期待値と一致）。"""
    expect_status(response, _STATUS_OK)
    assert response.json()["data"] == user


def expect_user_not_found(response: APIResponse) -> None:
    """存在しないユーザー（404、空のオブジェクト）。"""
    expect_status(response, _STATUS_NOT_FOUND)
    assert response.json() == {}
