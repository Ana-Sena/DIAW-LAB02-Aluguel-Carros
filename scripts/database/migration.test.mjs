import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const legacy = await readFile(new URL('./fixtures/v2-schema.sql', import.meta.url), 'utf8');
const migration = await readFile(
  new URL(
    '../../backend/src/main/resources/db/migrations/V3__domain_entities.sql',
    import.meta.url,
  ),
  'utf8',
);
const schema = await readFile(
  new URL('../../backend/src/main/resources/db/schema.sql', import.meta.url),
  'utf8',
);
const client = '00000000-0000-0000-0000-000000000001';
const bank = '00000000-0000-0000-0000-000000000002';
const company = '00000000-0000-0000-0000-000000000003';
const vehicle = '00000000-0000-0000-0000-000000000004';
const rental = '00000000-0000-0000-0000-000000000005';
const contract = '00000000-0000-0000-0000-000000000006';

async function seed(db) {
  await db.exec(legacy);
  await db.exec(`
    insert into app_users (id, username, password_hash, role, name, cpf, rg, address, profession) values
      ('${client}', 'cliente', 'hash-preservado', 'CLIENTE', 'Cliente', '52998224725', 'MG123', 'Rua A', 'Dev'),
      ('${bank}', 'banco', 'hash-banco', 'BANCO', 'Banco', null, null, null, null),
      ('${company}', 'empresa', 'hash-empresa', 'EMPRESA', 'Empresa', null, null, null, null);
    insert into incomes values ('${client}', 0, 'Empregador', 5000);
    insert into vehicles (id, registration, plate, manufacture_year, brand, model, daily_rate, owner_id)
      values ('${vehicle}', 'M1', 'ABC1D23', 2025, 'Fiat', 'Argo', 100, '${bank}');
    insert into rentals (id, customer_id, vehicle_id, start_date, end_date, status, ownership_type,
      total, opinion, evaluator_id, bank_id, credit_amount, installments, contract_number, contracted_at, created_at)
      values ('${rental}', '${client}', '${vehicle}', '2027-01-01', '2027-01-03', 'CONTRATADO', 'BANCO',
        300, 'Aprovado', '${bank}', '${bank}', 200, 2, '${contract}', '2026-11-01T12:00:00Z', '2026-10-30T12:00:00Z');
  `);
}

test('migra dados pessoais, herança, contrato e crédito mantendo IDs e credenciais', async () => {
  const db = new PGlite();
  try {
    await seed(db);
    await db.exec(migration);
    const user = (
      await db.query(
        `select u.password_hash, c.* from app_users u join clients c using(id) where id = '${client}'`,
      )
    ).rows[0];
    assert.equal(user.password_hash, 'hash-preservado');
    assert.equal(user.cpf, '52998224725');
    assert.equal(user.profession, 'Dev');
    assert.equal((await db.query('select * from agents')).rows.length, 2);
    assert.equal((await db.query('select * from companies')).rows[0].id, company);
    assert.equal((await db.query('select * from banks')).rows[0].id, bank);
    const saved = (await db.query('select * from contracts')).rows[0];
    assert.equal(saved.id, contract);
    assert.equal(saved.rental_id, rental);
    assert.equal(saved.owner_id, bank);
    assert.equal(saved.executed_at.toISOString(), '2026-11-01T12:00:00.000Z');
    const credit = (await db.query('select * from credit_contracts')).rows[0];
    assert.equal(credit.contract_id, contract);
    assert.equal(credit.bank_id, bank);
    assert.equal(Number(credit.amount), 200);
    assert.equal(credit.installments, 2);
    assert.equal((await db.query('select * from incomes')).rows.length, 1);
  } finally {
    await db.close();
  }
});

test('pode repetir a migração sem duplicar ou alterar contratos existentes', async () => {
  const db = new PGlite();
  try {
    await seed(db);
    await db.exec(migration);
    await db.exec(migration);
    assert.equal((await db.query('select * from contracts')).rows.length, 1);
    assert.equal((await db.query('select * from credit_contracts')).rows.length, 1);
    assert.equal((await db.query('select * from clients')).rows.length, 1);
  } finally {
    await db.close();
  }
});

test('preserva minutas aprovadas e crédito de pedidos cancelados sem executar contrato', async () => {
  const db = new PGlite();
  try {
    await seed(db);
    await db.exec(
      "update rentals set status = 'CANCELADO', contract_number = null, contracted_at = null",
    );
    await db.exec(migration);
    const saved = (await db.query('select * from contracts')).rows[0];
    assert.equal(saved.id, rental);
    assert.equal(saved.executed_at, null);
    assert.equal((await db.query('select * from credit_contracts')).rows.length, 1);
  } finally {
    await db.close();
  }
});

test('esquema novo cria todas as entidades com RLS e aceita a migração como operação repetível', async () => {
  const db = new PGlite();
  try {
    await db.exec(schema);
    await db.exec(migration);
    const tables = (
      await db.query(
        "select relname, relrowsecurity from pg_class join pg_namespace n on n.oid = relnamespace where n.nspname = 'public' and relkind = 'r'",
      )
    ).rows;
    assert.equal(tables.length, 10);
    assert.ok(tables.every((table) => table.relrowsecurity));
  } finally {
    await db.close();
  }
});

test('pedido aprovado migra para minuta sem antecipar sua execução', async () => {
  const db = new PGlite();
  try {
    await seed(db);
    await db.exec(
      "update rentals set status = 'APROVADO', contract_number = null, contracted_at = null",
    );
    await db.exec(migration);
    const saved = (await db.query('select * from contracts')).rows[0];
    assert.equal(saved.executed_at, null);
    assert.equal(saved.id, rental);
    assert.equal(saved.total, '300.00');
    assert.equal((await db.query('select * from rentals')).rows[0].status, 'APROVADO');
  } finally {
    await db.close();
  }
});

test('falha em dados incompatíveis permite rollback de toda a migração', async () => {
  const db = new PGlite();
  try {
    await seed(db);
    await db.exec('update rentals set evaluator_id = null');
    await assert.rejects(db.exec(migration));
    await db.exec('rollback');
    assert.equal(
      (await db.query("select cpf from app_users where username = 'cliente'")).rows[0].cpf,
      '52998224725',
    );
    assert.equal(
      (await db.query("select to_regclass('public.clients') as relation")).rows[0].relation,
      null,
    );
    assert.equal(
      (await db.query('select contract_number from rentals')).rows[0].contract_number,
      contract,
    );
  } finally {
    await db.close();
  }
});
