# Validação e rastreabilidade

## Verificações

Resultado local em 03/11/2026: 13 testes de integração aprovados (zero falhas/erros), build React concluído, JAR executável gerado e smoke HTTP aprovado pelo proxy Vite.

- `mvn -f backend/pom.xml test`: 13 testes de integração com Spring Boot, MockMvc, Spring Security e H2. Validam acesso autenticado, CSRF, credenciais reais, BCrypt, cadastro/duplicidade, privacidade entre clientes, crédito bancário, contratação, sobreposição, reanálise, cancelamento, perfil/rendimentos e exclusão.
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
| HU08 | bank/creditAmount/installments | Crédito concedido pelo banco autenticado e associado ao contrato |

## Roteiro de apresentação manual

1. Inicie o perfil demo e o front-end conforme o README.
2. Entre como `cliente`, consulte frota e perfil com seu emprego fictício.
3. Crie um pedido com proprietário previsto **Banco**, datas futuras e observações.
4. Modifique-o e confira a análise pendente. Crie outro e cancele-o para mostrar histórico.
5. Entre como `banco`, consulte dados/rendimentos do cliente e registre parecer favorável com crédito.
6. Volte como `cliente`, confirme o contrato e confira número, data, banco, valor e parcelas.
7. Entre como `empresa`, cadastre um automóvel e demonstre os proprietários.
8. Cadastre um cliente novo, complete/edite o perfil e exclua a conta antes de criar pedidos.
9. Compare os modelos v1/v2 e explique as decisões em `docs/modelagem/README.md`.

## Limitações

- Supabase real não foi acessado: não foram fornecidos projeto/credenciais. SQL e configuração JDBC prontos; conferir a conexão após configurar o projeto do grupo.
- Testes com H2 em modo PostgreSQL não substituem execução do esquema no Supabase.
- Revisão visual automatizada não concluída: host de navegador indisponível; acesso ao Chrome interrompido pela ferramenta por não confirmar a URL. Há CSS responsivo, mas nenhuma captura é apresentada como evidência de revisão visual.
- Cadastro aberto de agentes para fins acadêmicos. Não há verificação empresarial, integração financeira real, assinatura digital, pagamentos ou recuperação de senha.
