"""API のテストに、モックのサーバーと、そこにつながる通信の部品を渡す。

- サーバーはテストごとに 127.0.0.1 の空いているポートで新しく立て、テストの終わりに止める。
  状態（カートの中身、id の連番、購入の呼び出し回数）がテストをまたがないようにするため
- 通信の部品は、そのサーバーを接続先にして作る。ブラウザは使わない
"""

from typing import Iterator

import pytest
from playwright.sync_api import APIRequestContext, Playwright

from mocks.server import MockServer


@pytest.fixture
def mock_api_base_url() -> Iterator[str]:
    """モックのサーバーを立てて、接続先（例：http://127.0.0.1:50123）を渡す。テストの終わりに止める。"""
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
    """モックのサーバーを接続先にした通信の部品を渡す。テストの終わりに捨てる。"""
    context = playwright.request.new_context(base_url=mock_api_base_url)
    try:
        yield context
    finally:
        context.dispose()
