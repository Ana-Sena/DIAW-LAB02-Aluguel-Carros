let csrf;
export async function refreshCsrf() {
  const res = await fetch('/api/auth/csrf', { credentials: 'same-origin' });
  if (!res.ok) throw new Error('Não foi possível conectar ao servidor.');
  csrf = await res.json();
}
export async function api(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { ...options.headers };
  if (method !== 'GET') {
    if (!csrf) await refreshCsrf();
    headers[csrf.headerName] = csrf.token;
    if (options.body && !(options.body instanceof URLSearchParams))
      headers['Content-Type'] = 'application/json';
  }
  let res;
  try {
    res = await fetch(`/api${path}`, {
      ...options,
      method,
      headers,
      credentials: 'same-origin',
      body:
        options.body instanceof URLSearchParams
          ? options.body
          : options.body
            ? JSON.stringify(options.body)
            : undefined,
    });
  } catch {
    throw new Error('Servidor indisponível. Confira se o back-end está em execução.');
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 401 && path !== '/auth/login' && path !== '/auth/me')
      window.dispatchEvent(new Event('session-expired'));
    throw new Error(
      error.fields?.join(' • ') ||
        error.message ||
        {
          401: 'Usuário ou senha inválidos.',
          403: 'Operação não permitida. Atualize a página e tente novamente.',
          409: 'Os dados foram alterados. Atualize a página.',
        }[res.status] ||
        'Não foi possível concluir a operação.',
    );
  }
  return res.status === 204 ? null : res.json();
}
