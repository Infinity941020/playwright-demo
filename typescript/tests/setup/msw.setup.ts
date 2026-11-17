import { server } from '../../mocks/server';

/*
================================
MSW Setup（最終安定版）
================================
責務：
- MSW即時起動（Playwright依存なし）
- 全テスト共通インターセプト
- Nodeプロセス単位で管理
================================
*/

/*
================================
MSW 起動
================================
重要：
test.beforeAll は使わない（Workerズレ防止）
================================
*/
server.listen({
  onUnhandledRequest: 'bypass',
});

/*
================================
安全終了処理
================================
プロセス終了時に確実にクローズ
================================
*/
process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
process.once('exit', () => server.close());