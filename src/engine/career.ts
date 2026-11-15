import type {Career,CareerMode,Position} from "./types";
export function newCareer(mode:CareerMode,name:string,age:number,position:Position,club:string,nationality:string):Career{return{id:crypto.randomUUID(),mode,name,age,position,club,season:2026,overall:mode==="player"?62:mode==="manager"?58:55,morale:72,reputation:15,balance:mode==="director"?45000000:25000,salary:mode==="player"?6500:mode==="manager"?18000:30000,history:["2026 · Carreira iniciada"],nationality};}
export function money(n:number){return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});}
export function bounded(n:number,min=0,max=100){return Math.max(min,Math.min(max,n));}
