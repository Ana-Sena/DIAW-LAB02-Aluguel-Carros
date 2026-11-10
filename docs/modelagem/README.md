# Modelagem e evolução

Os arquivos PlantUML podem ser abertos com uma extensão PlantUML no editor ou renderizados com a ferramenta local. A v3 usa os nomes das classes presentes no código atual. O diagrama de casos de uso v1 permanece aplicável.

| Modelo | Inicial | Implementação anterior | Revisão após feedback |
| --- | --- | --- | --- |
| Casos de uso | [v1](v1/casos-de-uso.puml) | Mantido | Mantido |
| Classes | [Conceitual v1](v1/classes.puml) | [v2](v2/classes.puml) | [v3](v3/classes.puml) |
| Pacotes / visão lógica | [v1](v1/pacotes.puml) | [v2](v2/pacotes.puml) | [v3](v3/pacotes.puml) |
| Estados | Narrado nos requisitos | [v2](v2/estados.puml) | [v3](v3/estados.puml) |
| Histórias | [HU01–HU08](../requisitos.md) | Mesmas histórias | [Rastreabilidade e testes](../validacao.md) |

## Modificações justificadas

1. A v2 representava clientes e agentes por `User`/`Role`, e contrato/crédito por campos em `Rental`. O feedback apontou a divergência em relação à herança do modelo conceitual.
2. A v3 implementa `User` como entidade abstrata com herança `JOINED`. `Cliente` mantém os dados pessoais e rendimentos. `Agente` é a superclasse de `Empresa` e `Banco`. Os relacionamentos do pedido agora referenciam esses tipos.
3. `Contrato` é uma entidade independente com termos aprovados, proprietário e data de execução. A aprovação cria a minuta. A confirmação pelo cliente executa o contrato. Seu ID corresponde ao número mostrado na API.
4. `ContratoCredito` pertence a um contrato e referencia um `Banco`, com valor, parcelas e data de concessão. `Banco.grantCredit` cria a entidade e valida os limites.
5. Alterar o pedido remove a minuta e o crédito anteriores por `orphanRemoval` e o devolve à análise. O cancelamento mantém os dados disponíveis para consulta histórica.
6. Os DTOs de entrada e resposta possuem arquivos individuais. Os componentes React estão distribuídos entre páginas, formulários, layout, elementos comuns, hooks, serviços e utilitários.
7. Diária, período inclusivo, limite de 365 dias, autorização e bloqueio de sobreposição foram preservados. O JSON público continua atendendo os consumidores existentes.
8. A migração SQL transfere os dados anteriores para a modelagem v3 e mantém IDs, credenciais e contratos executados. Os testes verificam a migração e sua repetição.

A v1 foi produzida a partir do enunciado e a v2 registrou a primeira implementação. A v3 incorpora o feedback de que faltavam entidades explícitas, separação dos componentes/DTOs e evidências de testes. O histórico permanece disponível para comparação na apresentação.
