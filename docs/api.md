# API REST

Base: `/api`. Todas as rotas, exceto cadastro, login e obtenção de CSRF, exigem sessão autenticada. Toda escrita exige token CSRF.

1. `GET /auth/csrf`: retorna `token` e `headerName`; preserve o cookie de sessão.
2. Envie o token no header informado para `POST /auth/register` (JSON) ou `POST /auth/login` (`application/x-www-form-urlencoded`, campos `username` e `password`).
3. Após login ou logout, obtenha um novo token CSRF; o anterior é invalidado.
4. Envie cookie e token nas escritas seguintes. O front-end faz isso automaticamente via proxy de mesma origem.

| Método | Rota | Acesso / finalidade |
| --- | --- | --- |
| POST | `/auth/register` | Público; `username`, `password`, `name`, `role` |
| POST | `/auth/login` | Público; usuário e senha em form-urlencoded |
| POST | `/auth/logout` | Encerra sessão |
| GET | `/auth/me` | Próprios dados, sem hash de senha |
| PUT | `/clients/me` | Cliente: `name`, `cpf`, `rg`, `address`, `profession`, `incomes: [{employer, amount}]` |
| DELETE | `/clients/me` | Cliente sem pedidos nem veículos; invalida sessão |
| GET | `/clients/{id}` | Agente: perfil e rendimentos para avaliação financeira |
| GET | `/owners` | Agente: identificadores, nomes e papéis dos proprietários |
| GET | `/vehicles` | Autenticado: frota |
| POST | `/vehicles` | Agente: matrícula, placa, ano, marca, modelo, diária e proprietário |
| GET | `/rentals` | Cliente vê seus pedidos; agente vê todos |
| GET | `/rentals/{id}` | Mesmo escopo da listagem |
| POST | `/rentals` | Cliente com perfil completo cria pedido |
| PUT | `/rentals/{id}` | Dono ou agente altera e reenvia à análise |
| POST | `/rentals/{id}/cancel` | Cliente dono cancela pedido ainda não contratado |
| POST | `/rentals/{id}/evaluate` | Agente avalia; somente BANCO concede crédito |
| POST | `/rentals/{id}/contract` | Cliente dono confirma pedido aprovado |

## Exemplo de pedido

```json
{
  "vehicleId": "UUID-do-veiculo",
  "startDate": "2027-01-10",
  "endDate": "2027-01-12",
  "ownershipType": "EMPRESA",
  "notes": "Viagem de trabalho"
}
```

## Exemplo de parecer com crédito

```json
{
  "approved": true,
  "opinion": "Rendimentos compatíveis com o aluguel solicitado.",
  "creditAmount": 100.00,
  "installments": 2
}
```

Crédito deve ser positivo, não ultrapassar o total do aluguel e ter de 1 a 120 parcelas. Sem crédito, omita `creditAmount` e `installments`. O banco concedente é a conta autenticada; não pode ser escolhido em nome de terceiros.

Respostas: `200` leitura/alteração; `201` criação; `204` login/logout/exclusão; `400` dados inválidos; `401` sessão ausente ou credenciais inválidas; `403` permissão/CSRF; `404` pedido não encontrado; `409` conflito, duplicidade ou estado incompatível. Erros de domínio retornam `message`; erros de validação incluem `fields`.
