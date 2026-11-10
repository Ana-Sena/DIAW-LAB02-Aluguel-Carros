# Validação e rastreabilidade

## Verificações

Revisão de 10/11/2026 com 28 testes Java, 7 testes React e 6 testes PostgreSQL. A suíte Java original de 13 cenários foi ampliada com verificações das entidades e persistência dos novos relacionamentos.

As três suítes passaram, totalizando 41 testes. Maven verify, build React, checagem de formatação e smoke HTTP com sessões reais também passaram. O smoke utilizou portas locais de verificação e o perfil demo.

- `mvn -f backend/pom.xml test` executa 18 testes de integração e 10 testes de domínio. Inclui a herança persistente, contratos/créditos em tabelas próprias, remoção de minutas na reanálise, isolamento dos clientes, regras de crédito e execução única do contrato.
- `npm --prefix frontend test` executa 7 testes de interação com Vitest e Testing Library. Inclui filtros combinados, envio de pedido, perfil incompleto, frota vazia, três empregadores e parecer com crédito opcional.
- `npm --prefix scripts/database test` executa 6 testes em PostgreSQL embarcado. Inclui migração de dados v2, repetição, minutas aprovadas, crédito cancelado, RLS e rollback integral quando há dados incompatíveis.
- `npm --prefix frontend run build`: compila React em `frontend/dist`.
- `npm --prefix frontend run format:check`: verifica formatação web.
- `node scripts/smoke.mjs`: teste HTTP com cookies reais pelo proxy Vite; exige API demo em 8080 e Vite em 5173. Cria dados fictícios. Reinicie a API antes de repetir, pois o contrato ocupa a mesma data/veículo.

| História | Implementação | Evidência |
| --- | --- | --- |
| HU01 | SecurityConfig, AccountService, Auth | Login real, CSRF, cadastro, senha BCrypt e smoke com cookies |
| HU02 | AccountService, Profile | CPF, três rendas, leitura, alteração e exclusão |
| HU03 | RentalService, OrderForm, OrderTable | Criação, alteração, cancelamento e isolamento de clientes |
| HU04 | evaluate, Evaluation, FinancialProfile | Cliente não avalia; empresa não concede crédito; agente lê rendas |
| HU05 | contract, Detail | Aprovação obrigatória; número/data; bloqueio de sobreposição |
| HU06 | Vehicle, CarCard | Frota com matrícula, placa, ano, marca e modelo |
| HU07 | addCar, CarForm | Proprietário de qualquer papel; transferência ao contratar |
| HU08 | Banco, Contrato, ContratoCredito | Crédito concedido pelo banco autenticado, persistido e associado ao contrato |

## Roteiro de apresentação manual

1. Inicie o perfil demo e o front-end conforme o README.
2. Entre como `cliente`, consulte frota e perfil com seu emprego fictício.
3. Crie um pedido com proprietário previsto **Banco**, datas futuras e observações.
4. Modifique-o e confira a análise pendente. Crie outro e cancele-o para mostrar histórico.
5. Entre como `banco`, consulte dados/rendimentos do cliente e registre parecer favorável com crédito.
6. Volte como `cliente`, confirme o contrato e confira número, data, banco, valor e parcelas.
7. Entre como `empresa`, cadastre um automóvel e demonstre os proprietários.
8. Cadastre um cliente novo, complete/edite o perfil e exclua a conta antes de criar pedidos.
9. Compare os modelos v1/v2/v3 e explique a herança JPA, as entidades de contrato e a separação de páginas/DTOs.

## Limitações

- O usuário confirmou a conexão anterior ao Supabase. A migração v3 deve ser executada no projeto do grupo conforme `docs/migracao-v3.md`. A validação desta revisão usou bancos locais.
- H2 verifica os relacionamentos JPA e o PostgreSQL embarcado verifica o SQL de migração. A conexão de rede do Supabase depende das credenciais configuradas pelo grupo.
- Revisão visual automatizada não concluída: host de navegador indisponível; acesso ao Chrome interrompido pela ferramenta por não confirmar a URL. Há CSS responsivo, mas nenhuma captura é apresentada como evidência de revisão visual.
- Cadastro aberto de agentes para fins acadêmicos. Não há verificação empresarial, integração financeira real, assinatura digital, pagamentos ou recuperação de senha.
