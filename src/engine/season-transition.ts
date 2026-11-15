import type {Standing} from "./competition";
import type {CompetitionRegulation} from "./rules";
import {calculateTierMovement,type TierTable} from "./rules";
export type TierRoster={tier:number;competitionId:string;clubIds:string[]};
export type SeasonTransition={rosters:TierRoster[];promoted:string[];relegated:string[];errors:string[]};
export function transitionLeagueTiers(rosters:TierRoster[],tables:TierTable[],rules:CompetitionRegulation[]):SeasonTransition{
 const errors:string[]=[];
 for(const r of rosters){if(new Set(r.clubIds).size!==r.clubIds.length)errors.push(`Clube duplicado na divisão ${r.tier}.`);}
 const moves=calculateTierMovement(tables,rules);
 const next=rosters.map(r=>({...r,clubIds:[...r.clubIds]}));
 for(const m of moves){
  const from=next.find(r=>r.tier===m.fromTier),to=next.find(r=>r.tier===m.toTier);
  if(!from||!to){errors.push(`Divisão de destino/origem ausente para ${m.clubName}.`);continue;}
  from.clubIds=from.clubIds.filter(id=>id!==m.clubId);
  if(!to.clubIds.includes(m.clubId))to.clubIds.push(m.clubId);
 }
 for(const r of next)if(new Set(r.clubIds).size!==r.clubIds.length)errors.push(`Movimentação gerou duplicidade na divisão ${r.tier}.`);
 return{rosters:next,promoted:moves.filter(m=>m.toTier<m.fromTier).map(m=>m.clubId),relegated:moves.filter(m=>m.toTier>m.fromTier).map(m=>m.clubId),errors};
}
