import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function FinancialProfile({ customerId }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api(`/clients/${customerId}`)
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [customerId]);
  if (error)
    return (
      <p role="alert" className="error">
        {error}
      </p>
    );
  if (!profile) return <p className="muted">Carregando dados para análise…</p>;
  const money = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <section className="financial-profile">
      <h3>Dados para análise financeira</h3>
      <dl>
        <dt>CPF / RG</dt>
        <dd>
          {profile.cpf || 'Não informado'} / {profile.rg || 'Não informado'}
        </dd>
        <dt>Endereço</dt>
        <dd>{profile.address || 'Não informado'}</dd>
        <dt>Profissão</dt>
        <dd>{profile.profession || 'Não informada'}</dd>
        <dt>Empregadores e rendimentos mensais</dt>
        <dd>
          {profile.incomes.length
            ? profile.incomes.map((i, n) => (
                <div key={n}>
                  {i.employer}: {money(i.amount)}
                </div>
              ))
            : 'Nenhum rendimento informado.'}
        </dd>
      </dl>
    </section>
  );
}
