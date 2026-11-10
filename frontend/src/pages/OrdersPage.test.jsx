import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import OrdersPage from './OrdersPage';

const orders = [
  {
    id: 'pedido-1',
    status: 'APROVADO',
    customer: { name: 'Ana' },
    vehicle: { brand: 'Fiat', model: 'Argo' },
    startDate: '2027-01-01',
    endDate: '2027-01-03',
    total: 300,
  },
  {
    id: 'pedido-2',
    status: 'CANCELADO',
    customer: { name: 'Bruno' },
    vehicle: { brand: 'Volkswagen', model: 'Polo' },
    startDate: '2027-01-02',
    endDate: '2027-01-04',
    total: 450,
  },
];

test('combina busca e status para localizar o pedido e abrir seus detalhes', async () => {
  const user = userEvent.setup();
  const open = vi.fn();
  render(<OrdersPage orders={orders} open={open} />);
  await user.type(screen.getByRole('textbox', { name: 'Buscar pedidos' }), 'ana');
  expect(screen.getByText('Fiat Argo')).toBeInTheDocument();
  expect(screen.queryByText('Volkswagen Polo')).not.toBeInTheDocument();
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Filtrar por status' }),
    'CANCELADO',
  );
  expect(screen.getByText('Nada por aqui ainda')).toBeInTheDocument();
  await user.clear(screen.getByRole('textbox', { name: 'Buscar pedidos' }));
  await user.click(screen.getByRole('button', { name: 'Ver pedido pedido-2' }));
  expect(open).toHaveBeenCalledWith({ type: 'detail', order: orders[1] });
});
