/**
 * FOOTBALL LEGACY — catálogo internacional de competições e calendário-base.
 * Dados estruturais para a temporada 2026; datas genéricas são janelas de temporada,
 * não datas oficiais de cada rodada. Atualizar por federação antes de marcar partidas reais.
 */
export type SeasonModel = "calendar-year" | "split-year" | "cross-year";
export type CompetitionKind = "league" | "cup" | "supercup" | "continental" | "national-team" | "state";
export type WorldCompetition = {
  id: string; name: string; country: string; confederation: string;
  kind: CompetitionKind; tier?: number; seasonModel: SeasonModel;
  seasonStart: string; seasonEnd: string; officialCalendar: boolean;
  notes?: string;
};

export const BRAZIL_STATES = [
  ["AC","Acre"],["AL","Alagoas"],["AP","Amapá"],["AM","Amazonas"],["BA","Bahia"],
  ["CE","Ceará"],["DF","Distrito Federal"],["ES","Espírito Santo"],["GO","Goiás"],
  ["MA","Maranhão"],["MT","Mato Grosso"],["MS","Mato Grosso do Sul"],["MG","Minas Gerais"],
  ["PA","Pará"],["PB","Paraíba"],["PR","Paraná"],["PE","Pernambuco"],["PI","Piauí"],
  ["RJ","Rio de Janeiro"],["RN","Rio Grande do Norte"],["RS","Rio Grande do Sul"],
  ["RO","Rondônia"],["RR","Roraima"],["SC","Santa Catarina"],["SP","São Paulo"],
  ["SE","Sergipe"],["TO","Tocantins"]
] as const;

export const BRAZIL_2026_COMPETITIONS: WorldCompetition[] = [
  ...BRAZIL_STATES.map(([uf, state]) => ({
    id: `br-estadual-${uf.toLowerCase()}-2026`, name: `Campeonato ${state}`,
    country: "Brasil", confederation: "CONMEBOL", kind: "state" as const,
    seasonModel: "calendar-year" as const, seasonStart: "2026-01-11",
    seasonEnd: "2026-03-08", officialCalendar: false,
    notes: "Janela nacional de estaduais definida pela CBF; datas e formato específicos dependem da federação estadual."
  })),
  {id:"br-serie-a-2026",name:"Campeonato Brasileiro Série A",country:"Brasil",confederation:"CONMEBOL",kind:"league",tier:1,seasonModel:"calendar-year",seasonStart:"2026-01-28",seasonEnd:"2026-12-02",officialCalendar:true},
  {id:"br-serie-b-2026",name:"Campeonato Brasileiro Série B",country:"Brasil",confederation:"CONMEBOL",kind:"league",tier:2,seasonModel:"calendar-year",seasonStart:"2026-03-21",seasonEnd:"2026-11-28",officialCalendar:true},
  {id:"br-serie-c-2026",name:"Campeonato Brasileiro Série C",country:"Brasil",confederation:"CONMEBOL",kind:"league",tier:3,seasonModel:"calendar-year",seasonStart:"2026-04-05",seasonEnd:"2026-10-25",officialCalendar:true},
  {id:"br-serie-d-2026",name:"Campeonato Brasileiro Série D",country:"Brasil",confederation:"CONMEBOL",kind:"league",tier:4,seasonModel:"calendar-year",seasonStart:"2026-04-05",seasonEnd:"2026-09-13",officialCalendar:true},
  {id:"br-copa-brasil-2026",name:"Copa do Brasil",country:"Brasil",confederation:"CONMEBOL",kind:"cup",seasonModel:"calendar-year",seasonStart:"2026-02-18",seasonEnd:"2026-12-06",officialCalendar:true},
  {id:"br-copa-nordeste-2026",name:"Copa do Nordeste",country:"Brasil",confederation:"CONMEBOL",kind:"cup",seasonModel:"calendar-year",seasonStart:"2026-03-25",seasonEnd:"2026-06-07",officialCalendar:true},
  {id:"br-copa-verde-2026",name:"Copa Verde",country:"Brasil",confederation:"CONMEBOL",kind:"cup",seasonModel:"calendar-year",seasonStart:"2026-03-25",seasonEnd:"2026-06-07",officialCalendar:true},
  {id:"br-copa-sul-sudeste-2026",name:"Copa Sul-Sudeste",country:"Brasil",confederation:"CONMEBOL",kind:"cup",seasonModel:"calendar-year",seasonStart:"2026-03-25",seasonEnd:"2026-06-07",officialCalendar:true},
  {id:"conmebol-libertadores-2026",name:"CONMEBOL Libertadores",country:"América do Sul",confederation:"CONMEBOL",kind:"continental",seasonModel:"calendar-year",seasonStart:"2026-02-04",seasonEnd:"2026-11-28",officialCalendar:true},
  {id:"conmebol-sudamericana-2026",name:"CONMEBOL Sul-Americana",country:"América do Sul",confederation:"CONMEBOL",kind:"continental",seasonModel:"calendar-year",seasonStart:"2026-03-04",seasonEnd:"2026-11-21",officialCalendar:true},
  {id:"conmebol-recopa-2026",name:"CONMEBOL Recopa",country:"América do Sul",confederation:"CONMEBOL",kind:"supercup",seasonModel:"calendar-year",seasonStart:"2026-02-18",seasonEnd:"2026-02-25",officialCalendar:true}
];

