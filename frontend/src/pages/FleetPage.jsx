import { useState } from 'react';
import { Search } from 'lucide-react';
import Empty from '../components/common/Empty.jsx';
import CarCard from '../components/vehicles/CarCard.jsx';

export default function FleetPage({ cars, agent, open }) {
  const [search, setSearch] = useState('');
  return (
    <>
      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input
            placeholder="Buscar marca ou modelo…"
            aria-label="Buscar veículos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="muted">{cars.length} veículos na frota</span>
      </div>
      <div className="car-grid">
        {cars
          .filter((c) => `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase()))
          .map((c, i) => (
            <CarCard
              key={c.id}
              car={c}
              index={i}
              agent={agent}
              onSelect={() => open({ type: 'order', car: c })}
            />
          ))}
      </div>
      {!cars.length && <Empty text="A frota ainda não possui veículos cadastrados." />}
    </>
  );
}
