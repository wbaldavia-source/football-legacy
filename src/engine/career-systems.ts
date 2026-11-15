import type { Position } from "./types";

export type PlayerAttributes = {
  pace:number; shooting:number; passing:number; dribbling:number;
  defending:number; physical:number; goalkeeping:number;
};
export type PlayerDevelopment = {
  overall:number; potential:number; age:number; morale:number;
  attributes:PlayerAttributes; trainingLoad:number; injuryDays:number;
};
export type TrainingPlan = "balanced"|"technical"|"physical"|"tactical"|"recovery";
export type DevelopmentResult = {player:PlayerDevelopment; changed:string[]; message:string};

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function calculateOverall(position:Position,a:PlayerAttributes):number {
  const weights:Record<Position,number[]> = {
    GK:[0.05,0.02,0.2,0.02,0.05,0.16,0.5],
    CB:[0.45,0.03,0.12,0.03,0.24,0.13,0],
    LB:[0.22,0.02,0.12,0.12,0.25,0.27,0],
    RB:[0.22,0.02,0.12,0.12,0.25,0.27,0],
    LWB:[0.25,0.02,0.1,0.15,0.2,0.28,0],
    RWB:[0.25,0.02,0.1,0.15,0.2,0.28,0],
    DM:[0.12,0.04,0.2,0.1,0.3,0.24,0],
    CM:[0.1,0.12,0.22,0.2,0.16,0.2,0],
    AM:[0.12,0.2,0.2,0.24,0.08,0.16,0],
    LM:[0.2,0.1,0.16,0.2,0.12,0.22,0],
    RM:[0.2,0.1,0.16,0.2,0.12,0.22,0],
    LW:[0.22,0.2,0.12,0.25,0.04,0.17,0],
    RW:[0.22,0.2,0.12,0.25,0.04,0.17,0],
    ST:[0.12,0.42,0.08,0.18,0.02,0.18,0]
  };
  const v=[a.pace,a.shooting,a.passing,a.dribbling,a.defending,a.physical,a.goalkeeping];
  return Math.round(weights[position].reduce((sum,w,i)=>sum+w*v[i],0));
}
export function developPlayer(player:PlayerDevelopment,position:Position,plan:TrainingPlan,random=Math.random):DevelopmentResult {
  const p={...player,attributes:{...player.attributes}};
  const changed:string[]=[];
  if(p.injuryDays>0){p.injuryDays=Math.max(0,p.injuryDays-7);p.trainingLoad=clamp(p.trainingLoad-12,0,100);return {player:p,changed:["recuperação"],message:"Atleta em recuperação; treino intenso suspenso."};}
  const ageFactor=p.age<21?1.35:p.age<25?1:p.age<30?.55:.2;
  const load=plan==="recovery"?-22:plan==="physical"?18:10;
  p.trainingLoad=clamp(p.trainingLoad+load,0,100);
  const focus:Record<TrainingPlan,(keyof PlayerAttributes)[]>={balanced:["pace","shooting","passing","dribbling","defending","physical"],technical:["shooting","passing","dribbling"],physical:["pace","physical"],tactical:["passing","defending"],recovery:[]};
  for(const key of focus[plan]){
    const ceiling=plan==="recovery"?0:p.potential;
    if(p.attributes[key]<ceiling&&random()<.52*ageFactor*(1-p.trainingLoad/180)){
      p.attributes[key]=clamp(p.attributes[key]+1,1,99);changed.push(key);
    }
  }
  if(plan==="recovery"){p.morale=clamp(p.morale+4,0,100);p.trainingLoad=clamp(p.trainingLoad,0,100);}
  else if(p.trainingLoad>82&&random()<.12){p.injuryDays=7+Math.floor(random()*22);p.morale=clamp(p.morale-5,0,100);}
  else p.morale=clamp(p.morale+(changed.length?2:0),0,100);
  p.overall=calculateOverall(position,p.attributes);
  return {player:p,changed,message:changed.length?("Evolução em: "+changed.join(", ")):"Treino concluído; atributos mantidos nesta sessão."};
}

