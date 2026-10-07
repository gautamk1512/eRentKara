const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, context, requireFn) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: requireFn, ...context });
  return exports;
}
async function main() {
  const context = { process: { env: { NEXT_PUBLIC_API_URL: 'http://localhost:8000/api/v1' } }, window: {}, FormData, localStorage: { getItem: () => 'test-session' } };
  const base = load('src/lib/apiBase.ts', context);
  assert.equal(base.getApiBaseUrl(), '/api/v1');
  const server = load('src/lib/apiBase.ts', { process: { env: { BACKEND_URL: 'http://backend:8000/' } } });
  assert.equal(server.getApiBaseUrl(), 'http://backend:8000/api/v1');
  let calls = [];
  context.fetch = async (url, options) => { calls.push({url, options}); return { ok: true, json: async () => ({success: true}) }; };
  const { api } = load('src/lib/api.ts', context, () => base);
  await api.register({ email: 'test@example.test' });
  assert.equal(calls[0].url, '/api/v1/auth/register/');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-session');
  context.fetch = async () => { throw new TypeError('Failed to fetch'); };
  const failing = load('src/lib/api.ts', context, () => base);
  await assert.rejects(failing.api.register({}), /Unable to connect to eRentKarar/);
  context.fetch = async () => ({ok: false, status: 400, json: async () => ({error: {message: 'raw serializer message', details: {email: ['Already registered.']}}})});
  const invalid = load('src/lib/api.ts', context, () => base);
  await assert.rejects(invalid.api.register({}), /email: Already registered/);
  console.log('PASS: same-origin registration, server URL, session header, network and validation errors.');
}
main().catch(error => {console.error(error); process.exit(1)});
