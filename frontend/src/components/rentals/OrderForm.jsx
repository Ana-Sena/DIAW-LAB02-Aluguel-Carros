import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { money, today } from '../../utils/format.js';
import Field from '../common/Field.jsx';

export default function OrderForm({
  cars,
  initial,
  selectedCar,
  busy,
  onSubmit,
  profileComplete,
  onProfile,
}) {
  const [carId, setCarId] = useState(initial?.vehicle.id || selectedCar?.id || cars[0]?.id || ''),
    [start, setStart] = useState(initial?.startDate || today()),
    [end, setEnd] = useState(initial?.endDate || today());
  const c = cars.find((c) => c.id === carId),
    days = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
  if (!profileComplete)
    return (
      <div className="confirmation">
        <p>
          Complete seu perfil com CPF, RG, endereço e profissão antes de criar seu primeiro pedido.
        </p>
        <button className="primary" onClick={onProfile}>
          Completar meu perfil <ArrowRight size={18} />
        </button>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget));
        onSubmit(f);
      }}
    >
      <Field label="Veículo">
        <select name="vehicleId" value={carId} onChange={(e) => setCarId(e.target.value)} required>
          {!cars.length && <option value="">Nenhum veículo cadastrado</option>}
          {cars.map((c) => (
            <option key={c.id} value={c.id}>
              {c.brand} {c.model} · {c.plate} · {money(c.dailyRate)}/dia
            </option>
          ))}
        </select>
      </Field>
      <div className="form-grid">
        <Field label="Retirada">
          <input
            type="date"
            name="startDate"
            value={start}
            min={today()}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </Field>
        <Field label="Devolução">
          <input
            type="date"
            name="endDate"
            value={end}
            min={start || today()}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </Field>
      </div>
      <Field label="Proprietário previsto no contrato">
        <select name="ownershipType" defaultValue={initial?.ownershipType || 'EMPRESA'}>
          <option value="CLIENTE">Cliente · você</option>
          <option value="EMPRESA">Empresa · agente avaliador</option>
          <option value="BANCO">Banco · agente avaliador</option>
        </select>
      </Field>
      <Field label="Observações (opcional)">
        <textarea name="notes" maxLength="1000" defaultValue={initial?.notes} />
      </Field>
      <div className="estimate">
        <span>
          {days > 0 ? `${days} diária(s) · retirada e devolução inclusas` : 'Confira o período'}
        </span>
        <strong>{money(c && days > 0 ? c.dailyRate * days : 0)}</strong>
      </div>
      <p className="muted">
        O pedido passará por análise financeira. Alterações exigem nova avaliação.
      </p>
      <button disabled={busy || !c} className="primary full">
        {busy ? 'Enviando…' : initial ? 'Salvar e reenviar para análise' : 'Enviar pedido'}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
