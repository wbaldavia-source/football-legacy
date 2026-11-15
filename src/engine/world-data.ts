export type DataLicenseStatus="unknown"|"personal-use-only"|"commercial-use-allowed"|"restricted"|"expired";
export type DataSource={id:string;provider:string;endpoint:string;retrievedAt:string;licenseStatus:DataLicenseStatus;termsUrl:string;attribution?:string;redistributionAllowed:boolean;cachePolicy?:string};
export type SourcedRecord<T>={data:T;sourceId:string;sourceRecordId:string;lastVerifiedAt:string;confidence:"official"|"provider"|"community"|"placeholder"};
export type ExternalClubRecord={externalId:string;name:string;shortName?:string;country:string;competitionId?:string;founded?:number;stadium?:string;capacity?:number;colors?:string;crestUrl?:string;website?:string};
export type ExternalPlayerRecord={externalId:string;name:string;birthDate?:string;nationality?:string;position?:string;shirtNumber?:number;clubExternalId?:string;photoUrl?:string;marketValue?:number};
export type ExternalCompetitionRecord={externalId:string;name:string;country:string;season:string;type:"LEAGUE"|"CUP";emblemUrl?:string};
export interface FootballDataProvider{
 id:string;
 listCompetitions():Promise<ExternalCompetitionRecord[]>;
 listTeams(competitionId:string):Promise<ExternalClubRecord[]>;
 getSquad(teamId:string):Promise<ExternalPlayerRecord[]>;
}
export const DATA_PROVIDERS={
 footballData:{id:"football-data.org",docs:"https://docs.football-data.org/general/v4/index.html",api:"https://api.football-data.org/v4",requiresSecret:"FOOTBALL_DATA_TOKEN"},
 apiFootball:{id:"API-Football",docs:"https://www.api-football.com/documentation-v3",api:"https://v3.football.api-sports.io",requiresSecret:"API_FOOTBALL_KEY"}
} as const;
export function assetMayBeUsedCommercially(source:DataSource):boolean{return source.licenseStatus==="commercial-use-allowed"&&source.redistributionAllowed;}
