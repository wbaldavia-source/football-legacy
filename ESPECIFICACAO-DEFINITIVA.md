# FOOTBALL LEGACY – World Career
## Especificação funcional e técnica — versão 1.0

### 1. Visão do produto
Simulador web de carreira de futebol masculino, com duas trajetórias principais (jogador e treinador), mundo persistente, decisões narrativas com consequências, calendário esportivo, partidas simuladas, desenvolvimento de atletas, gestão de clubes e mercado dinâmico. A experiência deve funcionar em navegadores móveis e desktop.

### 2. Princípios
- Decisões têm efeitos mensuráveis e podem gerar consequências futuras.
- O mundo continua evoluindo sem depender exclusivamente do usuário.
- Dados reais devem ter proveniência, data de atualização e direitos de uso verificados.
- Fotografias reais só entram com licença/consentimento adequado.
- Conteúdo demonstrativo deve ser claramente identificado como fictício.
- Carreiras devem ser persistentes, exportáveis e protegidas por autenticação.

### 3. Modos de carreira
#### Jogador
Criação de personagem, posição, pé dominante, altura, peso, nacionalidade, clube inicial e fotografia própria. Ciclo de vida: base, profissionalização, auge, declínio e aposentadoria. Após aposentar, pode iniciar trajetória como treinador (desbloqueio opcional configurável).

#### Treinador
Criação de perfil, licenças/experiência, reputação, filosofia tática e clube inicial. Gestão de elenco, comissão, treinos, tática, finanças, diretoria, imprensa, contratos e objetivos.

### 4. Motor de decisões
Cada evento possui gatilhos, opções, efeitos imediatos, efeitos diferidos, requisitos e probabilidade. Efeitos possíveis: moral, reputação, atributos, relação com treinador/diretoria/companheiros, finanças, risco de lesão, minutos, status no elenco e interesse de mercado. O motor registra decisão, estado anterior, efeitos aplicados e evento de origem para auditoria e replay narrativo.

Categorias de eventos: vestiário, imprensa, família, empresário, lesões, seleção, patrocínio, diretoria, torcida, disciplina, propostas, crise esportiva e oportunidades.

### 5. Atributos
Jogador: ritmo, aceleração, força, resistência, impulsão, finalização, potência, passe curto/longo, visão, cruzamento, drible, domínio, marcação, desarme, posicionamento, concentração, liderança, disciplina e profissionalismo. Atributos são contextualizados por posição e pé dominante; Overall é calculado por pesos posicionais, não média simples.

Treinador: conhecimento tático, treino, gestão de grupo, liderança, motivação, leitura de jogo, desenvolvimento de jovens, análise de adversário, gestão financeira e comunicação.

### 6. Simulação esportiva
Calendário por competição, mando de campo, descanso, fadiga, moral, força do elenco, tática, entrosamento, clima/estádio quando houver dados confiáveis. Partida gera placar, escalações, eventos, estatísticas e desempenho individual. O resultado deve ser determinístico a partir de uma seed registrada, para permitir auditoria e reprocessamento.

### 7. Mundo de clubes e competições
Entidades: país, federação, liga, divisão, temporada, competição, clube, estádio, elenco, jogador, treinador, comissão, contrato e inscrição. Competições suportam pontos corridos, mata-mata, grupos, ida/volta, promoção/rebaixamento, copas nacionais e torneios continentais. O catálogo é expansível por pacotes de dados.

A promessa de “todas as ligas do mundo” é um objetivo de cobertura progressiva: a plataforma deve suportar qualquer país/competição, mas a inclusão de cada liga depende da disponibilidade, qualidade, atualização e licença dos dados. Não declarar cobertura integral antes de validar cada pacote.

### 8. Mercado de transferências
Janela por país/competição, necessidade do elenco, orçamento, reputação, salário, duração de contrato, idade, potencial, forma, minutos, cláusulas, comissão de agente e interesse do atleta. Fluxo: sondagem → proposta → contraproposta → acordo entre clubes → negociação pessoal → exames/registro → anúncio. Suportar compra, empréstimo, opção/obrigação, troca, pré-contrato, renovação e rescisão. Clubes controlados por IA também negociam entre si.

### 9. Conteúdo real e direitos
A plataforma separa dados esportivos de ativos de imagem. Jogadores, técnicos, clubes, escudos, uniformes, fotografias e marcas podem exigir licenças distintas. Integrar provedores somente após revisão dos termos comerciais, atribuição, redistribuição, limites de cache e uso em jogos. Fotografia enviada pelo próprio usuário é privada por padrão, com controles de remoção e consentimento.

### 10. Identidade e compartilhamento
Perfil público opcional. Cards de temporada gerados com nome, foto autorizada, clube, temporada, estatísticas, conquistas e identidade visual do jogo. Exportação PNG e compartilhamento via Web Share API, com fallback de download/cópia. Não publicar automaticamente sem ação explícita.

### 11. Persistência e segurança
Autenticação por e-mail/OAuth; autorização por proprietário da carreira; políticas RLS no banco; validação de uploads, limites de tamanho/tipo, URLs assinadas, backups e logs. Segredos somente no servidor. Dados pessoais mínimos. Possibilidade de apagar conta, personagem e foto.

### 12. Arquitetura
- Frontend: Next.js, React, TypeScript, Tailwind.
- Backend gerenciado: Supabase Auth, PostgreSQL, Storage e Edge Functions quando apropriado.
- Motor de domínio: TypeScript isolado da UI, com testes unitários.
- Hospedagem: Vercel ou infraestrutura equivalente.
- Integrações externas atrás de adaptadores, evitando acoplamento a um fornecedor.

### 13. Modelo de dados (núcleo)
users, player_profiles, careers, career_events, decisions, decision_choices, countries, federations, leagues, seasons, competitions, clubs, stadiums, persons, player_attributes, manager_attributes, squads, squad_memberships, contracts, fixtures, matches, match_events, standings, transfer_windows, transfer_negotiations, transfer_offers, sponsors, achievements, media_assets, data_sources, data_import_runs.

### 14. Critérios de aceite
- Criar, salvar, retomar e apagar carreiras.
- Criar jogador com foto própria e consentimento.
- Iniciar carreira de treinador.
- Decisões alteram atributos/reputação/moral e ficam no histórico.
- Avançar calendário e simular partidas.
- Gerar classificação e estatísticas coerentes.
- IA de clubes realiza propostas e conclui transferências conforme regras.
- Gerar card de temporada e compartilhar manualmente.
- Importar ligas por pacote validado, com fonte e data.
- Interface responsiva e acessível em celular e desktop.

### 15. Fases de entrega
A. Fundação (entregue neste starter): interface, tipos de domínio, evento de decisão demonstrativo, estrutura Next.js.
B. Persistência: Supabase, autenticação, carreiras, uploads e RLS.
C. Núcleo esportivo: calendário, partidas, classificações, atributos e treino.
D. Universo de dados: importadores, países, ligas, clubes, elencos e técnicos.
E. Mercado: negociações, contratos, IA e janelas.
F. Conteúdo licenciado: fotos, escudos, nomes e estatísticas conforme contratos.
G. Compartilhamento, testes, otimização e lançamento.

### 16. Fora do escopo inicial
Partidas 3D controláveis, transmissão audiovisual, multiplayer síncrono e reprodução de marcas/escudos sem licença. O foco é simulação de carreira e gerenciamento.
