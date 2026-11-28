"""API ごとにリクエストを送る。

この部品はパスだけを持ち、接続先（ホストとポート）は、テストごとに立てるモックのサーバーに合わせて、
通信の部品が決める（fixtures/api_fixture.py）。
送る値に None を渡すと、本文なしで送る（本文がないときの返事を確かめるため）。
"""

from playwright.sync_api import APIRequestContext, APIResponse

_BASE_PATH = "/api"


def execute_login_api(request: APIRequestContext, payload: dict) -> APIResponse:
    return request.post(f"{_BASE_PATH}/login", data=payload)


# ユーザーの情報を取得するだけで、変更はしない
def execute_get_user_api(request: APIRequestContext, user_id: int) -> APIResponse:
    return request.get(f"{_BASE_PATH}/users/{user_id}")


def execute_add_cart_api(request: APIRequestContext, payload: dict | None) -> APIResponse:
    return request.post(f"{_BASE_PATH}/cart", data=payload)


def execute_get_cart_api(request: APIRequestContext) -> APIResponse:
    return request.get(f"{_BASE_PATH}/cart")


def execute_delete_cart_api(request: APIRequestContext, cart_id: int) -> APIResponse:
    return request.delete(f"{_BASE_PATH}/cart/{cart_id}")


def execute_checkout_api(request: APIRequestContext, payload: dict | None) -> APIResponse:
    return request.post(f"{_BASE_PATH}/checkout", data=payload)


def execute_logout_api(
    request: APIRequestContext, body: dict | None = None, token: str | None = None
) -> APIResponse:
    """トークンを渡すと Authorization ヘッダーに付け、本文を渡さなければ本文なしで送る。"""
    return request.post(
        f"{_BASE_PATH}/logout",
        data=body,
        headers={"Authorization": token} if token is not None else None,
    )
