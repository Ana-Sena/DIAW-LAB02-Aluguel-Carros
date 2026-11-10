import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import ProfilePage from './ProfilePage';

test('limita a três empregadores e libera nova entrada após uma remoção', async () => {
  const user = userEvent.setup();
  render(<ProfilePage user={{ name: 'Ana', username: 'ana', incomes: [] }} action={vi.fn()} />);
  const add = screen.getByRole('button', { name: 'Adicionar empregador' });
  await user.click(add);
  await user.click(add);
  await user.click(add);
  expect(add).toBeDisabled();
  expect(screen.getAllByLabelText(/^Empregador/)).toHaveLength(3);
  await user.click(screen.getByRole('button', { name: 'Remover empregador 2' }));
  expect(add).toBeEnabled();
  expect(screen.getAllByLabelText(/^Empregador/)).toHaveLength(2);
});
