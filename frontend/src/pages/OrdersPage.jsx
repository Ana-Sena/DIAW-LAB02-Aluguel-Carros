import { useState } from 'react';
import { Search } from 'lucide-react';
import { labels } from '../utils/format.js';
import OrderTable from '../components/rentals/OrderTable.jsx';

export default function OrdersPage({ orders, open }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const visibleOrders = orders.filter(
    (o) =>
      (!filter || o.status === filter) &&
      `${o.vehicle.brand} ${o.vehicle.model} ${o.customer.name} ${o.id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input
            aria-label="Buscar pedidos"
            placeholder="Buscar por veículo, cliente ou pedido…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filtrar por status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          {['EM_ANALISE', 'APROVADO', 'REPROVADO', 'CONTRATADO', 'CANCELADO'].map((s) => (
            <option key={s} value={s}>
              {labels[s]}
            </option>
          ))}
        </select>
      </div>
      <OrderTable orders={visibleOrders} open={open} />
    </>
  );
}
