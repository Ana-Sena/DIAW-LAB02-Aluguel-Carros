import { Check, Pencil } from 'lucide-react';
import { money, date, roleLabel } from '../../utils/format.js';
import Badge from '../common/Badge.jsx';
import FinancialProfile from '../clients/FinancialProfile.jsx';

export default function Detail({ order: o, agent, busy, open }) {
  return (
    <div className="detail">
      <div className="detail-top">
        <div>
          <small>#{o.id.slice(0, 8)}</small>
          <h3>
            {o.vehicle.brand} {o.vehicle.model}
          </h3>
          <p>
            {o.vehicle.plate} · {o.vehicle.registration}
          </p>
        </div>
        <Badge status={o.status} />
      </div>
      <dl>
        <dt>Cliente</dt>
        <dd>{o.customer.name}</dd>
        <dt>Período</dt>
        <dd>
          {date(o.startDate)} a {date(o.endDate)}
        </dd>
        <dt>Valor total</dt>
        <dd>{money(o.total)}</dd>
        <dt>Proprietário previsto</dt>
        <dd>{roleLabel(o.ownershipType)}</dd>
        <dt>Observações</dt>
        <dd>{o.notes || 'Nenhuma observação.'}</dd>
        {o.opinion && (
          <>
            <dt>Parecer financeiro</dt>
            <dd>
              {o.opinion}
              <small>{o.evaluator?.name}</small>
            </dd>
          </>
        )}
        {o.bank && (
          <>
            <dt>Crédito concedido</dt>
            <dd>
              {o.bank.name} · {money(o.creditAmount)} · {o.installments} parcelas
            </dd>
          </>
        )}
        {o.contractNumber && (
          <>
            <dt>Número do contrato</dt>
            <dd className="contract-number">{o.contractNumber}</dd>
            <dt>Contratado em</dt>
            <dd>{new Date(o.contractedAt).toLocaleString('pt-BR')}</dd>
          </>
        )}
      </dl>
      {agent && <FinancialProfile customerId={o.customer.id} />}
      <div className="form-actions">
        {!['CONTRATADO', 'CANCELADO'].includes(o.status) && (
          <button
            disabled={busy}
            className="secondary"
            onClick={() => open({ type: 'order', order: o })}
          >
            <Pencil size={16} />
            Modificar
          </button>
        )}
        {agent && o.status === 'EM_ANALISE' && (
          <button className="primary" onClick={() => open({ type: 'evaluate', order: o })}>
            Avaliar pedido
          </button>
        )}
        {!agent && o.status === 'APROVADO' && (
          <button className="primary" onClick={() => open({ type: 'contract', order: o })}>
            Contratar <Check size={16} />
          </button>
        )}
        {!agent && !['CONTRATADO', 'CANCELADO'].includes(o.status) && (
          <button className="danger-text" onClick={() => open({ type: 'cancel', order: o })}>
            Cancelar pedido
          </button>
        )}
      </div>
    </div>
  );
}
