import { Plus } from 'lucide-react';
import { roleLabel } from '../../utils/format.js';
import Field from '../common/Field.jsx';

export default function CarForm({ owners, busy, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget));
        onSubmit({ ...f, year: Number(f.year), dailyRate: Number(f.dailyRate) });
      }}
    >
      <div className="form-grid">
        <Field label="Marca">
          <input name="brand" required maxLength="80" />
        </Field>
        <Field label="Modelo">
          <input name="model" required maxLength="100" />
        </Field>
        <Field label="Matrícula">
          <input name="registration" required maxLength="80" />
        </Field>
        <Field label="Placa (sem hífen)">
          <input
            name="plate"
            placeholder="ABC1D23"
            required
            pattern="[A-Z]{3}[0-9][A-Z0-9][0-9]{2}"
            maxLength="7"
          />
        </Field>
        <Field label="Ano">
          <input name="year" type="number" min="1900" max="2100" defaultValue="2025" required />
        </Field>
        <Field label="Diária (R$)">
          <input
            name="dailyRate"
            type="number"
            min="0.01"
            step="0.01"
            max="9999999999.99"
            required
          />
        </Field>
      </div>
      <Field label="Proprietário">
        <select name="ownerId" required>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} · {roleLabel(o.role)}
            </option>
          ))}
        </select>
      </Field>
      <button disabled={busy} className="primary full">
        {busy ? 'Salvando…' : 'Cadastrar veículo'}
        <Plus size={18} />
      </button>
    </form>
  );
}
