# Modelagem e evolução

Os arquivos PlantUML podem ser abertos com uma extensão PlantUML no editor ou renderizados com a ferramenta local. Os diagramas usam os nomes das classes do código na versão final. O diagrama de casos de uso em v1 permanece válido na v2.

| Modelo | Inicial | Revisão final |
| --- | --- | --- |
| Casos de uso | [v1](v1/casos-de-uso.puml) | Mesmos atores e casos; regras detalhadas em [requisitos](../requisitos.md) |
| Classes | [Conceitual v1](v1/classes.puml) | [Implementação v2](v2/classes.puml) |
| Pacotes / visão lógica | [v1](v1/pacotes.puml) | [v2](v2/pacotes.puml) |
| Estados | Fluxo narrado nos requisitos | [Ciclo de vida v2](v2/estados.puml) |
| Histórias do usuário | [HU01–HU08](../requisitos.md) | Critérios rastreados em [validação](../validacao.md) |

## Modificações justificadas

1. A herança conceitual de Cliente/Empresa/Banco foi implementada com `User` e `Role`, evitando duplicação de credenciais e identificação. As permissões continuam distintas no serviço.
2. Contrato e crédito foram incorporados em `Rental` como grupos de campos opcionais. O contrato tem número/data próprios e o crédito possui banco concedente, valor e parcelas; nenhum deles existe em pedidos novos.
3. `Income` é uma coleção de valor embutida, limitada a três entradas. Evita entidades de empregador sem função no protótipo.
4. Adicionados diária, período e total para tornar a avaliação financeira executável. O cálculo inclui os dias de retirada e devolução, com limite de 365 dias.
5. Alterar um pedido invalida o parecer e o crédito anteriores e o devolve à análise. Contratos executados e pedidos cancelados são imutáveis no protótipo.
6. Adicionados controle otimista de versão e lock pessimista no veículo durante a contratação, para bloquear execução concorrente para o mesmo período.
7. A categoria do proprietário é definida no pedido; a aprovação exige agente da categoria escolhida, salvo propriedade do próprio cliente. A transferência se efetiva ao contratar.

Não foram fornecidos modelos UML anteriores ao repositório nem feedback de aula. A v1 foi produzida a partir do enunciado, e a v2 registra as decisões desta implementação; nenhuma revisão é atribuída ao professor.
