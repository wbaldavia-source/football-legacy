import type {Position} from "./types";
export type TacticalMentality="ultra-defensive"|"defensive"|"balanced"|"positive"|"attacking"|"all-out-attack";
export type Pressing="low"|"mid"|"high"|"gegenpress";
export type DefensiveLine="deep"|"standard"|"high";
export type BuildUp="direct"|"balanced"|"short"|"possession";
export type Formation={id:string;name:string;slots:Position[];description:string};
export type Tactics={formationId:string;mentality:TacticalMentality;pressing:Pressing;defensiveLine:DefensiveLine;buildUp:BuildUp;width:"narrow"|"balanced"|"wide";tempo:"slow"|"normal"|"fast";counterAttack:boolean;offsideTrap:boolean};
const f=(id:string,name:string,slots:Position[],description:string):Formation=>({id,name,slots,description});
export const FORMATIONS:Formation[]=[
 f("4-3-3","4-3-3",["GK","RB","CB","CB","LB","DM","CM","CM","RW","ST","LW"],"Amplitude, pressão e ataque pelos lados."),
 f("4-4-2","4-4-2",["GK","RB","CB","CB","LB","RM","CM","CM","LM","ST","ST"],"Duas linhas de quatro e dupla de ataque."),
 f("4-2-3-1","4-2-3-1",["GK","RB","CB","CB","LB","DM","DM","RW","AM","LW","ST"],"Equilíbrio com meia central e pontas."),
 f("3-5-2","3-5-2",["GK","CB","CB","CB","RWB","DM","CM","CM","LWB","ST","ST"],"Três zagueiros e alas de profundidade."),
 f("3-4-3","3-4-3",["GK","CB","CB","CB","RWB","CM","CM","LWB","RW","ST","LW"],"Trio ofensivo e amplitude."),
 f("4-1-4-1","4-1-4-1",["GK","RB","CB","CB","LB","DM","RM","CM","CM","LM","ST"],"Proteção central e linhas compactas."),
 f("4-3-2-1","4-3-2-1",["GK","RB","CB","CB","LB","DM","CM","CM","AM","AM","ST"],"Meias por dentro e jogo associativo."),
 f("5-3-2","5-3-2",["GK","RWB","CB","CB","CB","LWB","DM","CM","CM","ST","ST"],"Bloco baixo e transição rápida.")
];
export function getFormation(id:string):Formation{return FORMATIONS.find(x=>x.id===id)??FORMATIONS[0];}
export function validateTactics(t:Tactics):string[]{const formation=getFormation(t.formationId);return formation.slots.length===11?[]:["A formação precisa ter onze posições."];}
export function tacticalFit(position:Position,slot:Position):number{return position===slot?1:((position==="CM"&&["DM","AM"].includes(slot))||(position==="DM"&&slot==="CM")||(position==="LW"&&slot==="RW")||(position==="RW"&&slot==="LW")?0.78:0.45);}
