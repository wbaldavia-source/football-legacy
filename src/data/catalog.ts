import type {Club,Position} from "@/engine/types";
export const positions:{value:Position;label:string}[]=[{value:"GK",label:"Goleiro"},{value:"CB",label:"Zagueiro"},{value:"LB",label:"Lateral esquerdo"},{value:"RB",label:"Lateral direito"},{value:"DM",label:"Volante"},{value:"CM",label:"Meio-campista"},{value:"AM",label:"Meia-atacante"},{value:"LW",label:"Ponta esquerda"},{value:"RW",label:"Ponta direita"},{value:"ST",label:"Centroavante"}];
export const clubs:Club[]=[
{id:"aurora",name:"Atlético Aurora",country:"Brasil",league:"Série A",budget:45000000,stadium:"Estádio Aurora",capacity:42000,fans:180000},
{id:"paulista",name:"União Paulista",country:"Brasil",league:"Série A",budget:28000000,stadium:"Arena Paulista",capacity:36000,fans:140000},
{id:"litoral",name:"Atlético do Litoral",country:"Brasil",league:"Série B",budget:12000000,stadium:"Estádio do Mar",capacity:22000,fans:72000},
{id:"real",name:"Real Montanha",country:"Espanha",league:"LaLiga",budget:85000000,stadium:"Nuevo Montaña",capacity:51000,fans:320000},
{id:"north",name:"Northbridge FC",country:"Inglaterra",league:"Premier League",budget:110000000,stadium:"Northbridge Park",capacity:58000,fans:410000},
{id:"lisboa",name:"Sporting do Tejo",country:"Portugal",league:"Liga Portugal",budget:36000000,stadium:"Estádio do Tejo",capacity:48000,fans:210000}
];
export const prospects=[{name:"Caio Nascimento",age:16,position:"ST" as Position,potential:88,club:"Atlético Aurora",level:"Sub-17" as const},{name:"Lucas Ferreira",age:14,position:"CM" as Position,potential:84,club:"União Paulista",level:"Sub-15" as const},{name:"Rafael Costa",age:18,position:"GK" as Position,potential:82,club:"Atlético do Litoral",level:"Sub-20" as const},{name:"Mateus Oliveira",age:17,position:"LW" as Position,potential:86,club:"Atlético Aurora",level:"Sub-17" as const}];
