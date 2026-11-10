import { Check } from 'lucide-react';
import useApplication from './hooks/useApplication';
import AppLayout from './components/layout/AppLayout';
import AppModal from './components/layout/AppModal';
import AuthPage from './pages/AuthPage';
import OverviewPage from './pages/OverviewPage';
import OrdersPage from './pages/OrdersPage';
import FleetPage from './pages/FleetPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const application = useApplication();
  const {
    user,
    setUser,
    initial,
    page,
    setPage,
    cars,
    orders,
    modal,
    error,
    setError,
    notice,
    busy,
    loading,
    load,
    open,
    action,
    agent,
  } = application;

  if (initial) return <div className="loading">Carregando Rota Livre…</div>;
  if (!user) {
    return (
      <>
        <AuthPage
          onLogin={(account) => {
            setUser(account);
            setError('');
          }}
        />
        {notice && (
          <div role="status" className="toast">
            {notice}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <AppLayout {...application}>
        {error && !modal && (
          <div role="alert" className="error">
            {error} <button onClick={load}>Tentar novamente</button>
          </div>
        )}
        {loading && (
          <p role="status" className="muted">
            Atualizando dados…
          </p>
        )}
        {page === 'overview' && (
          <OverviewPage cars={cars} orders={orders} agent={agent} open={open} setPage={setPage} />
        )}
        {page === 'orders' && <OrdersPage orders={orders} open={open} />}
        {page === 'fleet' && <FleetPage cars={cars} agent={agent} open={open} />}
        {page === 'profile' && (
          <ProfilePage
            user={user}
            setUser={setUser}
            action={action}
            busy={busy}
            onDelete={() => open({ type: 'delete' })}
          />
        )}
      </AppLayout>
      {notice && (
        <div role="status" className="toast">
          <Check size={18} />
          {notice}
        </div>
      )}
      <AppModal {...application} />
    </>
  );
}
