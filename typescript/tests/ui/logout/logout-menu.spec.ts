// 左上のメニューの表示と開閉のテスト。
// ログイン済みの画面は、商品一覧画面を開いた状態で始まる
import { test } from '../../../fixtures/loginFixture';
import { LogoutFlow } from '../../../flows/LogoutFlow';
import { expectMenuClosed, expectMenuItems } from '../../../utils/uiAssertions/logoutAssertions';

test.describe('左上のメニューの表示と開閉', () => {

  test('TC-LOGOUT-001：メニューを開くと、5つの項目が仕様どおりの並び順で表示されること', async ({ loggedPage }) => {

    const logoutFlow = new LogoutFlow(loggedPage);

    await logoutFlow.openMenu();

    await expectMenuItems(logoutFlow);
  });

  // ×ボタン・Esc キーの2通りで、閉じる操作だけを切り替えて、同じ確かめ方をする
  const closeCases = [
    {
      id: 'TC-LOGOUT-002',
      title: '×ボタンを押すと、メニューが閉じること',
      closeMenu: (logoutFlow: LogoutFlow) => logoutFlow.closeMenuWithButton(),
    },
    {
      id: 'TC-LOGOUT-003',
      title: 'Esc キーを押すと、メニューが閉じること',
      closeMenu: (logoutFlow: LogoutFlow) => logoutFlow.closeMenuWithEscape(),
    },
  ];

  for (const closeCase of closeCases) {

    test(`${closeCase.id}：${closeCase.title}`, async ({ loggedPage }) => {

      const logoutFlow = new LogoutFlow(loggedPage);

      await logoutFlow.openMenu();

      await closeCase.closeMenu(logoutFlow);

      await expectMenuClosed(logoutFlow);
    });
  }
});
