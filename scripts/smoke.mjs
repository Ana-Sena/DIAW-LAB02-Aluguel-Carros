import assert from 'node:assert/strict';

// Execute somente contra o perfil demo: cria dados fictícios em memória.
const base = process.env.SMOKE_URL || 'http://127.0.0.1:5173';
class Session {
  cookie = '';
  token = null;
  async request(path, { method = 'GET', body, form, expected = 200 } = {}) {
    const headers = {};
    if (this.cookie) headers.Cookie = this.cookie;
    if (method !== 'GET' && this.token) headers[this.token.headerName] = this.token.token;
    if (body) headers['Content-Type'] = 'application/json';
    if (form) headers['Content-Type'] = 'application/x-www-form-urlencoded';
    const response = await fetch(`${base}/api${path}`, {
      method, headers, body: form ? new URLSearchParams(form) : body ? JSON.stringify(body) : undefined,
    });
    for (const c of response.headers.getSetCookie()) if (c.startsWith('JSESSIONID=')) this.cookie = c.split(';')[0];
    const text = await response.text();
    assert.equal(response.status, expected, `${method} ${path}: ${text}`);
    return text ? JSON.parse(text) : null;
  }
  async csrf() { this.token = await this.request('/auth/csrf'); }
  async login(username, password = 'Demo@12345') {
    await this.csrf();
    await this.request('/auth/login', { method: 'POST', form: { username, password }, expected: 204 });
    await this.csrf();
  }
}
const html = await fetch(base);
assert.equal(html.status, 200);
assert.match(await html.text(), /Rota Livre/);
const client = new Session();
await client.request('/rentals', { expected: 401 });
await client.login('cliente');
assert.equal((await client.request('/auth/me')).role, 'CLIENTE');
const cars = await client.request('/vehicles');
assert.ok(cars.length >= 1);
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const startDate = tomorrow.toLocaleDateString('en-CA');
const body = { vehicleId: cars[0].id, startDate, endDate: startDate, ownershipType: 'BANCO', notes: 'Smoke HTTP — dados fictícios' };
let order = await client.request('/rentals', { method: 'POST', body, expected: 201 });
assert.equal(order.status, 'EM_ANALISE');
order = await client.request(`/rentals/${order.id}`, { method: 'PUT', body: { ...body, notes: 'Pedido modificado' } });
assert.equal(order.notes, 'Pedido modificado');
order = await client.request(`/rentals/${order.id}/cancel`, { method: 'POST' });
assert.equal(order.status, 'CANCELADO');
const next = await client.request('/rentals', { method: 'POST', body, expected: 201 });
const bank = new Session(); await bank.login('banco');
const customer = await bank.request(`/clients/${next.customer.id}`);
assert.ok(customer.incomes.length > 0);
assert.ok(!Object.hasOwn(customer, 'passwordHash'));
await bank.request(`/rentals/${next.id}/evaluate`, { method: 'POST', body: { approved: true, opinion: 'Aprovação fictícia de teste', creditAmount: 100, installments: 2 } });
const contracted = await client.request(`/rentals/${next.id}/contract`, { method: 'POST' });
assert.equal(contracted.status, 'CONTRATADO');
assert.ok(contracted.contractNumber);
assert.equal(contracted.vehicle.owner.role, 'BANCO');
await client.request('/auth/logout', { method: 'POST', expected: 204 });
await client.request('/auth/me', { expected: 401 });
console.log('Smoke HTTP aprovado: proxy, sessão, CSRF, pedido, alteração, cancelamento, análise, crédito, contrato e logout.');
