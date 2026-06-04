// LogoutFlow
import { LogoutFlow } from '../../flows/LogoutFlow';

/*
================================
Logout UI Assertions
================================
責務：
- Logout機能のUI検証
- Flow経由で業務レベル検証を実施
================================
*/

/*
================================
ログアウト成功
================================
*/
export async function expectLogoutSuccess(
  logoutFlow: LogoutFlow
) {

  await logoutFlow.expectOnLoginPage();
}