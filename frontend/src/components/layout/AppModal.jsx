import { money, roleLabel } from '../../utils/format.js';
import { api, refreshCsrf } from '../../services/api.js';
import Modal from '../common/Modal.jsx';
import CarForm from '../vehicles/CarForm.jsx';
import OrderForm from '../rentals/OrderForm.jsx';
import Detail from '../rentals/Detail.jsx';
import Evaluation from '../rentals/Evaluation.jsx';

export default function AppModal({
  modal,
  busy,
  error,
  cars,
  owners,
  user,
  agent,
  open,
  action,
  setModal,
  setPage,
  setUser,
}) {
  if (!modal) return null;
  return (
    <Modal
      title={
        {
          order: modal.order ? 'Modificar pedido' : 'Novo pedido de aluguel',
          detail: 'Detalhes do pedido',
          evaluate: 'Avaliação financeira',
          car: 'Cadastrar veículo',
          delete: 'Excluir minha conta',
          cancel: 'Cancelar pedido',
          contract: 'Confirmar contratação',
        }[modal.type]
      }
      close={() => {
        if (!busy) setModal(null);
      }}
    >
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {modal.type === 'order' && (
        <OrderForm
          cars={cars}
          initial={modal.order}
          selectedCar={modal.car}
          busy={busy}
          onSubmit={(body) =>
            action(
              () =>
                api(modal.order ? `/rentals/${modal.order.id}` : '/rentals', {
                  method: modal.order ? 'PUT' : 'POST',
                  body,
                }),
              modal.order
                ? 'Pedido atualizado e reenviado para análise.'
                : 'Pedido enviado para análise.',
            )
          }
          onProfile={() => {
            setModal(null);
            setPage('profile');
          }}
          profileComplete={!!user.cpf || agent}
        />
      )}
      {modal.type === 'car' && (
        <CarForm
          owners={owners}
          busy={busy}
          onSubmit={(body) =>
            action(() => api('/vehicles', { method: 'POST', body }), 'Veículo cadastrado na frota.')
          }
        />
      )}
      {modal.type === 'detail' && (
        <Detail order={modal.order} agent={agent} busy={busy} open={open} />
      )}
      {modal.type === 'evaluate' && (
        <Evaluation
          order={modal.order}
          bank={user.role === 'BANCO'}
          busy={busy}
          onSubmit={(body) =>
            action(
              () => api(`/rentals/${modal.order.id}/evaluate`, { method: 'POST', body }),
              'Parecer registrado com sucesso.',
            )
          }
        />
      )}
      {['cancel', 'contract', 'delete'].includes(modal.type) && (
        <div className="confirmation">
          <p>
            {modal.type === 'cancel'
              ? 'Deseja cancelar este pedido? Ele continuará disponível no histórico.'
              : modal.type === 'contract'
                ? `Você confirma a contratação por ${money(modal.order.total)}? O veículo será registrado como propriedade de ${roleLabel(modal.order.ownershipType).toLowerCase()}.`
                : 'A exclusão é permanente. Contas com pedidos ou veículos vinculados não podem ser excluídas.'}
          </p>
          <button
            disabled={busy}
            className={modal.type === 'contract' ? 'primary' : 'danger'}
            onClick={() =>
              action(
                async () => {
                  if (modal.type === 'delete') {
                    await api('/clients/me', { method: 'DELETE' });
                    await refreshCsrf();
                    setUser(null);
                    setPage('overview');
                  } else await api(`/rentals/${modal.order.id}/${modal.type}`, { method: 'POST' });
                },
                modal.type === 'delete' ? 'Conta excluída.' : 'Pedido atualizado.',
              )
            }
          >
            {busy ? 'Aguarde…' : 'Confirmar'}
          </button>
        </div>
      )}
    </Modal>
  );
}
