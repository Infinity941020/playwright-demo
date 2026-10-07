"""logged_page fixture（storage_state再利用）の動作確認

論点1（storageState未配線）の決定に基づき、storage_stateの再利用が
実際に機能していることを検証する。他画面のFlow実装（Stage 1以降）は
この fixture を前提に進める。
"""

from playwright.sync_api import Page, expect


def test_logged_page_starts_on_inventory_page(logged_page: Page) -> None:
    """logged_pageは、事前ログイン操作なしで商品一覧ページに到達していること。"""
    expect(logged_page).to_have_url("https://www.saucedemo.com/inventory.html")
    expect(logged_page.locator(".inventory_list")).to_be_visible()
