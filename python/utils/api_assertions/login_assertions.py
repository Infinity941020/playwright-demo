"""Login API Assertions（TS版 utils/apiAssertions/loginAssertions.ts に対応）"""

from playwright.sync_api import APIResponse

from utils.api_assertions.common_assertions import expect_status

_STATUS_OK = 200
_STATUS_BAD_REQUEST = 400


def expect_login_success(response: APIResponse, token: str) -> None:
    """ログインが成功したことを確かめる（200、token が期待値と一致）。"""
    expect_status(response, _STATUS_OK)
    assert response.json()["token"] == token


def expect_login_bad_request(response: APIResponse, error: str) -> None:
    """ログインが失敗したことを確かめる（400、error が期待値と一致）。"""
    expect_status(response, _STATUS_BAD_REQUEST)
    assert response.json()["error"] == error
