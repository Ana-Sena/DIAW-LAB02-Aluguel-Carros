import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import Evaluation from './Evaluation';

const order = { customer: { name: 'Ana' }, total: 300, ownershipType: 'BANCO' };

test('empresa registra parecer sem apresentar concessão de crédito', async () => {
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  render(<Evaluation order={order} bank={false} onSubmit={onSubmit} />);
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  await user.type(screen.getByLabelText('Parecer financeiro'), 'Renda compatível');
  await user.click(screen.getByRole('button', { name: 'Registrar parecer' }));
  expect(onSubmit).toHaveBeenCalledWith({
    approved: true,
    opinion: 'Renda compatível',
    creditAmount: null,
    installments: null,
  });
});

test('banco informa crédito e remove valores da submissão ao reprovar', async () => {
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  render(<Evaluation order={order} bank onSubmit={onSubmit} />);
  await user.type(screen.getByLabelText('Parecer financeiro'), 'Análise');
  await user.click(screen.getByRole('checkbox'));
  await user.type(screen.getByLabelText('Valor do crédito (R$)'), '100');
  await user.type(screen.getByLabelText('Parcelas'), '2');
  await user.click(screen.getByRole('button', { name: 'Registrar parecer' }));
  expect(onSubmit).toHaveBeenLastCalledWith({
    approved: true,
    opinion: 'Análise',
    creditAmount: 100,
    installments: 2,
  });
  await user.selectOptions(screen.getByLabelText('Resultado da análise'), 'false');
  expect(screen.queryByLabelText('Valor do crédito (R$)')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Registrar parecer' }));
  expect(onSubmit).toHaveBeenLastCalledWith({
    approved: false,
    opinion: 'Análise',
    creditAmount: null,
    installments: null,
  });
});
