import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import OrderForm from './OrderForm';

const cars = [{ id: 'carro-1', brand: 'Fiat', model: 'Argo', plate: 'ABC1D23', dailyRate: 100 }];

test('encaminha cliente com perfil incompleto para o cadastro', async () => {
  const onProfile = vi.fn();
  render(<OrderForm cars={cars} profileComplete={false} onProfile={onProfile} />);
  await userEvent.click(screen.getByRole('button', { name: 'Completar meu perfil' }));
  expect(onProfile).toHaveBeenCalledOnce();
  expect(screen.queryByRole('button', { name: 'Enviar pedido' })).not.toBeInTheDocument();
});

test('calcula diárias inclusivas e envia o contrato HTTP esperado', async () => {
  const onSubmit = vi.fn();
  const start = new Date();
  start.setDate(start.getDate() + 10);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);
  const startDate = start.toLocaleDateString('en-CA');
  const endDate = end.toLocaleDateString('en-CA');
  render(<OrderForm cars={cars} profileComplete onSubmit={onSubmit} />);
  fireEvent.change(screen.getByLabelText('Retirada'), { target: { value: startDate } });
  fireEvent.change(screen.getByLabelText('Devolução'), { target: { value: endDate } });
  expect(screen.getByText(/3 diária/)).toBeInTheDocument();
  expect(screen.getByText(/300,00/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Enviar pedido' }));
  expect(onSubmit).toHaveBeenCalledWith({
    vehicleId: 'carro-1',
    startDate,
    endDate,
    ownershipType: 'EMPRESA',
    notes: '',
  });
});

test('impede envio quando a frota está vazia', () => {
  render(<OrderForm cars={[]} profileComplete onSubmit={vi.fn()} />);
  expect(screen.getByRole('button', { name: 'Enviar pedido' })).toBeDisabled();
});
