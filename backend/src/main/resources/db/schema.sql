-- Banco novo. Para atualizar o banco anterior, execute migrations/V3__domain_entities.sql.
create table if not exists app_users (
  id uuid primary key,
  username varchar(80) not null unique,
  password_hash varchar(255) not null,
  role varchar(255) not null check (role in ('CLIENTE', 'EMPRESA', 'BANCO')),
  name varchar(255) not null
);
create table if not exists clients (
  id uuid primary key references app_users(id),
  cpf varchar(11) unique,
  rg varchar(255),
  address varchar(255),
  profession varchar(255)
);
create table if not exists agents (
  id uuid primary key references app_users(id)
);
create table if not exists companies (
  id uuid primary key references agents(id)
);
create table if not exists banks (
  id uuid primary key references agents(id)
);
create table if not exists incomes (
  user_id uuid not null references clients(id),
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
  brand varchar(255) not null,
  model varchar(255) not null,
  daily_rate numeric(12,2) not null check (daily_rate > 0),
  owner_id uuid not null references app_users(id),
  version bigint not null default 0
);
create table if not exists rentals (
  id uuid primary key,
  customer_id uuid not null references clients(id),
  vehicle_id uuid not null references vehicles(id),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  status varchar(255) not null check (status in ('EM_ANALISE','APROVADO','REPROVADO','CONTRATADO','CANCELADO')),
  ownership_type varchar(255) not null check (ownership_type in ('CLIENTE','EMPRESA','BANCO')),
  total numeric(12,2) not null check (total > 0),
  notes varchar(1000),
  opinion varchar(1000),
  evaluator_id uuid references agents(id),
  created_at timestamptz not null,
  version bigint not null default 0
);
create table if not exists contracts (
  id uuid primary key,
  rental_id uuid not null unique references rentals(id),
  owner_id uuid not null references app_users(id),
  ownership_type varchar(255) not null check (ownership_type in ('CLIENTE', 'EMPRESA', 'BANCO')),
  total numeric(12,2) not null check (total > 0),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  executed_at timestamptz
);
create table if not exists credit_contracts (
  id uuid primary key,
  contract_id uuid not null unique references contracts(id),
  bank_id uuid not null references banks(id),
  amount numeric(12,2) not null check (amount > 0),
  installments integer not null check (installments between 1 and 120),
  granted_at timestamptz not null
);
create index if not exists idx_rentals_customer on rentals(customer_id);
create index if not exists idx_rentals_vehicle_period on rentals(vehicle_id, start_date, end_date);
alter table app_users enable row level security;
alter table clients enable row level security;
alter table agents enable row level security;
alter table companies enable row level security;
alter table banks enable row level security;
alter table incomes enable row level security;
alter table vehicles enable row level security;
alter table rentals enable row level security;
alter table contracts enable row level security;
alter table credit_contracts enable row level security;
