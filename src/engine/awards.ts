export type AwardCategory="world-player"|"world-coach"|"golden-boot"|"best-goalkeeper"|"best-young-player"|"best-defender"|"best-midfielder"|"best-forward"|"team-of-year"|"league-mvp";
export type AwardCandidate={id:string;name:string;club:string;position:string;age:number;appearances:number;goals:number;assists:number;cleanSheets:number;saves:number;averageRating:number;trophies:number;internationalImpact:number};
export type Award={id:string;season:string;category:AwardCategory;winnerId:string;winnerName:string;club:string;score:number;runnerUpId?:string};
const score=(p:AwardCandidate,c:AwardCategory)=>{const apps=Math.min(1,p.appearances/35);switch(c){
 case "golden-boot":return p.goals*4+p.assists*.7;
 case "best-goalkeeper":return p.cleanSheets*3+p.saves*.18+p.averageRating*apps*2;
 case "best-young-player":return (p.age<=21?12:0)+p.averageRating*2+p.goals*.8+p.assists*.5;
 case "best-defender":return p.averageRating*2.2+p.cleanSheets*.7+p.trophies*2;
 case "best-midfielder":return p.averageRating*2+p.assists*1.5+p.goals*.8;
 case "best-forward":return p.goals*2+p.assists+p.averageRating;
 default:return p.averageRating*apps*2+p.goals*.8+p.assists*.65+p.trophies*3+p.internationalImpact;
}};
export function calculateAward(candidates:AwardCandidate[],category:AwardCategory,season:string):Award|null{
 const ranked=candidates.map(p=>({p,score:score(p,category)})).sort((a,b)=>b.score-a.score);
 if(!ranked.length)return null;const {p,score:s}=ranked[0];
 return{id:`${season}-${category}`,season,category,winnerId:p.id,winnerName:p.name,club:p.club,score:Math.round(s*100)/100,runnerUpId:ranked[1]?.p.id};
}
export function calculateSeasonAwards(candidates:AwardCandidate[],season:string):Award[]{return(["world-player","golden-boot","best-goalkeeper","best-young-player","best-defender","best-midfielder","best-forward"] as AwardCategory[]).map(c=>calculateAward(candidates,c,season)).filter((x):x is Award=>x!==null);}
