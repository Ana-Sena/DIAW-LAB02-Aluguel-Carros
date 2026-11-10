import { ArrowUpRight } from 'lucide-react';
import { money, roleLabel } from '../../utils/format.js';
import VehicleArt from './VehicleArt.jsx';

export default function CarCard({ car, index, agent, onSelect }) {
  return (
    <article className="car-card">
      <div className="car-image">
        <span>{car.year}</span>
        <VehicleArt index={index} />
      </div>
      <div className="car-info">
        <small>{car.brand.toUpperCase()}</small>
        <h3>{car.model}</h3>
        <p>
          {car.plate} <span>•</span> Matrícula {car.registration}
        </p>
        <p className="owner">
          Proprietário: {car.owner.name} ({roleLabel(car.owner.role)})
        </p>
        <div className="car-price">
          <div>
            <strong>{money(car.dailyRate)}</strong>
            <small>/ dia</small>
          </div>
          {!agent && (
            <button
              className="round-button"
              aria-label={`Solicitar ${car.model}`}
              onClick={onSelect}
            >
              <ArrowUpRight size={21} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
