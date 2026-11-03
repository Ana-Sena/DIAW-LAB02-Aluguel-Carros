# Requisitos e decisões — versão inicial (v1)

Fonte: enunciado do Laboratório 02, disponibilizado na raiz do repositório.

| ID | História / critério de aceite |
| --- | --- |
| HU01 | Como usuário, quero me cadastrar e entrar com usuário e senha para acessar o sistema. |
| HU02 | Como cliente, quero cadastrar, consultar, alterar e excluir meu perfil, com RG, CPF, nome, endereço, profissão e até três vínculos de emprego/renda. |
| HU03 | Como cliente, quero criar, consultar, modificar e cancelar meus pedidos de aluguel. |
| HU04 | Como agente de empresa ou banco, quero consultar, modificar e avaliar financeiramente pedidos, registrando parecer. |
| HU05 | Como cliente, quero aceitar um pedido aprovado para executar seu contrato. |
| HU06 | Como usuário, quero consultar matrícula, ano, marca, modelo, placa e proprietário dos automóveis. |
| HU07 | Como agente, quero cadastrar automóveis com propriedade de cliente, empresa ou banco. |
| HU08 | Como agente bancário, quero vincular crédito concedido pelo meu banco ao contrato. |

## Decisões do protótipo

- MVC no back-end; React é o subsistema de apresentação. API REST em camadas Controller → Service → Repository → JPA.
- Perfis CLIENTE, EMPRESA e BANCO. O cadastro de agentes é aberto neste laboratório, sem alegar verificação institucional.
- Sessão HTTP no servidor, senha BCrypt e proteção CSRF. Sem senha/token persistido no localStorage.
- CPF e matrícula/placa únicos. Rendas positivas, no máximo três; datas e valores validados no servidor.
- Fluxo inicial: EM_ANALISE → APROVADO ou REPROVADO; aprovação permite contratação pelo cliente. Alteração submete novamente à análise.
- Automóvel possui proprietário; o tipo de contrato define o proprietário ao contratar. Crédito é opcional e somente um banco autenticado pode concedê-lo.
- O cancelamento preserva o histórico; exclusão de cliente com pedidos é bloqueada para preservar contratos.
- Supabase PostgreSQL é o banco persistente. H2 é exclusivo de demonstração e testes e perde os dados ao encerrar.

Veja a revisão final e os diagramas em `docs/modelagem/`.
