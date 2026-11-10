import {
  ArrowUpRight,
  CarFront,
  LayoutDashboard,
  FileText,
  UserRound,
  LogOut,
  Plus,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import { roleLabel } from '../../utils/format.js';

export default function AppLayout({
  user,
  agent,
  page,
  setPage,
  orders,
  navOpen,
  setNavOpen,
  logout,
  open,
  children,
}) {
  const headings = {
    overview: ['Visão geral', 'Todos os seus caminhos, em um só lugar.'],
    orders: [agent ? 'Gestão de pedidos' : 'Meus pedidos', 'Acompanhe cada etapa do aluguel.'],
    fleet: ['Nossa frota', 'Encontre o carro que combina com seu próximo destino.'],
    profile: ['Meu perfil', 'Mantenha seus dados atualizados para seguir em frente.'],
  };
  const nav = [
    ['overview', LayoutDashboard, 'Visão geral'],
    ['orders', FileText, agent ? 'Gestão de pedidos' : 'Meus pedidos'],
    ['fleet', CarFront, 'Frota de veículos'],
    ...(!agent ? [['profile', UserRound, 'Meu perfil']] : []),
  ];
  return (
    <div className="app">
      <aside className={navOpen ? 'sidebar open' : 'sidebar'}>
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setPage('overview');
          }}
        >
          <img src="/logo.svg" alt="" />
          rota<span>livre</span>
          <span className="brand-dot">®</span>
        </a>
        <span className="nav-caption">ESPAÇO {agent ? 'DO AGENTE' : 'DO CLIENTE'}</span>
        <nav>
          {nav.map(([key, Icon, label]) => (
            <button
              key={key}
              className={page === key ? 'selected' : ''}
              onClick={() => {
                setPage(key);

                setNavOpen(false);
              }}
            >
              <Icon size={19} />
              {label}
              {key === 'orders' && <span className="nav-count">{orders.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <ShieldCheck size={25} />
            <strong>Simples do início ao fim.</strong>
            <p>Seus pedidos e contratos sempre à mão.</p>
            <span>
              Você no controle <ArrowUpRight size={16} />
            </span>
          </div>
          <div className="user-block">
            <span className="avatar">{user.name.slice(0, 2).toUpperCase()}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{roleLabel(user.role)}</small>
            </div>
            <button className="icon-button" onClick={logout} title="Sair" aria-label="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Abrir menu"
            onClick={() => setNavOpen(!navOpen)}
          >
            <Menu />
          </button>
          <span>
            Minha conta <span className="crumb">/</span> <strong>{headings[page][0]}</strong>
          </span>
          <span className="secure">
            <span />
            Ambiente seguro
          </span>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <span className="eyebrow">MOBILIDADE COM LIBERDADE</span>
              <h1>{headings[page][0]}</h1>
              <p>{headings[page][1]}</p>
            </div>
            {!agent && page !== 'profile' && (
              <button className="primary" onClick={() => open({ type: 'order' })}>
                <Plus size={18} />
                Novo pedido
              </button>
            )}
            {agent && page === 'fleet' && (
              <button className="primary" onClick={() => open({ type: 'car' })}>
                <Plus size={18} />
                Cadastrar veículo
              </button>
            )}
          </div>
          {children}
          <footer>
            Rota Livre <span>Feito para você ir mais longe.</span>
            <small>Laboratório 02 · PUC Minas</small>
          </footer>
        </main>
      </div>
    </div>
  );
}
