# Calendário mundial — FOOTBALL LEGACY

## Princípio de funcionamento
O catálogo em `src/data/world-football.ts` separa competições, países, confederações, tipo de competição, modelo de temporada e grau de confirmação do calendário. Assim o motor pode comportar temporadas de ano civil (Brasil, Argentina, Japão), temporadas cruzando dois anos (grande parte da Europa) e formatos divididos (ex.: México).

## Brasil — 2026
A base contempla:
- 27 campeonatos estaduais (26 estados + Distrito Federal), na janela nacional de 11 de janeiro a 8 de março. Cada federação estadual precisa fornecer suas datas, regulamento, participantes e fases; a janela nacional não significa que todos tenham o mesmo calendário.
- Brasileirão Séries A, B, C e D.
- Copa do Brasil, Copa do Nordeste, Copa Verde e Copa Sul-Sudeste.
- Libertadores, Sul-Americana e Recopa.

A Série A 2026 contém 20 participantes e 38 rodadas (380 partidas). O catálogo de clubes brasileiros foi alinhado à lista de participantes da Série A 2026.

## Mundo
O catálogo inicial contém primeiras divisões prioritárias de Europa, América do Sul, América do Norte, Ásia e África, além de ligas secundárias selecionadas e torneios continentais. Ele é uma base expansível, não uma alegação de que todas as divisões amadoras e profissionais de todos os países já estejam cadastradas.

## Calendário oficial x janela estimada
- `officialCalendar: true`: datas publicadas por entidade organizadora consultada.
- `officialCalendar: false`: janela estrutural de temporada para simulação; não deve ser exibida como data oficial de rodada.
- O jogo deve carregar calendários detalhados por edição, federação e temporada antes de gerar datas de partidas. Não inferir datas exatas de rodadas a partir da janela de uma temporada.

## Fontes de referência — temporada 2026
- CBF — calendário profissional masculino 2026: https://www.cbf.com.br/a-cbf/arbitragem/comissao-termos-sorteios/a/cbf-oficializa-datas-do-calendario-do-futebol-do-brasil-profissional-masculino-de-2026
- CBF — tabela e regulamento da Série A 2026: https://www.cbf.com.br/
- FIFA — calendário internacional de seleções: https://inside.fifa.com/tournament-organisation/international-match-calendars
- UEFA — calendário europeu de competições 2026: https://www.uefa.com/news-media/news/02a0-1f71bdf70a9a-b6067bd647f2-1000--2026-european-football-calendar-dates-for-all-uefa-competitions-draws-and-events-for-a/

## Próximas integrações obrigatórias
1. Tela de seleção por continente > país > divisão > clube.
2. Gerador de calendário que respeite datas bloqueadas, datas FIFA, copas e conflitos de estádio.
3. Campeonatos estaduais e regionais com classificação para copas nacionais.
4. Promoção/rebaixamento entre divisões e atualização automática de participantes.
5. Importador de regulamentos e calendários oficiais com fonte, data de atualização e versão.
6. Separar futebol masculino, feminino, base e profissional.
7. Validar licenças de nomes, escudos, fotos, marcas e bases de dados antes de uma distribuição comercial.
