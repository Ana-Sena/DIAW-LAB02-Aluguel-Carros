import { useEffect, useState } from 'react';
import { api, refreshCsrf } from '../services/api';

export default function useApplication() {
  const [user, setUser] = useState(null);
  const [initial, setInitial] = useState(true);
  const [page, setPage] = useState('overview');
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);
  const [owners, setOwners] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const agent = user?.role !== 'CLIENTE';

  useEffect(() => {
    api('/auth/me')
      .then(setUser)
      .catch(() => {})
      .finally(() => setInitial(false));
    const expired = () => {
      setUser(null);
      setNotice('Sua sessão expirou. Entre novamente.');
    };
    window.addEventListener('session-expired', expired);
    return () => window.removeEventListener('session-expired', expired);
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user?.id]);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(''), 6000);
    return () => clearTimeout(timeout);
  }, [notice]);

  async function load() {
    setLoading(true);
    try {
      const [vehicles, rentals, people] = await Promise.all([
        api('/vehicles'),
        api('/rentals'),
        agent ? api('/owners') : Promise.resolve([]),
      ]);
      setCars(vehicles);
      setOrders(rentals);
      setOwners(people);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function open(value) {
    setError('');
    setModal(value);
  }

  async function action(task, message) {
    setBusy(true);
    setError('');
    try {
      await task();
      setModal(null);
      setNotice(message);
      if (modal?.type !== 'delete') await load();
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
      await refreshCsrf();
      setUser(null);
      setPage('overview');
    } catch (error) {
      setError(error.message);
    }
  }

  return {
    user,
    setUser,
    initial,
    page,
    setPage,
    cars,
    orders,
    owners,
    modal,
    setModal,
    error,
    setError,
    notice,
    busy,
    loading,
    navOpen,
    setNavOpen,
    agent,
    load,
    open,
    action,
    logout,
  };
}
