# Atualização do Supabase para a modelagem v3

A revisão introduz Cliente, Agente, Empresa, Banco, Contrato e ContratoCredito como entidades JPA. O banco existente precisa receber as novas tabelas antes de iniciar esta versão da API.

1. Encerre o back-end que está conectado ao Supabase.
2. Abra o projeto do grupo no painel do Supabase e acesse o SQL Editor.
3. Cole e execute todo o conteúdo de `backend/src/main/resources/db/migrations/V3__domain_entities.sql`.
4. Confira as tabelas `clients`, `agents`, `companies`, `banks`, `contracts` e `credit_contracts`.
5. Inicie o back-end com as variáveis de conexão que já utiliza.

Para um banco novo, execute `backend/src/main/resources/db/schema.sql`, que já contém a modelagem v3.

A migração executa em uma transação e pode ser repetida. Ela transfere os dados pessoais para `clients`, cria os registros correspondentes aos agentes e copia os contratos e créditos para suas tabelas. Preserva IDs de usuários, hashes das senhas, rendimentos, pedidos, pareceres e números de contratos executados. As colunas substituídas são removidas ao final da cópia, dentro da mesma transação.

Contratos aprovados ainda aguardando confirmação viram minutas com `executed_at` vazio. Créditos associados a pedidos cancelados continuam disponíveis no histórico. A execução pelo cliente preenche a data e mantém o número do contrato como identificador persistente.

Os testes PostgreSQL embarcados estão em `scripts/database/migration.test.mjs`. Para executá-los, use `npm --prefix scripts/database ci` e `npm --prefix scripts/database test`. Eles verificam preservação dos dados antigos, repetição da migração, minutas aprovadas, histórico cancelado, criação do esquema com RLS e rollback em caso de dados incompatíveis.
