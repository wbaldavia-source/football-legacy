export type ContractStatus="active"|"offered"|"expired"|"terminated"|"loan";
export type Contract={id:string;personId:string;clubId:string;startDate:string;endDate:string;weeklyWage:number;signingBonus:number;loyaltyBonus:number;releaseClause?:number;appearanceBonus?:number;goalBonus?:number;cleanSheetBonus?:number;agentFee:number;status:ContractStatus;role:"player"|"manager"|"staff";loanParentClubId?:string;loanEndDate?:string;options?:{extendYears?:number;buyOption?:number;mandatoryBuy?:boolean}};
export type ContractOffer=Pick<Contract,"personId"|"clubId"|"weeklyWage"|"signingBonus"|"loyaltyBonus"|"releaseClause"|"appearanceBonus"|"goalBonus"|"cleanSheetBonus"|"agentFee"|"role">&{years:number;counterOfferCount:number};
export type NegotiationContext={age:number;overall:number;potential:number;reputation:number;currentWeeklyWage:number;interest:number;clubBudget:number;role:"player"|"manager"|"staff"};
export type NegotiationResult={accepted:boolean;counter?:Partial<ContractOffer>;reason:string};
export function evaluateContractOffer(o:ContractOffer,c:NegotiationContext):NegotiationResult{
 const expected=c.currentWeeklyWage*Math.max(.65,Math.min(3.5,0.55+c.overall/100+c.reputation/250));
 const affordable=o.weeklyWage*52+o.signingBonus+o.agentFee<=c.clubBudget;
 if(!affordable)return{accepted:false,reason:"O pacote financeiro excede o orçamento disponível."};
 if(o.years<1||o.years>5)return{accepted:false,reason:"Duração contratual inválida."};
 if(o.weeklyWage<expected*.82||c.interest<25)return{accepted:false,counter:{weeklyWage:Math.round(expected),years:Math.min(4,o.years+1)},reason:"O profissional pede melhores condições ou não demonstra interesse suficiente."};
 return{accepted:true,reason:"Proposta aceita; falta concluir exames, registro e assinatura."};
}
export function contractExpiryDays(endDate:string,now=new Date()):number{return Math.ceil((new Date(endDate+"T23:59:59").getTime()-now.getTime())/86400000);}
