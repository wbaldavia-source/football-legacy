export type KitPattern="solid"|"stripes"|"hoops"|"sash"|"halves"|"pinstripes";
export type ClubVisualIdentity={clubId:string;primary:string;secondary:string;tertiary:string;pattern:KitPattern;crestUrl?:string;homeKitUrl?:string;awayKitUrl?:string;thirdKitUrl?:string;sourceUrl?:string;licenseStatus:"placeholder"|"review-required"|"licensed";attribution?:string};
export const CLUB_VISUALS:Record<string,ClubVisualIdentity>={
 "sao-paulo":{clubId:"sao-paulo",primary:"#FFFFFF",secondary:"#111111",tertiary:"#E31B23",pattern:"halves",licenseStatus:"placeholder"},
 "flamengo":{clubId:"flamengo",primary:"#C8102E",secondary:"#111111",tertiary:"#FFFFFF",pattern:"stripes",licenseStatus:"placeholder"},
 "palmeiras":{clubId:"palmeiras",primary:"#006437",secondary:"#FFFFFF",tertiary:"#006437",pattern:"solid",licenseStatus:"placeholder"},
 "corinthians":{clubId:"corinthians",primary:"#FFFFFF",secondary:"#111111",tertiary:"#D71920",pattern:"solid",licenseStatus:"placeholder"},
 "santos":{clubId:"santos",primary:"#FFFFFF",secondary:"#111111",tertiary:"#FFFFFF",pattern:"stripes",licenseStatus:"placeholder"}
};
export function visualForClub(clubId:string):ClubVisualIdentity{return CLUB_VISUALS[clubId]??{clubId,primary:"#234",secondary:"#EEE",tertiary:"#AAA",pattern:"solid",licenseStatus:"placeholder"};}
/** Assets externos devem ser usados somente após revisão de licença/termos comerciais. */
export function canDisplayAsset(asset:ClubVisualIdentity):boolean{return asset.licenseStatus==="licensed"&&!!asset.crestUrl;}