const crossYear = (id:string,name:string,country:string,confederation:string,tier=1):WorldCompetition => ({
  id,name,country,confederation,kind:"league",tier,seasonModel:"cross-year",
  seasonStart:"2026-08-01",seasonEnd:"2027-05-31",officialCalendar:false,
  notes:"Janela típica da temporada; calendário oficial de cada liga deve ser carregado separadamente."
});
const calendarYear = (id:string,name:string,country:string,confederation:string,tier=1):WorldCompetition => ({
  id,name,country,confederation,kind:"league",tier,seasonModel:"calendar-year",
  seasonStart:"2026-02-01",seasonEnd:"2026-12-15",officialCalendar:false,
  notes:"Janela típica; datas variam conforme país e edição."
});

/** Primeiras divisões prioritárias; catálogo extensível por país, nível e gênero. */
export const WORLD_TOP_LEAGUES: WorldCompetition[] = [
  crossYear("eng-premier-league","Premier League","Inglaterra","UEFA"),
  crossYear("eng-championship","EFL Championship","Inglaterra","UEFA",2),
  crossYear("esp-laliga","LaLiga","Espanha","UEFA"),
  crossYear("esp-laliga2","LaLiga Hypermotion","Espanha","UEFA",2),
  crossYear("ger-bundesliga","Bundesliga","Alemanha","UEFA"),
  crossYear("ger-2-bundesliga","2. Bundesliga","Alemanha","UEFA",2),
  crossYear("ita-serie-a","Serie A","Itália","UEFA"),
  crossYear("ita-serie-b","Serie B","Itália","UEFA",2),
  crossYear("fra-ligue-1","Ligue 1","França","UEFA"),
  crossYear("fra-ligue-2","Ligue 2","França","UEFA",2),
  crossYear("por-primeira-liga","Primeira Liga","Portugal","UEFA"),
  crossYear("ned-eredivisie","Eredivisie","Países Baixos","UEFA"),
  crossYear("sco-premiership","Scottish Premiership","Escócia","UEFA"),
  crossYear("tur-super-lig","Süper Lig","Turquia","UEFA"),
  crossYear("bel-pro-league","Belgian Pro League","Bélgica","UEFA"),
  crossYear("aut-bundesliga","Austrian Bundesliga","Áustria","UEFA"),
  crossYear("sui-super-league","Swiss Super League","Suíça","UEFA"),
  crossYear("gre-super-league","Super League Greece","Grécia","UEFA"),
  crossYear("den-superliga","Danish Superliga","Dinamarca","UEFA"),
  crossYear("nor-eliteserien","Eliteserien","Noruega","UEFA"),
  crossYear("swe-allsvenskan","Allsvenskan","Suécia","UEFA"),
  crossYear("usa-mls","Major League Soccer","Estados Unidos","CONCACAF"),
  calendarYear("mex-liga-mx","Liga MX","México","CONCACAF"),
  calendarYear("arg-primera","Primera División","Argentina","CONMEBOL"),
  calendarYear("bra-serie-a","Campeonato Brasileiro Série A","Brasil","CONMEBOL"),
  calendarYear("chi-primera","Primera División","Chile","CONMEBOL"),
  calendarYear("col-primera-a","Categoría Primera A","Colômbia","CONMEBOL"),
  calendarYear("uru-primera","Primera División","Uruguai","CONMEBOL"),
  calendarYear("par-primera","Primera División","Paraguai","CONMEBOL"),
  calendarYear("ecu-serie-a","LigaPro Serie A","Equador","CONMEBOL"),
  calendarYear("jpn-j1","J1 League","Japão","AFC"),
  calendarYear("kor-k1","K League 1","Coreia do Sul","AFC"),
  calendarYear("chn-super-league","Chinese Super League","China","AFC"),
  calendarYear("sau-pro-league","Saudi Pro League","Arábia Saudita","AFC"),
  calendarYear("aus-a-league","A-League Men","Austrália","AFC"),
  calendarYear("rsa-premiership","Premier Soccer League","África do Sul","CAF"),
  calendarYear("egy-premier","Egyptian Premier League","Egito","CAF"),
  calendarYear("mar-botola","Botola Pro","Marrocos","CAF"),
  calendarYear("nga-premier","Nigeria Premier Football League","Nigéria","CAF")
];

