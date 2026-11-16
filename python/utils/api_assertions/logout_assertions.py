"""Logout API Assertions（TS版 utils/apiAssertions/logoutAssertions.ts に対応）"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_OK = 200
_STATUS_BAD_REQUEST = 400
_STATUS_UNAUTHORIZED = 401


def expect_logout_success(response: APIResponse) -> None:
    """ログアウトが成功したことを確かめる（200、success が true）。"""
    expect_status(response, _STATUS_OK)
    assert response.json()["success"] is True


def expect_logout_unauthorized(response: APIResponse, error: str) -> None:
    """認証されていないとして拒否されたことを確かめる（401、error が期待値と一致）。"""
    expect_status(response, _STATUS_UNAUTHORIZED)
    assert response.json()["error"] == error


def expect_logout_bad_request(response: APIResponse, error: str) -> None:
    """リクエストが不正として拒否されたことを確かめる（400、error が期待値と一致）。"""
    expect_status(response, _STATUS_BAD_REQUEST)
    assert response.json()["error"] == error
