-- Pare a API e execute todo este arquivo no SQL Editor do Supabase.
-- A transação preserva IDs, senhas, perfis, pareceres e números dos contratos.
begin;

create table if not exists clients (
  id uuid primary key references app_users(id),
  cpf varchar(11) unique,
  rg varchar(255), address varchar(255), profession varchar(255)
);
create table if not exists agents (id uuid primary key references app_users(id));
create table if not exists companies (id uuid primary key references agents(id));
create table if not exists banks (id uuid primary key references agents(id));
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

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'app_users' and column_name = 'cpf') then
    insert into clients (id, cpf, rg, address, profession)
      select id, cpf, rg, address, profession from app_users where role = 'CLIENTE'
      on conflict (id) do nothing;
    alter table app_users drop column cpf, drop column rg, drop column address, drop column profession;
  end if;
end $$;

insert into agents (id) select id from app_users where role in ('EMPRESA', 'BANCO') on conflict (id) do nothing;
insert into companies (id) select id from app_users where role = 'EMPRESA' on conflict (id) do nothing;
insert into banks (id) select id from app_users where role = 'BANCO' on conflict (id) do nothing;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'rentals' and column_name = 'contract_number') then
    insert into contracts (id, rental_id, owner_id, ownership_type, total, start_date, end_date, executed_at)
      select coalesce(contract_number, id), id,
             case when ownership_type = 'CLIENTE' then customer_id else evaluator_id end,
             ownership_type, total, start_date, end_date, contracted_at
      from rentals
      where status in ('APROVADO', 'CONTRATADO') or credit_amount is not null
      on conflict (rental_id) do nothing;

    insert into credit_contracts (id, contract_id, bank_id, amount, installments, granted_at)
      select r.id, c.id, r.bank_id, r.credit_amount, r.installments, coalesce(r.contracted_at, r.created_at)
      from rentals r join contracts c on c.rental_id = r.id
      where r.credit_amount is not null
      on conflict (contract_id) do nothing;

    alter table rentals drop column bank_id, drop column credit_amount, drop column installments,
      drop column contract_number, drop column contracted_at;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'fk_incomes_client' and conrelid = 'incomes'::regclass) then
    alter table incomes add constraint fk_incomes_client foreign key (user_id) references clients(id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'fk_rental_client' and conrelid = 'rentals'::regclass) then
    alter table rentals add constraint fk_rental_client foreign key (customer_id) references clients(id);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'fk_rental_agent' and conrelid = 'rentals'::regclass) then
    alter table rentals add constraint fk_rental_agent foreign key (evaluator_id) references agents(id);
  end if;
end $$;

alter table clients enable row level security;
alter table agents enable row level security;
alter table companies enable row level security;
alter table banks enable row level security;
alter table contracts enable row level security;
alter table credit_contracts enable row level security;
commit;
