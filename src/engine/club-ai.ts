import type {ClubFinance} from "./career-systems";
export type AIClub={id:string;name:string;budget:number;reputation:number;leaguePosition:number;expectedPosition:number;cash:number;wageBill:number;rosterCapacity:number};
export type TransferCandidate={id:string;name:string;age:number;overall:number;potential:number;weeklyWage:number;askingFee:number;position:string;clubId:string};
export type AITransferDecision={clubId:string;playerId:string;offerFee:number;offerWage:number;accepted:boolean;reason:string};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export function estimatePlayerValue(p:TransferCandidate):number{const ageFactor=p.age<21?1.35:p.age<25?1.25:p.age<29?1:p.age<33?.7:.42;return Math.round(Math.max(10000,(p.overall*p.overall*1800+p.potential* p.potential*420)*ageFactor));}
export function evaluateAITransfer(club:AIClub,p:TransferCandidate,seed=1):AITransferDecision{
 const value=estimatePlayerValue(p),need=clamp((club.expectedPosition-club.leaguePosition+3)/8,.15,1),budgetRoom=Math.max(0,club.cash-club.wageBill*8),offerFee=Math.min(Math.round(value*(.78+need*.32)),Math.round(budgetRoom*.35)),offerWage=Math.round(p.weeklyWage*(.92+club.reputation/500));
 const affordable=offerFee<=budgetRoom&&offerWage*52<=Math.max(0,club.budget-club.wageBill*52)*.22;
 const accepted=affordable&&offerFee>=p.askingFee*.82&&offerWage>=p.weeklyWage*.85&&p.overall>=48;
 return{clubId:club.id,playerId:p.id,offerFee,offerWage,accepted,reason:!affordable?"Limite financeiro":accepted?"Proposta compatível com valor, salário e necessidade do elenco":"Clube vendedor recusou ou atleta não atende à necessidade"};
}
export function calculateClubFinance(input:ClubFinance,week:{gate:number;sponsor:number;broadcast:number;wages:number;operations:number;transferInstallments:number}):ClubFinance{
 const income=Math.max(0,week.gate)+Math.max(0,week.sponsor)+Math.max(0,week.broadcast),expenses=Math.max(0,week.wages)+Math.max(0,week.operations)+Math.max(0,week.transferInstallments),net=income-expenses;
 const cash=Math.max(0,input.cash+net),debt=input.debt+Math.max(0,-(input.cash+net));
 return{...input,cash,debt,weeklyWageBill:week.wages,transferBudget:clamp(input.transferBudget+Math.max(0,net)*.2,0,Math.max(input.transferBudget,net)),boardConfidence:clamp(input.boardConfidence+(net>=0?1:-2),0,100)};
}
