// LoginFlow
import { LoginFlow } from '../../flows/LoginFlow';

/*
================================
Login UI Assertions
================================
責務：
- Login機能のUI検証
- Flow経由で業務レベル検証を実施
================================
*/

/*
================================
ログイン成功
================================
*/
export async function expectLoginSuccess(
  loginFlow: LoginFlow
) {

  await loginFlow.expectLoginSuccess();
}

/*
================================
ログイン失敗
================================
*/
export async function expectLoginError(
  loginFlow: LoginFlow
) {

  await loginFlow.expectLoginError();
}

/*
================================
ログイン画面表示
================================
*/
export async function expectOnLoginPage(
  loginFlow: LoginFlow
) {

  await loginFlow.expectOnLoginPage();
}