"""Logout の API の返事を確かめる。"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_OK = 200
_STATUS_BAD_REQUEST = 400
_STATUS_UNAUTHORIZED = 401


def expect_logout_success(response: APIResponse) -> None:
    """ログアウトできたことを確かめる（200、success が true）。"""
    expect_status(response, _STATUS_OK)
    assert response.json()["success"] is True


def expect_logout_unauthorized(response: APIResponse, error: str) -> None:
    """認証されていないとして断られたことを確かめる（401、エラーの文言が期待値と同じ）。"""
    expect_status(response, _STATUS_UNAUTHORIZED)
    assert response.json()["error"] == error


def expect_logout_bad_request(response: APIResponse, error: str) -> None:
    """リクエストが正しくないとして断られたことを確かめる（400、エラーの文言が期待値と同じ）。"""
    expect_status(response, _STATUS_BAD_REQUEST)
    assert response.json()["error"] == error
