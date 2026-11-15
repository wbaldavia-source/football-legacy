# FOOTBALL LEGACY – World Career

Starter de desenvolvimento para um simulador web de carreira de futebol masculino.

## Requisitos
- Node.js 20+
- npm 10+

## Executar localmente
```bash
npm install
npm run dev
```
Abra http://localhost:3000.

## Estado desta entrega
Esta é a fundação funcional do projeto: dashboard responsivo, escolha de carreira, decisões com efeitos em atributos/reputação, calendário de temporada simulado e base de tipos para jogadores, treinadores, clubes, ligas e transferências.

Ainda não contém base mundial licenciada, autenticação, persistência em nuvem, fotos comerciais ou simulação completa de todas as ligas. Esses recursos exigem integração de dados, infraestrutura e licenças apropriadas. As imagens de jogadores reais não são incluídas sem autorização.

## Próximas integrações
1. Criar projeto Supabase e preencher `.env.local`.
2. Implementar autenticação e persistência das carreiras.
3. Importar dados de competições e clubes de fontes licenciadas/abertas, respeitando termos de uso.
4. Contratar/licenciar fotos e dados de atletas/técnicos.
5. Expandir motor de partidas, calendário, finanças, contratos, IA de clubes e mercado.
6. Deploy na Vercel.

## Estrutura
- `app/`: interface Next.js.
- `src/engine/`: regras de carreira e simulação.
- `src/data/`: dados demonstrativos, substituíveis por provedores licenciados.
