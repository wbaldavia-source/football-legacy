import { CareerProfile, Decision } from "./types";

export const initialPlayer: CareerProfile = {
  id:"career-demo", name:"Alex Silva", mode:"player", age:18, club:"Atlético Aurora",
  season:2026, overall:64, reputation:18, morale:72, balance:25000, salary:8000,
  position:"AM", attributes:{pace:67,shooting:61,passing:69,dribbling:70,defending:38,physical:58,mentality:63,professionalism:72},
  history:["2026 · Início da carreira profissional"]
};

export const initialManager: CareerProfile = {
  ...initialPlayer, id:"manager-demo", name:"Alex Silva", mode:"manager", age:35,
  club:"Atlético Aurora", overall:58, reputation:12, morale:70, salary:18000,
  attributes:{pace:20,shooting:20,passing:72,dribbling:20,defending:68,physical:20,mentality:75,professionalism:70},
  history:["2026 · Primeiro trabalho como treinador"]
};

export const weeklyDecision: Decision = {
  id:"bench-choice",
  title:"Uma conversa decisiva no vestiário",
  description:"Após dois jogos abaixo das expectativas, a comissão técnica sinalizou que você pode perder espaço. Como vai reagir?",
  options:[
    {label:"Ficar após o treino e trabalhar em silêncio", effects:{morale:5, reputation:2, attribute:"professionalism", attributeDelta:3}, outcome:"A comissão percebe sua dedicação. Você ganha pontos com o grupo."},
    {label:"Conversar diretamente com o treinador", effects:{morale:2, reputation:1, attribute:"mentality", attributeDelta:2}, outcome:"Uma conversa franca esclarece o que precisa melhorar."},
    {label:"Dar uma entrevista cobrando oportunidades", effects:{morale:7, reputation:-4}, outcome:"A torcida repercute sua fala, mas a comissão não gosta da exposição."},
    {label:"Pedir ao empresário para buscar outro clube", effects:{morale:-3, reputation:2, balance:-1500}, outcome:"Seu empresário começa a sondar o mercado. A mudança pode demorar."}
  ]
};

export function applyDecision(profile:CareerProfile, decision:Decision, optionIndex:number):CareerProfile {
  const option = decision.options[optionIndex];
  if (!option) return profile;
  const next = structuredClone(profile);
  next.morale = clamp(next.morale + (option.effects.morale ?? 0),0,100);
  next.reputation = clamp(next.reputation + (option.effects.reputation ?? 0),0,100);
  next.overall = clamp(next.overall + (option.effects.overall ?? 0),1,99);
  next.balance += option.effects.balance ?? 0;
  if(option.effects.attribute) {
    const key = option.effects.attribute;
    next.attributes[key] = clamp(next.attributes[key] + (option.effects.attributeDelta ?? 0),1,99);
  }
  next.history = [ `${next.season} · ${option.outcome}`, ...next.history ].slice(0,20);
  return next;
}

export function seasonSummary(profile:CareerProfile) {
  return {season:profile.season, club:profile.club, overall:profile.overall, reputation:profile.reputation, morale:profile.morale};
}
function clamp(n:number,min:number,max:number){return Math.max(min,Math.min(max,n));}
