"""API の呼び出し

責務:
    - API ごとにリクエストを送る（TS版の utils/apiHelper.ts に対応）

接続先（ホスト・ポート）は APIRequestContext の base_url で決まる（fixtures/api_fixture.py）。
payload に None を渡すと、本文なしで送る。
"""

from playwright.sync_api import APIRequestContext, APIResponse

_BASE_PATH = "/api"


# Login API


def execute_login_api(request: APIRequestContext, payload: dict) -> APIResponse:
    return request.post(f"{_BASE_PATH}/login", data=payload)


# User API（情報を取得するだけで、変更はしない）


def execute_get_user_api(request: APIRequestContext, user_id: int) -> APIResponse:
    return request.get(f"{_BASE_PATH}/users/{user_id}")


# Cart API


def execute_add_cart_api(request: APIRequestContext, payload: dict | None) -> APIResponse:
    return request.post(f"{_BASE_PATH}/cart", data=payload)


def execute_get_cart_api(request: APIRequestContext) -> APIResponse:
    return request.get(f"{_BASE_PATH}/cart")


def execute_delete_cart_api(request: APIRequestContext, cart_id: int) -> APIResponse:
    return request.delete(f"{_BASE_PATH}/cart/{cart_id}")


# Checkout API


def execute_checkout_api(request: APIRequestContext, payload: dict | None) -> APIResponse:
    return request.post(f"{_BASE_PATH}/checkout", data=payload)


# Logout API


def execute_logout_api(
    request: APIRequestContext, body: dict | None = None, token: str | None = None
) -> APIResponse:
    """token を渡すと Authorization ヘッダーに付ける。body を渡さなければ本文なしで送る。"""
    return request.post(
        f"{_BASE_PATH}/logout",
        data=body,
        headers={"Authorization": token} if token is not None else None,
    )
