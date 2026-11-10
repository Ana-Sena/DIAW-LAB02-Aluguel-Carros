import { useState } from 'react';
import { UserRound, Plus, X, Check } from 'lucide-react';
import { api } from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import Field from '../components/common/Field.jsx';

export default function ProfilePage({ user, setUser, action, busy, onDelete }) {
  const [incomes, setIncomes] = useState(user.incomes || []);
  return (
    <div className="profile-layout">
      <section className="panel">
        <h2>Dados do contratante</h2>
        <p className="muted">Seus dados são necessários para a análise do aluguel.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = Object.fromEntries(new FormData(e.currentTarget));
            action(async () => {
              const p = await api('/clients/me', {
                method: 'PUT',
                body: { ...f, incomes: incomes.map((i) => ({ ...i, amount: Number(i.amount) })) },
              });
              setUser(p);
            }, 'Perfil atualizado.');
          }}
        >
          <Field label="Nome completo">
            <input name="name" defaultValue={user.name} maxLength="200" required />
          </Field>
          <div className="form-grid">
            <Field label="CPF (somente números)">
              <input
                name="cpf"
                defaultValue={user.cpf || ''}
                inputMode="numeric"
                pattern="[0-9]{11}"
                maxLength="11"
                required
              />
            </Field>
            <Field label="RG">
              <input name="rg" defaultValue={user.rg || ''} maxLength="30" required />
            </Field>
          </div>
          <Field label="Endereço completo">
            <input name="address" defaultValue={user.address || ''} maxLength="255" required />
          </Field>
          <Field label="Profissão">
            <input
              name="profession"
              defaultValue={user.profession || ''}
              maxLength="100"
              required
            />
          </Field>
          <div className="section-title compact">
            <h3>Empregadores e rendimentos</h3>
            <span className="muted">{incomes.length}/3</span>
          </div>
          {incomes.map((income, i) => (
            <div className="income-row" key={i}>
              <Field label={`Empregador ${i + 1}`}>
                <input
                  value={income.employer}
                  required
                  maxLength="200"
                  onChange={(e) =>
                    setIncomes(
                      incomes.map((item, n) =>
                        n === i ? { ...item, employer: e.target.value } : item,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Renda mensal (R$)">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max="9999999999.99"
                  required
                  value={income.amount}
                  onChange={(e) =>
                    setIncomes(
                      incomes.map((item, n) =>
                        n === i ? { ...item, amount: e.target.value } : item,
                      ),
                    )
                  }
                />
              </Field>
              <button
                type="button"
                className="icon-button"
                aria-label={`Remover empregador ${i + 1}`}
                onClick={() => setIncomes(incomes.filter((_, n) => n !== i))}
              >
                <X size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-button"
            disabled={incomes.length >= 3}
            onClick={() => setIncomes([...incomes, { employer: '', amount: '' }])}
          >
            <Plus size={16} />
            Adicionar empregador
          </button>
          <div className="form-actions">
            <button disabled={busy} className="primary">
              {busy ? 'Salvando…' : 'Salvar alterações'}
              <Check size={17} />
            </button>
          </div>
        </form>
      </section>
      <aside className="profile-aside">
        <UserRound size={30} />
        <h3>Sua conta</h3>
        <p>@{user.username}</p>
        <Badge status="CLIENTE" />
        <hr />
        <p>
          Até três vínculos empregatícios podem ser informados. Cadastre os rendimentos mensais em
          reais.
        </p>
        <button className="danger-text" onClick={onDelete}>
          Excluir minha conta
        </button>
      </aside>
    </div>
  );
}
