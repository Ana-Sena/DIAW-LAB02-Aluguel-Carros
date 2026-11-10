import { ArrowUpRight, CarFront } from 'lucide-react';
import { money, date } from '../../utils/format.js';
import Badge from '../common/Badge.jsx';
import Empty from '../common/Empty.jsx';

export default function OrderTable({ orders, open }) {
  return (
    <div className="table-wrap">
      {orders.length ? (
        <table>
          <thead>
            <tr>
              <th>VEÍCULO / PEDIDO</th>
              <th>PERÍODO</th>
              <th>VALOR TOTAL</th>
              <th>STATUS</th>
              <th>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <div className="vehicle-cell">
                    <span className="tiny-car">
                      <CarFront size={23} />
                    </span>
                    <div>
                      <strong>
                        {o.vehicle.brand} {o.vehicle.model}
                      </strong>
                      <small>
                        #{o.id.slice(0, 8)} · {o.customer.name}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  {date(o.startDate)}
                  <small>até {date(o.endDate)}</small>
                </td>
                <td>
                  <strong>{money(o.total)}</strong>
                </td>
                <td>
                  <Badge status={o.status} />
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={`Ver pedido ${o.id.slice(0, 8)}`}
                    onClick={() => open({ type: 'detail', order: o })}
                  >
                    <ArrowUpRight size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Empty text="Seus pedidos aparecerão aqui. Escolha um carro para começar." />
      )}
    </div>
  );
}
