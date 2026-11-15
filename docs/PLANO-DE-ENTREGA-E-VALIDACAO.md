# FOOTBALL LEGACY — plano de entrega e critérios de aceite

## Princípio
Build verde não significa jogo completo. Cada modalidade só pode ser considerada pronta depois de testes de fluxo ponta a ponta e persistência.

## Núcleo implementado nesta etapa
- Motor detalhado de partida: seleção de onze atletas por encaixe de posição, condição e overall; plano tático; xG, gols, posse, finalizações, eventos, notas, cartões e lesões.
- Formatos de competição: validação de grupos, classificação e desempate agregado de confrontos em ida e volta (empate agregado encaminhado a pênaltis).
- Decisão financeira e mercado de IA: estimativa de valor, análise de proposta e cálculo de caixa/dívida/folha.

## Critérios de aceite obrigatórios
1. Criar carreira de jogador aos 15 anos, iniciar sem contrato profissional, completar temporada de formação e receber oferta profissional somente na idade/regra adequada.
2. Escalar 11 atletas elegíveis; validar posição, condição física, suspensões e lesões; permitir substituições e registrar minutos.
3. Tática escolhida deve alterar métricas e resultado de forma determinística com seed reproduzível.
4. Todas as partidas oficiais da competição precisam ser disputadas antes de avançar a temporada.
5. Aplicar regulamento real por edição: número de clubes, formato, desempates, vagas continentais, acesso/descenso, premiação e calendário.
6. Promover/rebaixar clubes entre divisões sem duplicar ou perder participantes.
7. Dirigente deve negociar com IA, registrar contratos parcelados, folha, comissão técnica, estádio, bilheteria, patrocínio, dívida e confiança da diretoria.
8. Base deve ter calendários próprios, desenvolvimento por faixa etária, contratos e promoção ao profissional.
9. Seleções devem ter elenco, convocação, calendário FIFA e torneios próprios.
10. Salvamento precisa sobreviver a refresh, fechamento e troca de dispositivo quando houver autenticação e banco configurados.
11. Cobertura de dados deve exibir fonte, temporada, data de sincronização e lacunas. Não apresentar nomes/escudos/fotos sem direitos ou origem verificável.
12. Testes em Android e desktop, além de testes automatizados do motor.

## Limitações conhecidas que não podem ser mascaradas
- A integração atual da API-Football não equivale a um cadastro global completo e a cobertura depende do plano e da competição.
- Dados financeiros e valores de transferência precisam ser tratados como estimativas quando não houver fonte pública confiável.
- Este documento é um plano de aceite, não uma declaração de conclusão.
