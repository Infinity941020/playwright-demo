"""API fixture

責務:
    - モックサーバーをテストごとに起動・停止する
    - モックサーバーを接続先にした APIRequestContext をテストへ提供する

TS版の fixtures/apiFixture.ts に対応する。テストごとに 127.0.0.1 の空いているポートでモックサーバーを
新しく立ち上げるため、モックの状態（カートの中身、id の連番、Checkout の呼び出し回数）はテストをまたがない
（python/decisions.md の論点5-a・19）。

ブラウザは起動しない（pytest-playwright の playwright fixture から APIRequestContext を作る）。
pytest-playwright（pytest-base-url）の base_url fixture と混同しないよう、
接続先は mock_api_base_url という名前で扱う。
"""

from typing import Iterator

import pytest
from playwright.sync_api import APIRequestContext, Playwright

from mocks.server import MockServer


@pytest.fixture
def mock_api_base_url() -> Iterator[str]:
    """モックサーバーを起動し、接続先（例：http://127.0.0.1:50123）を返す。テストの終了時に停止する。"""
    server = MockServer()
    server.start()
    try:
        yield server.base_url
    finally:
        server.stop()


@pytest.fixture
def api_request_context(
    playwright: Playwright, mock_api_base_url: str
) -> Iterator[APIRequestContext]:
    """モックサーバーを接続先にした APIRequestContext を返す。テストの終了時に破棄する。"""
    context = playwright.request.new_context(base_url=mock_api_base_url)
    try:
        yield context
    finally:
        context.dispose()
