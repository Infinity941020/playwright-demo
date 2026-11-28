"""Login の API のテストで送る認証情報。

値は specs/api_testcases.md の操作の値と同じにする。
"""

API_USERS = {
    # 正しい認証情報（TC-API-LOGIN-001）
    "valid_user": {
        "email": "test@example.com",
        "password": "password123",
    },
    # 誤った認証情報（TC-API-LOGIN-002）
    "invalid_user": {
        "email": "invalid@test.com",
        "password": "wrong-password",
    },
}
