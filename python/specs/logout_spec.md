# 機能仕様書：Logout（左上のメニュー）

## ■ 機能概要
ECサイト（SauceDemo）のログイン後の各画面の左上にあるメニュー（ハンバーガーメニュー）から、
ログアウトする機能。ログアウトすると Login画面へ戻り、ログインが必要な画面にはアクセスできなくなる。

本仕様は画面ではなく「機能」を対象とする。メニューのうち、本仕様で扱う範囲は次のとおり。

| 扱う | 扱わない（今後の拡張候補） |
|---|---|
| メニューの開閉、Logout、All Items | Reset App State、Dynamic Catalog（子項目 Lazy Load・Spinner・Slider を含む）、About |

対象ユーザー：standard_user
（problem_user等の特殊ユーザーは本仕様の対象外。今後の拡張候補とする）

TS版との対応：TS版の `pages/MenuPage.ts`、`flows/LogoutFlow.ts` に相当する機能。

実機確認：2026-11-09（Playwright調査用スクリプトにて確認）

---

## ■ メニュー

### 表示される画面
- Products、Cart、Checkout Step One、Checkout Step Two、Checkout Complete、商品詳細のすべての画面で、
  ヘッダーの左上に、メニューを開くボタン（三本線のアイコン）が表示される
- Login画面には表示されない
- どの画面でも、メニューの項目と並び順は同じである

### メニューの項目（並び順）

| 順 | 項目 | 本仕様での扱い |
|---|---|---|
| 1 | All Items | 扱う |
| 2 | Dynamic Catalog | 扱わない |
| 3 | About | 扱わない |
| 4 | Logout | 扱う |
| 5 | Reset App State | 扱わない |

### 開閉

| 操作 | 結果 |
|---|---|
| メニューを開くボタンを押す | メニューが開き、上記5項目が表示される |
| メニューの×ボタンを押す | メニューが閉じる |
| メニューが開いた状態で Esc キーを押す | メニューが閉じる |

---

## ■ Logout

| 操作 | 結果 |
|---|---|
| メニューを開いて Logout を押す | Login画面（https://www.saucedemo.com/）へ遷移する |

### ログアウト後の Login画面
- ユーザー名・パスワードの入力欄と Login ボタンが表示される
- ユーザー名・パスワードの入力欄は空である
- エラーメッセージは表示されていない

※ Logout は、メニューが表示される6画面すべてから同じ結果になることを実機確認済み。

### ログアウト後のアクセス制限
- ログアウト後に、ログインが必要な画面へ URL で直接アクセスすると、Login画面へ戻され、
  次の形式のエラーメッセージが表示される

| アクセスした画面 | エラーメッセージ |
|---|---|
| /inventory.html | Epic sadface: You can only access '/inventory.html' when you are logged in. |
| /cart.html | Epic sadface: You can only access '/cart.html' when you are logged in. |
| /inventory-item.html?id=4 | Epic sadface: You can only access '/inventory-item.html' when you are logged in.（クエリは文言に含まれない） |
| /checkout-step-one.html | Epic sadface: You can only access '/checkout-step-one.html' when you are logged in. |
| /checkout-step-two.html | Epic sadface: You can only access '/checkout-step-two.html' when you are logged in. |
| /checkout-complete.html | Epic sadface: You can only access '/checkout-complete.html' when you are logged in. |

- Products画面からログアウトした後にブラウザの「戻る」を押した場合も、Login画面のままで、
  「Epic sadface: You can only access '/inventory.html' when you are logged in.」が表示される
  （ほかの画面からログアウトした後の「戻る」は未確認）

---

## ■ All Items

| 操作 | 結果 |
|---|---|
| Cart、Checkout Step One、Checkout Complete の各画面でメニューを開いて All Items を押す | Products画面（/inventory.html）へ遷移し、メニューは閉じる。カートの中身は変わらない |

※ 実機で確認したのは上記3画面から。Checkout Step Two・商品詳細画面からは未確認。

---

## ■ 業務ルール

- ログイン後のすべての画面から、メニューを使ってログアウトできる
- ログアウトすると、ログインが必要な画面にはアクセスできなくなる
- All Items を使うと、Products画面へ戻れる

---

## ■ 実機で確認したが、意図された仕様か不具合かを判断できない挙動

以下は事実として記録し、本仕様のテスト対象には含めない（扱いは別途判断）。

| 挙動 | 実機確認の結果 |
|---|---|
| ログアウトしてもカートの中身が消えない | ログアウトでログイン状態（cookie）は消えるが、カートの中身（ブラウザの保存領域 localStorage の cart-contents）は残り、同じブラウザで再ログインするとカートが元に戻る |
| メニューの外側をクリックしても閉じない | メニューの外側を覆う領域がなく、外側のクリックでは閉じない |
| Products画面で All Items を押してもメニューが開いたまま | 同じ URL のため遷移が起きず、メニューも閉じない |

### 参考：扱わない項目で確認した挙動（今後の拡張候補の材料として記録）
- Reset App State：カートの中身とバッジは消えるが、画面の表示は再読み込みするまで更新されない（Products画面の「Remove」ボタン、Cart画面の行、Step Two画面の行と金額が残る）。ソートの選択とログイン状態は変わらず、Products画面ではメニューが開いたまま
- Dynamic Catalog：開くと子項目 Lazy Load・Spinner・Slider が表示され、それぞれ /dynamic-catalog-lazy-load.html、/dynamic-catalog-spinner.html、/dynamic-catalog-slider.html へ遷移する
- About：外部サイト（https://saucelabs.com/）へ同じタブで遷移する

---

## ■ 本仕様の対象外

| 項目 | 理由 |
|---|---|
| Reset App State | 画面の表示が更新されないという、判断できない挙動を含むため（今後の拡張候補） |
| Dynamic Catalog と子項目の3画面 | 別の画面群であり、それぞれ仕様の作成が必要なため（今後の拡張候補） |
| About | 外部サイトへの遷移のため（今後の拡張候補） |
| 上記「判断できない挙動」3件 | 意図された仕様か不具合かを判断できないため |
| 遷移先の画面（Login・Products）の中身 | それぞれの画面の仕様で扱う。本仕様では Logout 後の Login画面の状態までを扱う |
| 特殊ユーザー（problem_user等） | 今後の拡張候補 |
| Chromium以外のブラウザ（Firefox・WebKit）での挙動 | 未確認。Python版のテストは Chromium で実行している |
