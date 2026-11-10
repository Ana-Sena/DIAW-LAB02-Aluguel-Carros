import { useState } from 'react';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { api, refreshCsrf } from '../services/api.js';
import Field from '../components/common/Field.jsx';
import VehicleArt from '../components/vehicles/VehicleArt.jsx';

export default function AuthPage({ onLogin }) {
  const [register, setRegister] = useState(false),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (register) await api('/auth/register', { method: 'POST', body: f });
      await api('/auth/login', {
        method: 'POST',
        body: new URLSearchParams({ username: f.username.toLowerCase(), password: f.password }),
      });
      await refreshCsrf();
      onLogin(await api('/auth/me'));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth">
      <section className="auth-story">
        <a className="brand" href="/">
          <img src="/logo.svg" alt="" />
          rota<span>livre</span>
        </a>
        <div>
          <span className="eyebrow light">SEU PRÓXIMO CAMINHO COMEÇA AQUI</span>
          <h1>
            Mais liberdade.
            <br />
            Menos burocracia.
          </h1>
          <p>
            Do primeiro pedido à assinatura do contrato.
            <br />
            Seu aluguel, em um só lugar.
          </p>
          <div className="auth-car">
            <VehicleArt />
          </div>
          <div className="auth-points">
            <span>
              <ShieldCheck />
              Acesso protegido
            </span>
            <span>
              <FileText />
              Contratos organizados
            </span>
          </div>
        </div>
        <small>Laboratório 02 · Engenharia de Software · PUC Minas</small>
      </section>
      <section className="auth-panel">
        <div className="auth-form">
          <span className="eyebrow">BEM-VINDO À ROTA LIVRE</span>
          <h2>{register ? 'Vamos começar?' : 'Bom ter você de volta.'}</h2>
          <p>
            {register
              ? 'Crie sua conta para acessar o sistema.'
              : 'Entre para acompanhar seus próximos caminhos.'}
          </p>
          <form onSubmit={submit}>
            {register && (
              <>
                <Field label="Nome completo ou razão social">
                  <input name="name" required maxLength="200" autoComplete="name" />
                </Field>
                <Field label="Tipo de conta">
                  <select name="role">
                    <option value="CLIENTE">Cliente</option>
                    <option value="EMPRESA">Agente · Empresa</option>
                    <option value="BANCO">Agente · Banco</option>
                  </select>
                </Field>
                <small>Cadastro acadêmico: agentes não passam por verificação institucional.</small>
              </>
            )}
            <Field label="Usuário">
              <input
                name="username"
                autoComplete="username"
                required
                pattern="[a-zA-Z0-9_.-]{3,80}"
                placeholder="Seu nome de usuário"
                title="De 3 a 80 letras, números, pontos, hífens ou sublinhados"
              />
            </Field>
            <Field label="Senha">
              <input
                type="password"
                name="password"
                required
                minLength="8"
                maxLength="72"
                autoComplete={register ? 'new-password' : 'current-password'}
                placeholder="Sua senha"
              />
            </Field>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="primary full" disabled={busy}>
              {busy ? 'Aguarde…' : register ? 'Criar conta' : 'Entrar na minha conta'}
              <ArrowRight size={18} />
            </button>
          </form>
          <p className="auth-switch">
            {register ? 'Já tem uma conta?' : 'Ainda não tem conta?'}{' '}
            <button
              onClick={() => {
                setRegister(!register);
                setError('');
              }}
            >
              {register ? 'Entrar' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
