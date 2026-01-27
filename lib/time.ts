// lib/time.ts
export function now(req?: { headers?: Headers }) {
  if (process.env.TEST_MODE === '1' && req?.headers?.get('x-test-now-ms')) {
    return Number(req.headers.get('x-test-now-ms'));
  }
  return Date.now();
}
