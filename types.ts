export type CareerMode = "player" | "manager";
export type Position = "GK" | "CB" | "FB" | "DM" | "CM" | "AM" | "WG" | "ST";
export type Attributes = { pace:number; shooting:number; passing:number; dribbling:number; defending:number; physical:number; mentality:number; professionalism:number };
export type CareerProfile = {
  id:string; name:string; mode:CareerMode; age:number; club:string; season:number;
  overall:number; reputation:number; morale:number; attributes:Attributes;
  balance:number; salary:number; position?:Position; history:string[];
};
export type Decision = { id:string; title:string; description:string; options:{label:string; effects:Partial<Pick<CareerProfile,"morale"|"reputation"|"overall">> & {balance?:number; attribute?:keyof Attributes; attributeDelta?:number}; outcome:string}[] };
export type TransferOffer = {club:string; fee:number; wage:number; years:number; status:"received"|"accepted"|"rejected"};
