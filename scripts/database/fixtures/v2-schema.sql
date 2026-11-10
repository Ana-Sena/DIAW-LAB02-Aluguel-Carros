-- Execute uma vez no SQL Editor do Supabase antes de iniciar o perfil padrão.
-- Não expõe as tabelas pela Data API: somente o back-end conecta via JDBC.
create table if not exists app_users (
  id uuid primary key,
  username varchar(80) not null unique,
  password_hash varchar(255) not null,
  role varchar(255) not null check (role in ('CLIENTE','EMPRESA','BANCO')),
  name varchar(255) not null,
  cpf varchar(11) unique,
  rg varchar(255), address varchar(255), profession varchar(255)
);
create table if not exists incomes (
  user_id uuid not null references app_users(id),
  position integer not null check (position between 0 and 2),
  employer varchar(255) not null,
  amount numeric(12,2) not null check (amount > 0),
  primary key (user_id, position)
);
create table if not exists vehicles (
  id uuid primary key,
  registration varchar(255) not null unique,
  plate varchar(7) not null unique,
  manufacture_year integer not null check (manufacture_year between 1900 and 2100),
  brand varchar(255) not null, model varchar(255) not null,
  daily_rate numeric(12,2) not null check (daily_rate > 0),
  owner_id uuid not null references app_users(id),
  version bigint not null default 0
);
create table if not exists rentals (
  id uuid primary key,
  customer_id uuid not null references app_users(id),
  vehicle_id uuid not null references vehicles(id),
  start_date date not null, end_date date not null check (end_date >= start_date),
  status varchar(255) not null check (status in ('EM_ANALISE','APROVADO','REPROVADO','CONTRATADO','CANCELADO')),
  ownership_type varchar(255) not null check (ownership_type in ('CLIENTE','EMPRESA','BANCO')),
  total numeric(12,2) not null check (total > 0),
  notes varchar(1000), opinion varchar(1000),
  evaluator_id uuid references app_users(id), bank_id uuid references app_users(id),
  credit_amount numeric(12,2), installments integer,
  contract_number uuid unique, contracted_at timestamptz,
  created_at timestamptz not null,
  version bigint not null default 0,
  check ((credit_amount is null and installments is null and bank_id is null) or
    (credit_amount > 0 and credit_amount <= total and installments between 1 and 120 and bank_id is not null)),
  check (status <> 'CONTRATADO' or (contract_number is not null and contracted_at is not null))
);
create index if not exists idx_rentals_customer on rentals(customer_id);
create index if not exists idx_rentals_vehicle_period on rentals(vehicle_id, start_date, end_date);
alter table app_users enable row level security;
alter table incomes enable row level security;
alter table vehicles enable row level security;
alter table rentals enable row level security;
-- Sem policies públicas: anon e authenticated não acessam os dados.
-- Conecte pelo servidor com o usuário de banco configurado em DATABASE_USERNAME.
