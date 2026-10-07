"""ログインユーザー情報"""

USERS = {
    # 正常ログイン可能ユーザー
    "standard": {
        "username": "standard_user",
        "password": "secret_sauce",
    },
    # ログイン不可（ロック済み）ユーザー
    "locked": {
        "username": "locked_out_user",
        "password": "secret_sauce",
    },
    # 異常系テスト用（ユーザー名のみ誤り）
    "wrong_username_only": {
        "username": "wrong_user",
        "password": "secret_sauce",
    },
    # 異常系テスト用（パスワードのみ誤り）
    "wrong_password_only": {
        "username": "standard_user",
        "password": "wrong_pass",
    },
}
