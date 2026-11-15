import fs from "node:fs/promises";

const key = process.env.API_FOOTBALL_KEY;
if (!key) throw new Error("API_FOOTBALL_KEY ausente. Configure o secret do repositório.");
const base = "https://v3.football.api-sports.io";
let requests = 0;
const MAX_REQUESTS = Number(process.env.API_FOOTBALL_MAX_REQUESTS || 95);
const seasonPreference = Number(process.env.FOOTBALL_SEASON || 2026);
async function api(path) {
  if (requests >= MAX_REQUESTS) throw new Error("Limite de segurança de chamadas atingido.");
  requests++;
  const response = await fetch(base + path, { headers: { "x-apisports-key": key } });
  const body = await response.json();
  if (!response.ok || (body.errors && Object.keys(body.errors).length)) {
    throw new Error("API-Football (" + response.status + "): " + JSON.stringify(body.errors || body));
  }
  return body.response || [];
}
const norm = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const targets = [
  ["Brazil", ["Serie A","Brasileirao Serie A"]],
  ["England", ["Premier League","Championship"]],
  ["Spain", ["La Liga","LaLiga"]],
  ["Germany", ["Bundesliga","2 Bundesliga"]],
  ["Italy", ["Serie A","Serie B"]],
  ["France", ["Ligue 1","Ligue 2"]],
  ["Portugal", ["Primeira Liga","Liga Portugal"]],
  ["Netherlands", ["Eredivisie"]],
  ["Scotland", ["Premiership"]],
  ["Turkey", ["Super Lig"]],
  ["USA", ["Major League Soccer"]],
  ["Mexico", ["Liga MX"]],
  ["Argentina", ["Liga Profesional Argentina","Primera Division"]],
  ["Japan", ["J1 League"]],
  ["Saudi Arabia", ["Pro League"]],
  ["South Africa", ["Premier Soccer League"]]
];
const available = await api("/leagues?season=" + seasonPreference);
const selected = [];
const warnings = [];
for (const [country, aliases] of targets) {
  const match = available.find(x => norm(x.country?.name) === norm(country) &&
    aliases.some(a => norm(x.league?.name) === norm(a)));
  if (!match) { warnings.push("Competição não localizada: " + country + " / " + aliases.join(", ")); continue; }
  const seasons = match.seasons || [];
  const season = seasons.find(x => x.year === seasonPreference && x.coverage?.fixtures) ||
    [...seasons].filter(x => x.year <= seasonPreference).sort((a,b)=>b.year-a.year)[0];
  if (!season) { warnings.push("Sem temporada disponível: " + country + " / " + match.league.name); continue; }
  if (!selected.some(x => x.league.id === match.league.id)) selected.push({...match, selectedSeason:season.year});
}
const leagues = [], teams = [];
for (const item of selected) {
  const id = item.league.id, season = item.selectedSeason;
  const leagueName = item.league.name, country = item.country?.name || "Unknown";
  leagues.push({id,name:leagueName,country,season,source:"API-Football"});
  try {
    const roster = await api("/teams?league=" + id + "&season=" + season);
    for (const entry of roster) {
      if (!entry.team?.id || !entry.team?.name) continue;
      teams.push({id:String(entry.team.id),name:entry.team.name,country,league:leagueName,leagueId:id,season,
        stadium:entry.venue?.name || "Estádio a definir",capacity:Number(entry.venue?.capacity || 0),
        founded:entry.team.founded || null});
    }
  } catch (error) { warnings.push("Falha ao importar clubes de " + leagueName + ": " + error.message); }
}
const unique = [...new Map(teams.map(t => [t.id,t])).values()];
if (!unique.length) throw new Error("A API não retornou clubes. Arquivo anterior foi preservado.");
// Elencos: limitar chamadas para respeitar o plano gratuito e priorizar os clubes do Brasil e ligas selecionadas.
const priority = unique.sort((a,b) => (a.country==="Brazil"?-1:0)-(b.country==="Brazil"?-1:0));
const squads = {};
const squadLimit = Math.min(70, Math.max(0, MAX_REQUESTS - requests - 2));
for (const team of priority.slice(0,squadLimit)) {
  try {
    const result = await api("/players/squads?team=" + team.id);
    const entry = result[0];
    squads[team.id] = (entry?.players || []).map(p => ({
      id:String(p.id),name:String(p.name || "Atleta"),age:Number(p.age || 0),
      number:p.number ?? null,position:String(p.position || "A definir"),
      nationality:p.nationality || null,source:"API-Football"
    }));
  } catch (error) { warnings.push("Elenco indisponível para " + team.name + ": " + error.message); }
}
const payload = {source:"API-Football",season:seasonPreference,updatedAt:new Date().toISOString(),
  requestsUsed:requests,leagues,teams:unique,squads,warnings};
await fs.writeFile("src/data/live-football.json",JSON.stringify(payload,null,2)+"\\n");
console.log("Sincronizados " + unique.length + " clubes, " + Object.keys(squads).length +
  " elencos e " + leagues.length + " competições. Chamadas: " + requests + ". Avisos: " + warnings.length + ".");
