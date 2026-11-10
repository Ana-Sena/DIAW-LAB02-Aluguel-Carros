import { ArrowUpRight, ArrowRight, CarFront, FileText, ShieldCheck, Wallet } from 'lucide-react';
import Empty from '../components/common/Empty.jsx';
import Stat from '../components/common/Stat.jsx';
import VehicleArt from '../components/vehicles/VehicleArt.jsx';
import CarCard from '../components/vehicles/CarCard.jsx';
import OrderTable from '../components/rentals/OrderTable.jsx';

export default function OverviewPage({ cars, orders, agent, open, setPage }) {
  const active = orders.filter((o) => !['CANCELADO', 'REPROVADO'].includes(o.status));
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">
            <span /> SUA PRÓXIMA VIAGEM
          </span>
          <h2>
            Um novo caminho
            <br />
            espera por você.
          </h2>
          <p>
            Escolha seu carro. Faça seu pedido.
            <br />A gente simplifica o resto.
          </p>
          <button onClick={() => setPage('fleet')}>
            Explorar a frota <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="hero-visual">
          <div className="orbit" />
          <div className="orbit second" />
          <span className="route">LIBERDADE PARA IR ALÉM ↗</span>
          <VehicleArt index={0} />
          <div className="hero-label">
            <CarFront size={17} />
            Seu destino, sua escolha.
          </div>
        </div>
      </section>
      <section className="stats">
        <Stat
          title="Pedidos ativos"
          value={active.length.toString().padStart(2, '0')}
          detail="Sua jornada em andamento"
          icon={FileText}
        />
        <Stat
          title="Aguardando análise"
          value={orders
            .filter((o) => o.status === 'EM_ANALISE')
            .length.toString()
            .padStart(2, '0')}
          detail="Em avaliação pelos agentes"
          icon={Wallet}
        />
        <Stat
          title="Contratos firmados"
          value={orders
            .filter((o) => o.status === 'CONTRATADO')
            .length.toString()
            .padStart(2, '0')}
          detail="Prontos para seguir viagem"
          icon={ShieldCheck}
        />
      </section>
      <div className="section-title">
        <div>
          <h2>
            Pedidos recentes <span>{orders.length}</span>
          </h2>
          <p>Fique por dentro de cada etapa.</p>
        </div>
        <button className="text-button" onClick={() => setPage('orders')}>
          Ver todos os pedidos <ArrowRight size={16} />
        </button>
      </div>
      <OrderTable orders={orders.slice(0, 4)} open={open} />
      <div className="section-title">
        <div>
          <h2>Encontre seu próximo carro</h2>
          <p>Uma escolha para cada caminho.</p>
        </div>
        <button className="text-button" onClick={() => setPage('fleet')}>
          Ver toda a frota <ArrowRight size={16} />
        </button>
      </div>
      <div className="car-grid">
        {cars.slice(0, 3).map((c, i) => (
          <CarCard
            key={c.id}
            car={c}
            index={i}
            agent={agent}
            onSelect={() => open({ type: 'order', car: c })}
          />
        ))}
      </div>
      {cars.length === 0 && (
        <Empty text="Nenhum veículo cadastrado. Um agente pode cadastrar a frota." />
      )}
    </>
  );
}
