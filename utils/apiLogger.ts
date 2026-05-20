/*
================================
APIレスポンスログ出力
（軽量版）
================================
*/

import { APIResponse } from '@playwright/test';

export async function logApiResponse(
  response: APIResponse
): Promise<void> {

  const body = await response.json();

  console.log('================================');
  console.log('API RESPONSE LOG');
  console.log('================================');

  console.log('URL:');
  console.log(response.url());

  console.log('');

  console.log('STATUS:');
  console.log(response.status());

  console.log('');

  /*
  =================================
  HEADERSは重要なものだけ表示
  =================================
  */
  console.log('HEADERS:');

  console.log({
    'content-type': response.headers()['content-type'],
    server: response.headers()['server']
  });

  console.log('');

  /*
  =================================
  BODY大量対策
  =================================
  */

  if (Array.isArray(body)) {

    console.log('BODY:');
    console.log(`Array Length: ${body.length}`);

    console.log('First Item Preview:');
    console.log(body[0]);

  } else {

    console.log('BODY:');
    console.log(body);
  }

  console.log('================================');
}