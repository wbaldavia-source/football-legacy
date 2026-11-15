import type {Standing} from "./competition";

export type Tiebreaker = "points"|"wins"|"goalDifference"|"goalsFor"|"headToHead"|"fairPlay"|"draw";
export type CompetitionFormat = "round-robin"|"groups-knockout"|"knockout"|"split-season"|"league-phase";
export type CompetitionRegulation = {
 id:string; season:string; format:CompetitionFormat; clubs:number;
 pointsWin:number; pointsDraw:number; pointsLoss:number; legs:1|2;
 promotionPlaces:number; relegationPlaces:number; playoffPromotionPlaces:number;
 tiebreakers:Tiebreaker[]; awayGoalsRule:boolean; extraTime:boolean; penalties:boolean;
 squadRules:{maxRegistered:number; foreignPlayerLimit?:number; u21Minimum?:number; homegrownMinimum?:number};
 prizeMoney:{currency:string; champion:number; runnerUp:number; perWin?:number; participation?:number};
 sourceUrl:string; sourceUpdatedAt:string; verified:boolean;
};
export type TierTable={competitionId:string;tier:number;rows:Standing[]};
export type Movement={clubId:string;clubName:string;fromTier:number;toTier:number;reason:"direct-promotion"|"direct-relegation"|"promotion-playoff"|"relegation-playoff"};
export function calculateTierMovement(tables:TierTable[],regulations:CompetitionRegulation[]):Movement[]{
 const result:Movement[]=[];
 for(const table of tables){
  const rule=regulations.find(r=>r.id===table.competitionId);
  if(!rule)continue;
  const sorted=[...table.rows].sort((a,b)=>b.points-a.points||b.wins-a.wins||(b.goalsFor-b.goalsAgainst)-(a.goalsFor-a.goalsAgainst)||b.goalsFor-a.goalsFor||a.clubName.localeCompare(b.clubName));
  sorted.slice(0,rule.promotionPlaces).forEach(r=>result.push({clubId:r.clubId,clubName:r.clubName,fromTier:table.tier,toTier:Math.max(1,table.tier-1),reason:"direct-promotion"}));
  if(rule.relegationPlaces>0)sorted.slice(-rule.relegationPlaces).forEach(r=>result.push({clubId:r.clubId,clubName:r.clubName,fromTier:table.tier,toTier:table.tier+1,reason:"direct-relegation"}));
 }
 return result;
}
export function validateRegulation(r:CompetitionRegulation):string[]{
 const e:string[]=[];
 if(r.clubs<2)e.push("A competição precisa de ao menos dois clubes.");
 if(r.promotionPlaces+r.relegationPlaces>r.clubs)e.push("Vagas de acesso e descenso excedem o número de clubes.");
 if(!r.tiebreakers.length||r.tiebreakers[0]!=="points")e.push("A classificação deve começar por pontos.");
 if(!r.sourceUrl)e.push("Regulamento precisa de fonte.");
 if(r.prizeMoney.champion<0||r.prizeMoney.runnerUp<0)e.push("Premiações não podem ser negativas.");
 return e;
}
export function prizeForPosition(r:CompetitionRegulation,position:number):number{
 if(position===1)return r.prizeMoney.champion;
 if(position===2)return r.prizeMoney.runnerUp;
 return r.prizeMoney.participation??0;
}
