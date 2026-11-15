import type {Standing} from "./competition";
export type KnockoutTie={id:string;homeId:string;awayId:string;leg:1|2;homeGoals?:number;awayGoals?:number;status:"scheduled"|"played"};
export type KnockoutResult={winnerId:string|null;aggregateHome:number;aggregateAway:number;decidedBy:"aggregate"|"penalties"|"pending"};
export function resolveTwoLegTie(first:KnockoutTie,second:KnockoutTie):KnockoutResult{
 if(first.status!=="played"||second.status!=="played"||first.homeGoals===undefined||first.awayGoals===undefined||second.homeGoals===undefined||second.awayGoals===undefined)return{winnerId:null,aggregateHome:0,aggregateAway:0,decidedBy:"pending"};
 if(first.homeId!==second.awayId||first.awayId!==second.homeId)throw new Error("Os mandos da volta não correspondem à ida.");
 const home=first.homeGoals+second.awayGoals,away=first.awayGoals+second.homeGoals;
 return{winnerId:home===away?null:home>away?first.homeId:first.awayId,aggregateHome:home,aggregateAway:away,decidedBy:home===away?"penalties":"aggregate"};
}
export function createGroupTable(groupId:string,clubIds:string[]):Standing[]{if(clubIds.length<3||new Set(clubIds).size!==clubIds.length)throw new Error("Grupo inválido: são necessários ao menos três clubes únicos.");return clubIds.map(id=>({clubId:id,clubName:id,played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,points:0,yellow:0,red:0}));}
export function qualifyFromGroups(groups:Standing[][],placesPerGroup:number):Standing[]{if(placesPerGroup<1)throw new Error("Vagas de classificação inválidas.");return groups.flatMap(group=>[...group].sort((a,b)=>b.points-a.points||b.wins-a.wins||(b.goalsFor-b.goalsAgainst)-(a.goalsFor-a.goalsAgainst)||b.goalsFor-a.goalsFor).slice(0,placesPerGroup));}
export function validateKnockoutBracket(clubIds:string[]):string[]{const e:string[]=[];if(clubIds.length<2)e.push("Mata-mata precisa de pelo menos dois clubes.");if((clubIds.length&(clubIds.length-1))!==0)e.push("O chaveamento deve ter potência de dois participantes; aplique byes antes de gerar.");if(new Set(clubIds).size!==clubIds.length)e.push("Há clubes duplicados no chaveamento.");return e;}
