"""APIテスト用ユーザーデータ（TS版 data/apiUsers.ts に対応）"""

# 値は api_testcases.md の操作の値と同じにする
API_USERS = {
    # 正しい認証情報を定義する（TC-API-LOGIN-001）
    "valid_user": {
        "email": "test@example.com",
        "password": "password123",
    },
    # 誤った認証情報を定義する（TC-API-LOGIN-002）
    "invalid_user": {
        "email": "invalid@test.com",
        "password": "wrong-password",
    },
}
