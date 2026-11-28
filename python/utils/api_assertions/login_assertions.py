"""Login の API の返事を確かめる。"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_OK = 200
_STATUS_BAD_REQUEST = 400


def expect_login_success(response: APIResponse, token: str) -> None:
    """ログインできたことを確かめる（200、トークンが期待値と同じ）。"""
    expect_status(response, _STATUS_OK)
    assert response.json()["token"] == token


def expect_login_bad_request(response: APIResponse, error: str) -> None:
    """ログインできなかったことを確かめる（400、エラーの文言が期待値と同じ）。"""
    expect_status(response, _STATUS_BAD_REQUEST)
    assert response.json()["error"] == error
