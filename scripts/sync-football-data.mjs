import fs from "node:fs/promises";

const key = process.env.API_FOOTBALL_KEY;
if (!key) throw new Error("API_FOOTBALL_KEY ausente. Configure o secret do repositório.");

const base = "https://v3.football.api-sports.io";
async function api(path) {
  const response = await fetch(base + path, { headers: { "x-apisports-key": key } });
  const body = await response.json();
  if (!response.ok || (body.errors && Object.keys(body.errors).length)) {
    throw new Error("API-Football: " + JSON.stringify(body.errors || body));
  }
  return body.response || [];
}

const targets = [
  ["Brazil", ["Serie A", "Série A"]],
  ["England", ["Premier League", "Championship"]],
  ["Spain", ["La Liga", "LaLiga"]],
  ["Germany", ["Bundesliga", "2. Bundesliga"]],
  ["Italy", ["Serie A", "Serie B"]],
  ["France", ["Ligue 1", "Ligue 2"]],
  ["Portugal", ["Primeira Liga"]],
  ["Netherlands", ["Eredivisie"]],
  ["Scotland", ["Premiership"]],
  ["Turkey", ["Süper Lig", "Super Lig"]],
  ["USA", ["Major League Soccer"]],
  ["Mexico", ["Liga MX"]],
  ["Argentina", ["Liga Profesional Argentina", "Primera Division"]],
  ["Japan", ["J1 League"]],
  ["Saudi-Arabia", ["Pro League"]],
  ["South-Africa", ["Premier Soccer League"]]
];

const available = await api("/leagues?season=2026");
const selected = [];
for (const [country, names] of targets) {
  for (const name of names) {
    const match = available.find(x =>
      String(x.country?.name || "").toLowerCase() === country.toLowerCase() &&
      String(x.league?.name || "").toLowerCase() === name.toLowerCase()
    );
    if (match && !selected.some(x => x.league.id === match.league.id)) selected.push(match);
  }
}

const leagues = [];
const teams = [];
for (const item of selected) {
  const id = item.league.id;
  const season = item.seasons?.find(x => x.year === 2026)?.year || 2026;
  const leagueName = item.league.name;
  const country = item.country?.name || "Unknown";
  leagues.push({ id, name: leagueName, country, season });
  const roster = await api(`/teams?league=${id}&season=${season}`);
  for (const entry of roster) {
    if (!entry.team?.id || !entry.team?.name) continue;
    teams.push({
      id: String(entry.team.id),
      name: entry.team.name,
      country,
      league: leagueName,
      stadium: entry.venue?.name || "Estádio a definir",
      capacity: Number(entry.venue?.capacity || 20000),
      founded: entry.team.founded || null
    });
  }
}
const unique = [...new Map(teams.map(t => [t.id, t])).values()];
if (!unique.length) throw new Error("A API não retornou clubes. Arquivo anterior foi preservado.");
await fs.writeFile("src/data/live-football.json", JSON.stringify({
  source: "API-Football",
  season: 2026,
  updatedAt: new Date().toISOString(),
  leagues,
  teams: unique
}, null, 2) + "\n");
console.log(`Sincronizados ${unique.length} clubes em ${leagues.length} ligas. Nenhuma chave foi gravada no arquivo.`);
