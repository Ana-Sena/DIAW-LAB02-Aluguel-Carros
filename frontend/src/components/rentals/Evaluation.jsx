import { useState } from 'react';
import { Check } from 'lucide-react';
import { money, roleLabel } from '../../utils/format.js';
import Field from '../common/Field.jsx';

export default function Evaluation({ order, bank, busy, onSubmit }) {
  const [approved, setApproved] = useState('true'),
    [credit, setCredit] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget));
        onSubmit({
          approved: approved === 'true',
          opinion: f.opinion,
          creditAmount: credit && approved === 'true' ? Number(f.creditAmount) : null,
          installments: credit && approved === 'true' ? Number(f.installments) : null,
        });
      }}
    >
      <p className="muted">
        {order.customer.name} · {money(order.total)} · Proprietário previsto:{' '}
        {roleLabel(order.ownershipType)}
      </p>
      <Field label="Resultado da análise">
        <select value={approved} onChange={(e) => setApproved(e.target.value)}>
          <option value="true">Aprovar pedido</option>
          <option value="false">Reprovar pedido</option>
        </select>
      </Field>
      <Field label="Parecer financeiro">
        <textarea
          name="opinion"
          required
          maxLength="1000"
          placeholder="Registre a justificativa da análise…"
        />
      </Field>
      {bank && approved === 'true' && (
        <>
          <label className="checkbox">
            <input type="checkbox" checked={credit} onChange={(e) => setCredit(e.target.checked)} />
            Associar contrato de crédito do meu banco
          </label>
          {credit && (
            <div className="form-grid">
              <Field label="Valor do crédito (R$)">
                <input
                  type="number"
                  name="creditAmount"
                  min="0.01"
                  max={order.total}
                  step="0.01"
                  required
                />
              </Field>
              <Field label="Parcelas">
                <input type="number" name="installments" min="1" max="120" required />
              </Field>
            </div>
          )}
        </>
      )}
      <button className="primary full" disabled={busy}>
        {busy ? 'Registrando…' : 'Registrar parecer'}
        <Check size={18} />
      </button>
    </form>
  );
}
