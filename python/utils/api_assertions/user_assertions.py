"""User の API の返事を確かめる。"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_OK = 200
_STATUS_NOT_FOUND = 404


def expect_single_user_response(response: APIResponse, user: dict) -> None:
    """ユーザーの情報を取得できたことを確かめる（200、data の項目と値が期待値と同じ）。"""
    expect_status(response, _STATUS_OK)
    assert response.json()["data"] == user


def expect_user_not_found(response: APIResponse) -> None:
    """存在しないユーザーとして、404 と空のオブジェクトが返ったことを確かめる。"""
    expect_status(response, _STATUS_NOT_FOUND)
    assert response.json() == {}
