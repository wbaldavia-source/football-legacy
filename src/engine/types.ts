export type CareerMode = "player" | "manager" | "director";
export type Position = "GK"|"CB"|"LB"|"RB"|"DM"|"CM"|"AM"|"LW"|"RW"|"ST";
export type Career = {id:string;mode:CareerMode;name:string;age:number;position:Position;club:string;season:number;overall:number;morale:number;reputation:number;balance:number;salary:number;history:string[];nationality:string};
export type Club = {id:string;name:string;country:string;league:string;budget:number;stadium:string;capacity:number;fans:number};
export type Prospect = {name:string;age:number;position:Position;potential:number;club:string;level:"Sub-15"|"Sub-17"|"Sub-20"};