export type Contract={clubId:string;wage:number;years:number;bonus:number;releaseClause:number;status:"active"|"offer"|"expired"};
export type ContractOffer={wage:number;years:number;bonus:number;releaseClause:number};
export function evaluateContract(current:Contract,offer:ContractOffer,clubBudget:number,playerMorale:number):{accepted:boolean;score:number;reason:string}{
  const wageScore=offer.wage/Math.max(1,current.wage);
  const termScore=offer.years>=2?1.08:offer.years===1?.92:0.5;
  const bonusScore=offer.bonus/Math.max(1,current.wage*.5);
  const budgetScore=offer.wage*52<=clubBudget*.18?1:0.65;
  const moraleScore=playerMorale<35?1.15:1;
  const score=(wageScore*.62+termScore*.18+Math.min(1.4,bonusScore)*.1+budgetScore*.1)*moraleScore;
  return {accepted:score>=1,score,reason:score>=1?"Proposta aceita pelo atleta.":"Proposta recusada: salário, duração ou bônus abaixo da expectativa."};
}

export type ClubFinance={cash:number;debt:number;weeklyWageBill:number;transferBudget:number;reputation:number;boardConfidence:number};
export type FinanceEntry={id:string;season:number;category:"ticketing"|"sponsor"|"broadcast"|"wages"|"transfer"|"stadium"|"academy"|"prize"|"other";amount:number;description:string};
export function postFinance(finance:ClubFinance,entry:FinanceEntry):ClubFinance{
  const next={...finance};
  if(entry.amount>=0)next.cash+=entry.amount;else next.cash+=entry.amount;
  if(entry.category==="transfer"&&entry.amount<0)next.transferBudget=Math.max(0,next.transferBudget+entry.amount);
  if(entry.category==="prize"||entry.category==="sponsor"||entry.category==="broadcast")next.transferBudget+=Math.max(0,entry.amount)*.35;
  if(next.cash<0){next.debt+=Math.abs(next.cash);next.cash=0;next.boardConfidence=Math.max(0,next.boardConfidence-4);}
  return next;
}
export function boardConfidence(current:number,leaguePosition:number,expectedPosition:number,financeBalance:number):number{
  const sporting=leaguePosition<=expectedPosition?3:leaguePosition>=expectedPosition+5?-7:-2;
  const financial=financeBalance>=0?1:-5;
  return clamp(current+sporting+financial,0,100);
}

export type Stadium={capacity:number;ticketPrice:number;maintenance:number;cleanliness:number;security:number;accessibility:number;pitchQuality:number};
export type MatchdayResult={attendance:number;revenue:number;cost:number;net:number;next:Stadium};
export function runMatchday(stadium:Stadium,demand:number,random=Math.random):MatchdayResult{
  const quality=(stadium.cleanliness+stadium.security+stadium.accessibility+stadium.pitchQuality)/400;
  const attendance=Math.round(clamp(demand*quality,0,stadium.capacity));
  const revenue=attendance*stadium.ticketPrice;
  const cost=stadium.maintenance+attendance*3.5;
  const next={...stadium,cleanliness:clamp(stadium.cleanliness-3,0,100),pitchQuality:clamp(stadium.pitchQuality-1,0,100)};
  return {attendance,revenue,cost,net:revenue-cost,next};
}
export function improveStadium(stadium:Stadium,area:"cleanliness"|"security"|"accessibility"|"pitchQuality",cash:number):{stadium:Stadium;cost:number;ok:boolean}{
  const cost=area==="cleanliness"?25000:area==="security"?180000:area==="accessibility"?220000:350000;
  if(cash<cost)return {stadium,cost,ok:false};
  return {stadium:{...stadium,[area]:clamp(stadium[area]+15,0,100)},cost,ok:true};
}

export type YouthPlayer={id:string;name:string;age:number;position:Position;overall:number;potential:number;morale:number;level:"U15"|"U17"|"U20"|"senior";contracted:boolean};
export function promoteYouth(player:YouthPlayer):YouthPlayer{
  const level=player.age>=20?"senior":player.age>=17?"U20":player.age>=15?"U17":"U15";
  return {...player,level,contracted:true};
}
export function scoutYouth(id:string,name:string,age:number,position:Position,scoutingLevel:number,random=Math.random):YouthPlayer{
  const potential=clamp(55+Math.floor(random()*25)+scoutingLevel*2,50,95);
  return {id,name,age,position,overall:clamp(35+Math.floor(random()*20),25,70),potential,morale:65,level:age>=20?"senior":age>=17?"U20":age>=15?"U17":"U15",contracted:false};
}
