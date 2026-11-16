"""ログインユーザー情報"""

USERS = {
    # ログインに成功するユーザーを定義する
    "standard": {
        "username": "standard_user",
        "password": "secret_sauce",
    },
    # ロックされていて、ログインできないユーザーを定義する
    "locked": {
        "username": "locked_out_user",
        "password": "secret_sauce",
    },
    # 異常系のテストに使う（ユーザー名だけが誤り）
    "wrong_username_only": {
        "username": "wrong_user",
        "password": "secret_sauce",
    },
    # 異常系のテストに使う（パスワードだけが誤り）
    "wrong_password_only": {
        "username": "standard_user",
        "password": "wrong_pass",
    },
}