export const INTERNATIONAL_2026: WorldCompetition[] = [
  {id:"fifa-world-cup-2026",name:"Copa do Mundo FIFA",country:"Mundo",confederation:"FIFA",kind:"national-team",seasonModel:"calendar-year",seasonStart:"2026-06-11",seasonEnd:"2026-07-19",officialCalendar:true},
  {id:"fifa-windows-mar-2026",name:"Data FIFA — março",country:"Mundo",confederation:"FIFA",kind:"national-team",seasonModel:"calendar-year",seasonStart:"2026-03-23",seasonEnd:"2026-03-31",officialCalendar:true},
  {id:"fifa-windows-sep-oct-2026",name:"Data FIFA — setembro/outubro",country:"Mundo",confederation:"FIFA",kind:"national-team",seasonModel:"calendar-year",seasonStart:"2026-09-21",seasonEnd:"2026-10-06",officialCalendar:true},
  {id:"fifa-windows-nov-2026",name:"Data FIFA — novembro",country:"Mundo",confederation:"FIFA",kind:"national-team",seasonModel:"calendar-year",seasonStart:"2026-11-09",seasonEnd:"2026-11-17",officialCalendar:true},
  {id:"uefa-champions-league-2026","name":"UEFA Champions League","country":"Europa","confederation":"UEFA","kind":"continental","seasonModel":"cross-year","seasonStart":"2026-07-07","seasonEnd":"2027-05-29","officialCalendar":true},
  {id:"uefa-europa-league-2026",name:"UEFA Europa League",country:"Europa",confederation:"UEFA",kind:"continental",seasonModel:"cross-year",seasonStart:"2026-07-09",seasonEnd:"2027-05-26",officialCalendar:true},
  {id:"uefa-conference-league-2026",name:"UEFA Conference League",country:"Europa",confederation:"UEFA",kind:"continental",seasonModel:"cross-year",seasonStart:"2026-07-09",seasonEnd:"2027-05-27",officialCalendar:true},
  {id:"afc-champions-elite-2026",name:"AFC Champions League Elite",country:"Ásia",confederation:"AFC",kind:"continental",seasonModel:"cross-year",seasonStart:"2026-08-01",seasonEnd:"2027-05-31",officialCalendar:false},
  {id:"caf-champions-league-2026",name:"CAF Champions League",country:"África",confederation:"CAF",kind:"continental",seasonModel:"cross-year",seasonStart:"2026-08-01",seasonEnd:"2027-05-31",officialCalendar:false},
  {id:"concacaf-champions-cup-2026",name:"CONCACAF Champions Cup",country:"América do Norte",confederation:"CONCACAF",kind:"continental",seasonModel:"calendar-year",seasonStart:"2026-02-03",seasonEnd:"2026-05-30",officialCalendar:false},
  {id:"ofc-champions-league-2026",name:"OFC Champions League",country:"Oceania",confederation:"OFC",kind:"continental",seasonModel:"calendar-year",seasonStart:"2026-03-01",seasonEnd:"2026-05-31",officialCalendar:false}
];

export const WORLD_COMPETITIONS_2026 = [...BRAZIL_2026_COMPETITIONS,...WORLD_TOP_LEAGUES,...INTERNATIONAL_2026];

export function getCompetitionsByCountry(country:string):WorldCompetition[] {
  return WORLD_COMPETITIONS_2026.filter(item => item.country === country);
}
export function getCompetitionsForDate(date:string):WorldCompetition[] {
  return WORLD_COMPETITIONS_2026.filter(item => item.seasonStart <= date && item.seasonEnd >= date);
}
