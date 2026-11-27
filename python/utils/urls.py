"""テストで使う URL をまとめて定義する

値は両版共通の shared/data/urls.json に置いている（両版で同じ値を使うため）。
"""

from data.shared_data import load_shared_data

URLS = load_shared_data("urls.json")
