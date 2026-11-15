# Dados reais, licenças e regulamentos

## Política de dados
O jogo distingue:
1. **Dados oficiais**: regulamentos, calendários, tabelas e listas publicados por FIFA, confederações, federações e ligas.
2. **Dados de provedores**: clubes, elencos, atletas, fotos, escudos, uniformes e estatísticas fornecidos por APIs licenciadas.
3. **Dados simulados**: usados quando não há fonte verificada; sempre identificados como fictícios.

Cada pacote precisa guardar fonte, data de coleta, temporada, identificador externo, licença, atribuição, política de cache e permissão de redistribuição.

## Integrações de dados candidatas
- football-data.org: documentação v4, clubes, competições, elencos e escudos em cobertura seletiva. Requer token e sua cobertura não representa todas as ligas do mundo.
  https://docs.football-data.org/general/v4/index.html
- API-Football: cobertura maior de ligas, partidas, jogadores, estatísticas e mídia. Requer chave; os termos do provedor alertam que escudos/fotos/logos podem continuar protegidos por direitos de terceiros.
  https://www.api-football.com/documentation-v3
- Fontes oficiais: FIFA, AFC, CAF, Concacaf, CONMEBOL, OFC, UEFA e federações nacionais para regulamentos e calendários.

## Escudos, uniformes e fotos
Não copiar imagens aleatórias de mecanismos de busca para o repositório. Escudos são marcas; uniformes podem conter marcas de patrocinadores e desenhos protegidos; fotografias de atletas têm direitos autorais e direitos de imagem.
O jogo pode exibir URL de mídia de provedor apenas quando os termos autorizarem o uso pretendido. Para lançamento comercial, validar licença por ativo e território. Sem licença, usar identidade visual genérica e uniforme procedural inspirado apenas em cores de referência, sem reproduzir escudo, patrocinador ou design protegido.
Fotos reais só entram com autorização/licença comercial adequada. Não inferir nem coletar dados pessoais sensíveis.

## Regulamentos e acessos
Cada edição de competição deve possuir cópia/URL do REC, data de vigência e versão. Critérios de desempate, número de participantes, fases, acesso/descenso, playoffs, inscrições, estrangeiros, substituições, premiação e vagas continentais devem vir do regulamento daquela edição.
Não usar regra genérica de quatro acessos/descensos para todas as ligas. O motor recebe regras configuráveis por competição e temporada. Quando o regulamento não estiver verificado, o modo carreira deve identificar a regra como simulada e permitir ajuste de configuração.

## Referências iniciais
- FIFA International Match Calendar 2026: https://inside.fifa.com/tournament-organisation/international-match-calendars
- FIFA World Cup 2026 — calendário de 104 jogos: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/updated-fifa-world-cup-2026-match-schedule-now-available
- CBF calendário profissional masculino 2026: https://www.cbf.com.br/a-cbf/noticias/informes-cbf/a/cbf-anuncia-novo-calendario-do-futebol-profissional-masculino
- UEFA Champions League Regulations 2026/27: https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27-Online
- CBF Série B 2026 REC: https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/REC_Brasileiro_Serie_B_2026_85d55b9f72.pdf

## Premiações
Valores oficiais de premiação mudam por edição, fase, moeda, direitos de transmissão e distribuição. O sistema armazena tabelas por competição/temporada com fonte e vigência. Não preencher valores fictícios em um campo rotulado como oficial.
Prêmios individuais do jogo (melhor jogador do mundo, artilheiro, goleiro, jovem, técnico e seleções da temporada) são calculados a partir das estatísticas persistidas. O nome de prêmios comerciais e seus troféus/logotipos exigem atenção a marcas e licenças.

## Cobertura mundial
A cobertura de todas as ligas, divisões, equipes, seleções masculinas/femininas e categorias de base é progressiva. O catálogo inicial é apenas uma camada de arranque. A arquitetura suporta importação de pacotes de dados, mas a cobertura real depende de fonte e direitos. Não anunciar cobertura integral enquanto cada país/competição não tiver sido importado e validado.
