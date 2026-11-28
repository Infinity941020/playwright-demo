"""モックが返す値（正しい認証情報、トークン、ユーザーの値、エラーの文言など）。

値は両版共通の shared/data/api_mock.json にある。
テストの期待値はここから読まず、テストケースと同じ値をテストに書く（モックの値の誤りにテストが気づけるようにするため）。
"""

from data.shared_data import load_shared_data

MOCK_DATA = load_shared_data("api_mock.json")
