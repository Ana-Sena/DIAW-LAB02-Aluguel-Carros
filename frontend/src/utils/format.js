export const money = (value) =>
  Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const date = (value) =>
  value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '';
export const today = () => new Date().toLocaleDateString('en-CA');
export const labels = {
  CLIENTE: 'Cliente',
  EMPRESA: 'Empresa',
  BANCO: 'Banco',
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CONTRATADO: 'Contratado',
  CANCELADO: 'Cancelado',
};
export const roleLabel = (role) => labels[role] || role;
