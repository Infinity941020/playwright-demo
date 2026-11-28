"""テストで開く各画面の URL。

値は両版共通の shared/data/urls.json にある。
"""

from data.shared_data import load_shared_data

URLS = load_shared_data("urls.json")
