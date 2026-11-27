# Login画面 テストケース

共通の前提：未ログイン状態でLogin画面を開いている

対応する仕様書：login_spec.md
対応するテスト：TS版は `typescript/tests/ui/login/`、Python版は `python/tests/ui/login/`（両版とも同じ9件。下の「両版のテストとの対応」を参照）
実行するブラウザ：TS版は Chromium・Firefox・WebKit、Python版は Chromium
確定日：2026-07-30

---

## TC-LOGIN-001
■ テスト内容：正しいユーザー名・パスワードでログインできること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名に "standard_user" を入力
  2. パスワードに "secret_sauce" を入力
  3. Loginボタンをクリック
■ 期待結果：Inventory画面へ遷移する
■ 優先度：高

---

## TC-LOGIN-002
■ テスト内容：ユーザー名未入力でログイン失敗すること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名を空欄のままにする
  2. パスワードに "secret_sauce" を入力
  3. Loginボタンをクリック
■ 期待結果：
  - "Epic sadface: Username is required" が表示される
  - 画面遷移しない
■ 優先度：高

---

## TC-LOGIN-003
■ テスト内容：パスワード未入力でログイン失敗すること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名に "standard_user" を入力
  2. パスワードを空欄のままにする
  3. Loginボタンをクリック
■ 期待結果：
  - "Epic sadface: Password is required" が表示される
  - 画面遷移しない
■ 優先度：高

---

## TC-LOGIN-004
■ テスト内容：ユーザー名・パスワード両方未入力でログイン失敗すること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名・パスワードともに空欄のままにする
  2. Loginボタンをクリック
■ 期待結果：
  - "Epic sadface: Username is required" が表示される（ユーザー名側優先）
  - 画面遷移しない
■ 優先度：中

---

## TC-LOGIN-005
■ テスト内容：存在しないユーザー名でログイン失敗すること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名に存在しないID（例："invalid_user"）を入力
  2. パスワードに "secret_sauce" を入力
  3. Loginボタンをクリック
■ 期待結果：
  - "Epic sadface: Username and password do not match any user in this service" が表示される
  - 画面遷移しない
■ 優先度：高

---

## TC-LOGIN-006
■ テスト内容：正しいユーザー名・誤ったパスワードでログイン失敗すること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名に "standard_user" を入力
  2. パスワードに誤った値（例："wrong_password"）を入力
  3. Loginボタンをクリック
■ 期待結果：
  - "Epic sadface: Username and password do not match any user in this service" が表示される
  - 画面遷移しない
■ 優先度：高

---

## TC-LOGIN-007
■ テスト内容：ロック済みユーザーでログイン失敗すること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名に "locked_out_user" を入力
  2. パスワードに "secret_sauce" を入力
  3. Loginボタンをクリック
■ 期待結果：
  - "Epic sadface: Sorry, this user has been locked out." が表示される
  - 画面遷移しない
■ 優先度：高

---

## TC-LOGIN-008
■ テスト内容：ログイン失敗後、ユーザー名の入力値が保持されること
■ 前提条件：未ログイン状態でLogin画面を開いている
■ 操作手順：
  1. ユーザー名に "standard_user" を入力
  2. パスワードを空欄のままにする
  3. Loginボタンをクリック
  4. エラー表示後、ユーザー名入力欄の値を確認する
■ 期待結果：ユーザー名入力欄に "standard_user" が保持されている
■ 優先度：低

---

## ■ サマリー表

| テストID | 分類 | 優先度 | 実装方針 |
|---|---|---|---|
| TC-LOGIN-001 | 正常系 | 高 | 個別実装 |
| TC-LOGIN-002 | 異常系（ユーザー名未入力） | 高 | 個別実装 |
| TC-LOGIN-003 | 異常系（パスワード未入力） | 高 | 個別実装 |
| TC-LOGIN-004 | 異常系（両方未入力） | 中 | 個別実装 |
| TC-LOGIN-005 | 異常系（ユーザー名側の不一致） | 高 | TC-LOGIN-006 とデータを切り替えて共通化 |
| TC-LOGIN-006 | 異常系（パスワード側の不一致） | 高 | TC-LOGIN-005 とデータを切り替えて共通化 |
| TC-LOGIN-007 | 異常系（ロック制御） | 高 | 個別実装 |
| TC-LOGIN-008 | 補助系（入力値保持） | 低 | 個別実装 |

## ■ 対象外としたもの

| 項目 | 理由 |
|---|---|
| ユーザー名・パスワード両方誤り（無効×無効） | 「ユーザー名だけ誤り」「パスワードだけ誤り」で同じエラーメッセージが出ることを確認できていれば、両方誤りでも結果が変わる可能性は低く、テスト実行コストに見合う価値が低いため（判断の記録 python/decisions.md の「テストケース一覧との照合漏れ（Login画面）」も参照） |
| 特殊ユーザー（problem_user等。locked_out_userを除く） | 今後の拡張候補（両版に同時に反映する前提） |

## ■ 両版のテストとの対応

両版とも、テストケース8件と補助のテスト1件の、同じ9件を実装している。

| テストID | TS版（typescript/tests/ui/login/） | Python版（python/tests/ui/login/） |
|---|---|---|
| TC-LOGIN-001 | login-success.spec.ts「TC-LOGIN-001：…」 | test_login_success.py `test_login_success_shows_inventory` |
| TC-LOGIN-002 | login-failure.spec.ts「TC-LOGIN-002：…」 | test_login_failure.py `test_missing_username` |
| TC-LOGIN-003 | login-failure.spec.ts「TC-LOGIN-003：…」 | test_login_failure.py `test_missing_password` |
| TC-LOGIN-004 | login-failure.spec.ts「TC-LOGIN-004：…」 | test_login_failure.py `test_missing_username_and_password` |
| TC-LOGIN-005 | login-failure.spec.ts「TC-LOGIN-005：…」（TC-LOGIN-006 とデータを切り替える形） | test_login_failure.py `test_single_field_wrong[TC-LOGIN-005]` |
| TC-LOGIN-006 | login-failure.spec.ts「TC-LOGIN-006：…」（TC-LOGIN-005 とデータを切り替える形） | test_login_failure.py `test_single_field_wrong[TC-LOGIN-006]` |
| TC-LOGIN-007 | login-failure.spec.ts「TC-LOGIN-007：…」 | test_login_failure.py `test_locked_out_user` |
| TC-LOGIN-008 | login-failure.spec.ts「TC-LOGIN-008：…」 | test_login_failure.py `test_username_retained_after_failure` |
| （補助） | logged-page-fixture.spec.ts「テストケース外（部品の動作確認）：…」 | test_logged_page_fixture.py `test_logged_page_starts_on_inventory_page` |

## ■ テストケース以外の補助テスト

| テスト | 目的 |
|---|---|
| ログイン済みの画面を用意する部品の動作確認（上の表の「補助」） | 保存したログイン状態を使って、ログインの操作をしなくても Inventory画面が開いていることの確認。テストケースの件数には含めない |
