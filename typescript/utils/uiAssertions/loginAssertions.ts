import { LoginFlow } from '../../flows/LoginFlow';

// ログイン画面の表示や状態を確かめる関数。
// テストからは画面の部品を直接呼ばず、ログインの操作の単位を通して確かめる

export async function expectLoginSuccess(loginFlow: LoginFlow) {
  await loginFlow.expectLoginSuccess();
}

export async function expectLoginErrorMessage(loginFlow: LoginFlow, message: string) {
  await loginFlow.expectLoginErrorMessage(message);
}

export async function expectOnLoginPage(loginFlow: LoginFlow) {
  await loginFlow.expectOnLoginPage();
}

export async function expectUsernameRetained(loginFlow: LoginFlow, username: string) {
  await loginFlow.expectUsernameRetained(username);
}

export async function expectNoLoginError(loginFlow: LoginFlow) {
  await loginFlow.expectNoLoginError();
}

export async function expectLoginInputsEmpty(loginFlow: LoginFlow) {
  await loginFlow.expectLoginInputsEmpty();
}
