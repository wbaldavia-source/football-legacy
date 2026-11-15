import type {Club,Position} from "@/engine/types";
export const positions:{value:Position;label:string}[]=[{value:"GK",label:"Goleiro"},{value:"CB",label:"Zagueiro"},{value:"LB",label:"Lateral esquerdo"},{value:"RB",label:"Lateral direito"},{value:"DM",label:"Volante"},{value:"CM",label:"Meio-campista"},{value:"AM",label:"Meia-atacante"},{value:"LW",label:"Ponta esquerda"},{value:"RW",label:"Ponta direita"},{value:"ST",label:"Centroavante"}];
// Participantes da Série A 2026 conforme lista oficial da CBF.
// Orçamentos e capacidades são parâmetros de jogo estimados, não demonstrações financeiras oficiais.
const raw=[
["athletico","Athletico Paranaense","Brasil","Série A",90000000,"Ligga Arena",42372],
["atletico-mg","Atlético Mineiro","Brasil","Série A",130000000,"Arena MRV",46000],
["bahia","Bahia","Brasil","Série A",90000000,"Arena Fonte Nova",48000],
["botafogo","Botafogo","Brasil","Série A",105000000,"Nilton Santos",44000],
["chapecoense","Chapecoense","Brasil","Série A",35000000,"Arena Condá",20000],
["corinthians","Corinthians","Brasil","Série A",115000000,"Neo Química Arena",49205],
["coritiba","Coritiba","Brasil","Série A",45000000,"Couto Pereira",40000],
["cruzeiro","Cruzeiro","Brasil","Série A",100000000,"Mineirão",61846],
["flamengo","Flamengo","Brasil","Série A",220000000,"Maracanã",78838],
["fluminense","Fluminense","Brasil","Série A",95000000,"Maracanã",78838],
["gremio","Grêmio","Brasil","Série A",105000000,"Arena do Grêmio",55000],
["internacional","Internacional","Brasil","Série A",110000000,"Beira-Rio",50128],
["mirassol","Mirassol","Brasil","Série A",30000000,"José Maria de Campos Maia",15000],
["palmeiras","Palmeiras","Brasil","Série A",190000000,"Allianz Parque",43713],
["rb-bragantino","Red Bull Bragantino","Brasil","Série A",80000000,"Nabi Abi Chedid",17000],
["remo","Remo","Brasil","Série A",30000000,"Baenão",15000],
["santos","Santos FC","Brasil","Série A",85000000,"Vila Belmiro",20000],
["sao-paulo","São Paulo","Brasil","Série A",125000000,"MorumBIS",66000],
["vasco","Vasco da Gama","Brasil","Série A",78000000,"São Januário",22000],
["vitoria","Vitória","Brasil","Série A",40000000,"Barradão",30000],
["real","Real Madrid","Espanha","LaLiga",420000000,"Santiago Bernabéu",81044],
["barcelona","Barcelona","Espanha","LaLiga",390000000,"Spotify Camp Nou",99000],
["city","Manchester City","Inglaterra","Premier League",410000000,"Etihad Stadium",53400],
["liverpool","Liverpool","Inglaterra","Premier League",350000000,"Anfield",61276],
["united","Manchester United","Inglaterra","Premier League",330000000,"Old Trafford",74310],
["arsenal","Arsenal","Inglaterra","Premier League",320000000,"Emirates Stadium",60704],
["psg","Paris Saint-Germain","França","Ligue 1",300000000,"Parc des Princes",47929],
["bayern","Bayern de Munique","Alemanha","Bundesliga",360000000,"Allianz Arena",75000],
["juve","Juventus","Itália","Serie A",250000000,"Allianz Stadium",41507],
["benfica","Benfica","Portugal","Primeira Liga",150000000,"Estádio da Luz",64642],
["porto","Porto","Portugal","Primeira Liga",140000000,"Estádio do Dragão",50033]
];
export const clubs:Club[]=raw.map(x=>({id:String(x[0]),name:String(x[1]),country:String(x[2]),league:String(x[3]),budget:Number(x[4]),stadium:String(x[5]),capacity:Number(x[6]),fans:1000000}));
export const prospects=[
{name:"João Pedro",age:16,position:"ST" as Position,potential:88,club:"Flamengo",level:"Sub-17" as const},
{name:"Lucas Martins",age:15,position:"CM" as Position,potential:84,club:"Palmeiras",level:"Sub-15" as const},
{name:"Rafael Costa",age:18,position:"GK" as Position,potential:82,club:"Santos",level:"Sub-20" as const},
{name:"Matheus Oliveira",age:17,position:"LW" as Position,potential:86,club:"São Paulo",level:"Sub-17" as const}
];
