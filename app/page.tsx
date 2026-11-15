"use client";
import {useEffect,useMemo,useState} from "react";
import {clubs,positions,prospects,clubSquads,footballDataStatus} from "@/data/catalog";
import {FORMATIONS} from "@/engine/tactics";
import {NATIONAL_TEAMS} from "@/data/national-teams";
import type {CareerMode,Position} from "@/engine/types";
import {createDoubleRoundRobin,simulateFixture,type Fixture} from "@/engine/competition";
import {simulateDetailedMatch,defaultMatchPlan,type MatchAthlete} from "@/engine/match-engine";
import {developPlayer,scoutYouth,promoteYouth,runMatchday,postFinance,type PlayerAttributes,type TrainingPlan,type YouthPlayer,type ClubFinance,type Stadium} from "@/engine/career-systems";
type Stats={apps:number;wins:number;draws:number;losses:number;goals:number;assists:number;minutes:number;yellow:number;red:number;rating:number;points:number;titles:number;transfersIn:number;transfersOut:number;spent:number;earned:number;revenue:number;expenses:number;cleanliness:number;attendance:number};
type Row={club:string;pts:number;pj:number;v:number;e:number;d:number;gp:number;gc:number};
type Save={mode:CareerMode;name:string;age:number;position:Position;club:string;season:number;round:number;overall:number;morale:number;balance:number;stats:Stats;table:Row[];fixtures:Fixture[];history:string[];last:string;salary:number;ticket:number;stadiumLevel:number;formationId:string;attributes?:PlayerAttributes;trainingLoad?:number;injuryDays?:number;contractYears?:number;youthPlayers?:YouthPlayer[];clubFinance?:ClubFinance;stadium?:Stadium;academyCategory?:string;signedPlayers?:{id:string;name:string;age:number;position:string;origin:string;fee:number;wage:number}[];transferOffers?:{id:string;club:string;salary:number;years:number}[]};
// Cadastro-base da temporada jogável 2026. Dados históricos da API não podem misturar temporadas nem alterar os participantes desta liga.
const br=clubs.filter(c=>c.country==="Brasil"&&c.league==="Série A"&&!c.id.startsWith("api-"));
const category=(age:number)=>age>=20?"Profissional":age>=18?"Sub-20":age>=16?"Sub-17":"Sub-15";
const blank=():Stats=>({apps:0,wins:0,draws:0,losses:0,goals:0,assists:0,minutes:0,yellow:0,red:0,rating:0,points:0,titles:0,transfersIn:0,transfersOut:0,spent:0,earned:0,revenue:0,expenses:0,cleanliness:85,attendance:0});
const table0=():Row[]=>br.map(c=>({club:c.name,pts:0,pj:0,v:0,e:0,d:0,gp:0,gc:0}));
const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const pos=(p:Position)=>positions.find(x=>x.value===p)?.label||p;
const marketPlayers=Object.entries(clubSquads).flatMap(([teamId,roster])=>{const origin=clubs.find(c=>c.id==="api-"+teamId);return roster.map(player=>({...player,clubId:"api-"+teamId,clubName:origin?.name||"Clube não identificado",country:origin?.country||"?"}));});
const labels:Record<CareerMode,string>={player:"Jogador",manager:"Treinador",director:"Dirigente"};
const initialClub=br.find(c=>c.name==="São Paulo")?.name||br[0].name;
const players=["André Silva","Bruno Costa","Caio Santos","Daniel Lima","Eduardo Rocha","Felipe Alves","Gabriel Souza","Heitor Martins","Igor Carvalho","João Pedro","Kaique Oliveira","Leonardo Ferreira","Marcos Vinícius","Nicolas Ribeiro","Otávio Mendes","Pedro Henrique","Rafael Gomes","Samuel Barbosa","Thiago Nunes","Vitor Hugo","Yuri Almeida"];
export default function Home(){
const [mode,setMode]=useState<CareerMode>("player"),[name,setName]=useState("Alex Silva"),[age,setAge]=useState("18"),[position,setPosition]=useState<Position>("ST"),[club,setClub]=useState(initialClub),[game,setGame]=useState<Save|null>(null),[tab,setTab]=useState("Painel"),[notice,setNotice]=useState("Escolha a modalidade e clique no escudo/nome do clube para selecioná-lo.");
useEffect(()=>{try{const s=localStorage.getItem("fl-save-v4");if(s)setGame(JSON.parse(s));}catch{}},[]);
useEffect(()=>{if(game)localStorage.setItem("fl-save-v4",JSON.stringify(game));},[game]);
const current=clubs.find(c=>c.name===game?.club)||br[0];
const sorted=useMemo(()=>[...(game?.table||[])].sort((a,b)=>b.pts-a.pts||(b.gp-b.gc)-(a.gp-a.gc)),[game?.table]);
const avg=game?.stats.apps?(game.stats.rating/game.stats.apps).toFixed(2):"—";
const apiSquad=clubSquads[String(current.id).replace(/^api-/,"")]||[];
const squad=apiSquad.length?apiSquad.map((p,i)=>({n:p.name,p:(["Goleiro","Goalkeeper"].includes(p.position)?"GK":/Defen|Back/i.test(p.position)?"CB":/Mid/i.test(p.position)?"CM":/Att|Forw/i.test(p.position)?"ST":"CM") as Position,ov:0,age:p.age,number:p.number,real:true})):players.map((n,i)=>({n,p:((["GK","CB","CB","LB","RB","DM","CM","CM","AM","LW","RW","ST","ST"] as Position[])[i%13]),ov:59+(i*7+current.name.length*3)%30,age:18+(i*5)%15,number:i+1,real:false}));
function train(plan:TrainingPlan){if(!game||game.mode!=="player")return;const base=game.attributes||{pace:game.overall+5,shooting:game.overall+4,passing:game.overall,dribbling:game.overall+2,defending:game.overall-8,physical:game.overall+3,goalkeeping:game.overall-20};const result=developPlayer({overall:game.overall,potential:88,age:game.age,morale:game.morale,attributes:base,trainingLoad:game.trainingLoad||0,injuryDays:game.injuryDays||0},game.position,plan);setGame({...game,overall:result.player.overall,morale:result.player.morale,attributes:result.player.attributes,trainingLoad:result.player.trainingLoad,injuryDays:result.player.injuryDays,history:["Treino "+plan+" · "+result.message,...game.history]});setNotice(result.message);}
function scoutAcademy(){if(!game||game.mode!=="director")return;const n=(game.youthPlayers||[]).length+1;const age=15+Math.floor(Math.random()*6);const p=scoutYouth("academy-"+game.season+"-"+n,players[Math.floor(Math.random()*players.length)]+" "+n,age,positions[Math.floor(Math.random()*positions.length)].value,2);setGame({...game,youthPlayers:[...(game.youthPlayers||[]),p],balance:game.balance-35000,stats:{...game.stats,expenses:game.stats.expenses+35000},history:["Olheiro captou "+p.name+" · "+p.level+" · potencial "+p.potential,...game.history]});setNotice("Novo atleta captado para a base. Custo de observação: R$ 35.000.");}
function promoteAcademy(id:string){if(!game)return;const list=game.youthPlayers||[];const p=list.find(x=>x.id===id);if(!p)return;if(p.age<15){setNotice("Atleta abaixo da idade mínima da carreira.");return;}if(p.overall<55){setNotice("A comissão técnica ainda não recomendou a promoção: avaliação técnica abaixo do mínimo.");return;}const target=p.age>=20?"senior":p.age>=18?"U20":p.age>=16?"U17":"U15";if(target===p.level){setNotice("O atleta ainda não atingiu a idade/avaliação para avançar de categoria.");return;}const promoted={...p,level:target as YouthPlayer["level"],contracted:p.age>=16};setGame({...game,youthPlayers:list.map(x=>x.id===id?promoted:x),history:[promoted.name+" integrado à categoria "+promoted.level,...game.history]});setNotice(promoted.name+" integrado à categoria "+promoted.level+".");}
function renewContract(){if(!game)return;const proposed=Math.round(game.salary*1.18);if(game.morale<35){setNotice("O atleta está insatisfeito e recusou a renovação.");return;}setGame({...game,salary:proposed,contractYears:3,history:["Contrato renovado por 3 temporadas · salário "+money(proposed),...game.history]});setNotice("Renovação concluída. Novo salário: "+money(proposed)+".");}
function start(){
 const selectedAge=Number.parseInt(age,10);
 if(mode==="player"&&(!Number.isInteger(selectedAge)||selectedAge<15||selectedAge>40)){
  setNotice("Informe uma idade válida entre 15 e 40 anos para iniciar a carreira de atleta.");return;
 }
 if(!br.length||br.length%2!==0){
  setNotice("Cadastro da Série A 2026 incompleto. A carreira não foi criada.");return;
 }
 const c=br.find(x=>x.name===club)||br[0];
 try{
  const league=br.map(x=>({id:x.id,name:x.name,strength:65+(x.budget/10000000)}));
  const fixtures=createDoubleRoundRobin(league,"br-serie-a",2026);
  if(fixtures.length!==br.length*(br.length-1)||fixtures.length===0)throw new Error("Calendário inválido.");
  const ageValue=mode==="player"?selectedAge:(Number.isInteger(selectedAge)&&selectedAge>=18?selectedAge:30);
  const newGame:Save={mode,name:name.trim()||labels[mode],age:ageValue,position,club:c.name,season:2026,round:0,
   overall:mode==="player"?62:mode==="manager"?58:55,morale:72,balance:mode==="director"?c.budget:0,
   stats:blank(),table:table0(),fixtures,history:["2026 · Carreira iniciada como "+labels[mode]+" no "+c.name],
   last:"Nenhuma partida disputada",salary:mode==="player"?(ageValue>=16?1800:0):mode==="manager"?18000:30000,
   contractYears:mode==="player"?(ageValue>=16?2:0):3,ticket:65,stadiumLevel:1,formationId:"4-2-3-1",
   academyCategory:mode==="player"?category(ageValue):undefined,
   clubFinance:mode==="director"?{cash:c.budget,debt:0,weeklyWageBill:Math.round(c.budget*0.0018),transferBudget:Math.round(c.budget*0.22),reputation:60,boardConfidence:65}:undefined,
   stadium:mode==="director"?{capacity:c.capacity,ticketPrice:65,maintenance:300000,cleanliness:85,security:75,accessibility:65,pitchQuality:80}:undefined};
  setClub(c.name);setGame(newGame);setTab("Painel");
  setNotice("Carreira iniciada: "+fixtures.length+" partidas geradas para a Série A 2026.");
 }catch(error){console.error("Falha ao iniciar carreira:",error);setNotice("Falha ao iniciar: "+(error instanceof Error?error.message:"erro inesperado")+". Nenhum save foi criado.");}
}
function simulate(){
 if(!game)return;
 if(game.round>=38){setNotice("Temporada concluída. Encerre a temporada para iniciar a próxima.");return;}
 const rows=game.table.map(r=>({...r}));
 const pending=game.fixtures.filter(f=>f.round===game.round+1&&f.status==="scheduled");
 const playedFixtures=pending.map(f=>{
  const h=clubs.find(c=>c.id===f.homeId),a=clubs.find(c=>c.id===f.awayId);
  if(!h||!a)return f;
  const chosen=FORMATIONS.find(x=>x.id===game.formationId);
  const attackers=chosen?chosen.slots.filter(p=>["ST","LW","RW","AM"].includes(p)).length:3;
  const midfielders=chosen?chosen.slots.filter(p=>["DM","CM","AM","LM","RM"].includes(p)).length:3;
  const defenders=chosen?chosen.slots.filter(p=>["CB","LB","RB","LWB","RWB"].includes(p)).length:4;
  const tacticalBonus=game.mode==="manager"&&chosen?Math.max(-2.5,Math.min(2.5,(attackers-3)*1.1+(midfielders-3)*.35+(defenders-4)*.25)):0;
  const base=simulateFixture(f,
   {id:h.id,name:h.name,strength:65+h.budget/10000000+(h.name===game.club?tacticalBonus:0)},
   {id:a.id,name:a.name,strength:65+a.budget/10000000+(a.name===game.club?tacticalBonus:0)});
  if(h.name!==game.club&&a.name!==game.club)return base;
  const ownRoster:MatchAthlete[]=squad.map((p,i)=>({id:"roster-"+i,name:p.n,position:p.p,overall:p.ov||60,fitness:100-(game.trainingLoad||0)*.25,morale:game.morale,age:p.age}));
  if(game.mode==="player")ownRoster.unshift({id:"career-player",name:game.name,position:game.position,overall:game.overall,fitness:100-(game.trainingLoad||0)*.3,morale:game.morale,age:game.age,starter:true});
  const otherRoster:MatchAthlete[]=players.slice(0,18).map((n,i)=>({id:"opponent-"+i,name:n,position:(["GK","CB","CB","LB","RB","DM","CM","CM","AM","LW","RW","ST","ST","CB","CM","ST","LB","RB"] as Position[])[i],overall:58+(i*7)%24,fitness:85,morale:70,age:19+(i%13)}));
  const plan=defaultMatchPlan(game.formationId||"4-2-3-1");
  const report=simulateDetailedMatch({seed:f.seed,homeName:h.name,awayName:a.name,homeStrength:65+h.budget/10000000,awayStrength:65+a.budget/10000000,homeRoster:f.homeId===clubs.find(c=>c.name===game.club)?.id?ownRoster:otherRoster,awayRoster:f.awayId===clubs.find(c=>c.name===game.club)?.id?ownRoster:otherRoster,homePlan:plan,awayPlan:defaultMatchPlan()});
  return {...base,homeGoals:report.homeGoals,awayGoals:report.awayGoals,matchReport:report} as Fixture;
 });
 let myGF=0,myGA=0;
 for(const f of playedFixtures){
  const home=rows.find(r=>r.club===clubs.find(c=>c.id===f.homeId)?.name);
  const away=rows.find(r=>r.club===clubs.find(c=>c.id===f.awayId)?.name);
  if(!home||!away||f.homeGoals===undefined||f.awayGoals===undefined)continue;
  const hg=f.homeGoals,ag=f.awayGoals;
  for(const [r,g,o] of [[home,hg,ag],[away,ag,hg]] as [Row,number,number][]){
   r.pj++;r.gp+=g;r.gc+=o;if(g>o){r.v++;r.pts+=3}else if(g===o){r.e++;r.pts++}else r.d++;
  }
  if(f.homeId===clubs.find(c=>c.name===game.club)?.id){myGF=hg;myGA=ag;}
  else if(f.awayId===clubs.find(c=>c.name===game.club)?.id){myGF=ag;myGA=hg;}
 }
 const nextRound=game.round+1;
 const won=myGF>myGA,draw=myGF===myGA;
 const youthCareer=game.mode==="player"&&game.age<20;
 const playerWin=youthCareer?Math.random()<.45:won;
 const playerDraw=youthCareer?Math.random()<.27:draw;
 const careerWon=game.mode==="player"?playerWin:won;
 const careerDraw=game.mode==="player"?playerDraw:draw;
 const report=(playedFixtures.find(f=>f.homeId===clubs.find(c=>c.name===game.club)?.id||f.awayId===clubs.find(c=>c.name===game.club)?.id) as (Fixture&{matchReport?:{homePlayers: {playerId:string;rating:number;goals:number;assists:number;minutes:number;yellowCards:number;redCards:number;injuryDays:number}[];awayPlayers:{playerId:string;rating:number;goals:number;assists:number;minutes:number;yellowCards:number;redCards:number;injuryDays:number}[]}})|undefined)?.matchReport;
 const careerLine=report?[...report.homePlayers,...report.awayPlayers].find(p=>p.playerId==="career-player"):undefined;
 const performance=careerLine?.rating??(6+Math.random()*3.4);
 const scored=game.mode==="player"?(careerLine?.goals??0):0;
 const assisted=game.mode==="player"?(careerLine?.assists??0):0;
 const st={...game.stats,apps:game.stats.apps+(game.mode==="player"?(careerLine?1:0):1),
  wins:game.stats.wins+(careerWon?1:0),draws:game.stats.draws+(careerDraw?1:0),
  losses:game.stats.losses+(!careerWon&&!careerDraw?1:0),goals:game.stats.goals+scored,
  assists:game.stats.assists+assisted,minutes:game.stats.minutes+(game.mode==="player"?(careerLine?.minutes??0):90),
  yellow:game.stats.yellow+(game.mode==="player"?(careerLine?.yellowCards??0):(Math.random()<.13?1:0)),red:game.stats.red+(game.mode==="player"?(careerLine?.redCards??0):(Math.random()<.015?1:0)),
  rating:game.stats.rating+performance,points:game.stats.points+(careerWon?3:careerDraw?1:0),
  attendance:game.stats.attendance};
 let income=0,expense=0,matchAttendance=0,nextFinance=game.clubFinance,nextStadium=game.stadium;
 if(game.mode==="director"&&game.clubFinance&&game.stadium){
  const day=runMatchday({...game.stadium,ticketPrice:game.ticket},game.stadium.capacity*.68);
  const sponsor=Math.round(current.budget/52*.12);
  income=day.revenue+sponsor;expense=day.cost+game.clubFinance.weeklyWageBill;matchAttendance=day.attendance;
  nextFinance=postFinance(game.clubFinance,{id:"gate-"+game.season+"-"+nextRound,season:game.season,category:"ticketing",amount:day.revenue,description:"Bilheteria da rodada"});
  nextFinance=postFinance(nextFinance,{id:"sponsor-"+game.season+"-"+nextRound,season:game.season,category:"sponsor",amount:sponsor,description:"Receita comercial proporcional"});
  nextFinance=postFinance(nextFinance,{id:"cost-"+game.season+"-"+nextRound,season:game.season,category:"other",amount:-expense,description:"Folha semanal e operação do estádio"});
  nextStadium=day.next;
 }
 st.revenue+=income;st.expenses+=expense;
 if(game.mode==="director")st.attendance+=matchAttendance;
 const last=youthCareer
  ?game.name+" · "+(game.academyCategory||category(game.age))+" · "+(careerWon?"Vitória":careerDraw?"Empate":"Derrota")
  :game.club+" "+myGF+" x "+myGA+" · "+(won?"Vitória":draw?"Empate":"Derrota");
 const development=game.mode==="player"?developPlayer({
  overall:game.overall,potential:88,age:game.age,morale:game.morale,
  attributes:game.attributes||{pace:game.overall+5,shooting:game.overall+4,passing:game.overall,dribbling:game.overall+2,defending:game.overall-8,physical:game.overall+3,goalkeeping:game.overall-20},
  trainingLoad:game.trainingLoad||0,injuryDays:game.injuryDays||0
 },game.position,"balanced").player:null;
 const nextBalance=game.mode==="director"?(nextFinance?.cash??game.balance):game.balance+(game.mode==="player"||game.mode==="manager"?game.salary:0);
 setGame({...game,round:nextRound,fixtures:game.fixtures.map(f=>playedFixtures.find(x=>x.id===f.id)||f),
  table:rows,stats:st,last,balance:nextBalance,clubFinance:nextFinance,stadium:nextStadium,
  youthPlayers:(game.youthPlayers||[]).map(y=>({...y,overall:Math.min(y.potential,y.overall+(y.overall<y.potential&&Math.random()<.1?1:0)),morale:Math.max(20,Math.min(100,y.morale+(Math.random()<.5?1:-1)))})),
  overall:development?.overall??game.overall,attributes:development?.attributes??game.attributes,
  trainingLoad:development?.trainingLoad??game.trainingLoad,injuryDays:development?.injuryDays??game.injuryDays,
  morale:Math.max(10,Math.min(100,game.morale+(careerWon?3:careerDraw?1:-3))),
  history:[game.season+" · Rodada "+nextRound+" · "+last,...game.history].slice(0,150)});
 setNotice(youthCareer?"Partida da categoria "+(game.academyCategory||category(game.age))+" concluída. Evolução acompanhada pela comissão técnica.":"Rodada "+nextRound+"/38 concluída. Foram disputadas "+playedFixtures.length+" partidas.");
}
function transfer(to:string){
 if(!game||game.mode==="director")return;
 if(game.mode==="player"&&game.age<16){setNotice("Aos 15 anos, a carreira permanece na formação. Mudanças de clube exigem processo de formação e responsáveis; não há transferência instantânea.");return;}
 const target=clubs.find(c=>c.name===to),origin=clubs.find(c=>c.name===game.club);
 if(!target||!origin)return;
 if(game.mode==="player"&&game.age<18&&target.country!==origin.country){setNotice("Transferência internacional de menor de 18 anos bloqueada, salvo exceções e autorização prévia da FIFA.");return;}
 const windowOpen=game.round===0||(game.round>=1&&game.round<=8)||(game.round>=20&&game.round<=26);
 if(!windowOpen){setNotice("Janela fechada. O pedido fica para a próxima janela de registro.");setGame({...game,history:["Interesse registrado em "+to+"; aguardando janela de registro.",...game.history]});return;}
 const offer={id:"offer-"+game.season+"-"+game.round+"-"+to.replace(/[^a-z0-9]/gi,""),club:to,salary:Math.round(Math.max(game.salary,1800)*1.12),years:2};
 setGame({...game,transferOffers:[...(game.transferOffers||[]).filter(x=>x.club!==to),offer],history:["Proposta formal simulada recebida de "+to+". Salário: "+money(offer.salary)+" · "+offer.years+" anos.",...game.history]});
 setNotice("Proposta recebida de "+to+". Analise os termos antes de aceitar.");
}
function decideOffer(id:string,accept:boolean){
 if(!game)return;
 const offer=(game.transferOffers||[]).find(x=>x.id===id);if(!offer)return;
 if(accept){setGame({...game,club:offer.club,salary:offer.salary,contractYears:offer.years,stats:{...game.stats,transfersIn:game.stats.transfersIn+1,transfersOut:game.stats.transfersOut+1},transferOffers:(game.transferOffers||[]).filter(x=>x.id!==id),history:["Transferência concluída para "+offer.club+" · contrato de "+offer.years+" anos.",...game.history]});setNotice("Contrato aceito. Você agora representa "+offer.club+".");}
 else{setGame({...game,transferOffers:(game.transferOffers||[]).filter(x=>x.id!==id),history:["Proposta de "+offer.club+" recusada.",...game.history]});setNotice("Proposta recusada.");}
}
function signPlayer(playerId:string){
 if(!game||game.mode!=="director"||!game.clubFinance)return;
 const player=marketPlayers.find(p=>p.id===playerId);if(!player)return;
 if(player.clubName===game.club){setNotice("O atleta já pertence ao seu clube.");return;}
 const origin=clubs.find(c=>c.name===player.clubName),destination=clubs.find(c=>c.name===game.club);
 if(player.age<18&&origin&&destination&&origin.country!==destination.country){setNotice("Contratação internacional de menor bloqueada: exige exceção e autorização prévia da FIFA.");return;}
 const fee=player.age<21?8000000:player.age<27?18000000:player.age<31?10000000:3500000;
 const wage=player.age<21?35000:player.age<27?75000:50000;
 if(game.round!==0&&!(game.round>=1&&game.round<=8)&&!(game.round>=20&&game.round<=26)){setNotice("Janela de registro fechada. Aguarde a próxima janela.");return;}
 if(game.clubFinance.transferBudget<fee||game.clubFinance.cash<fee){setNotice("Orçamento de transferências ou caixa insuficiente para esta contratação.");return;}
 const finance=postFinance(game.clubFinance,{id:"transfer-"+player.id+"-"+game.season,season:game.season,category:"transfer",amount:-fee,description:"Contratação de "+player.name});
 finance.weeklyWageBill+=wage;
 setGame({...game,clubFinance:finance,balance:finance.cash,signedPlayers:[...(game.signedPlayers||[]),{id:player.id,name:player.name,age:player.age,position:player.position,origin:player.clubName,fee,wage}],stats:{...game.stats,transfersIn:game.stats.transfersIn+1,spent:game.stats.spent+fee},history:["Contratado "+player.name+" de "+player.clubName+" · taxa estimada "+money(fee)+" · salário semanal "+money(wage),...game.history]});
 setNotice("Contratação registrada. Taxa e folha salarial atualizadas. Valores estimados de jogo, não cotação oficial.");
}
function nextSeason(){if(!game)return;if(game.round<38){setNotice("Ainda existem rodadas pendentes. Conclua as 38 rodadas antes de avançar.");return;}const champion=sorted[0]?.club===game.club;const st={...game.stats,titles:game.stats.titles+(champion?1:0)};const fixtures=createDoubleRoundRobin(br.map(x=>({id:x.id,name:x.name,strength:65+(x.budget/10000000)})),"br-serie-a",game.season+1);setGame({...game,season:game.season+1,round:0,table:table0(),fixtures,stats:st,age:game.mode==="player"?game.age+1:game.age,academyCategory:game.mode==="player"?category(game.age+1):game.academyCategory,
salary:game.mode==="player"&&game.age===15?1800:game.salary,contractYears:game.mode==="player"&&game.age===15?2:game.contractYears,
youthPlayers:(game.youthPlayers||[]).map(y=>{const nextAge=y.age+1;const nextLevel=nextAge>=20?"senior":nextAge>=18?"U20":nextAge>=16?"U17":"U15";return {...y,age:nextAge,level:(nextAge>=(y.level==="U15"?16:y.level==="U17"?18:y.level==="U20"?20:99)&&y.overall>=55?nextLevel:y.level) as YouthPlayer["level"]};}),
history:[(game.season+1)+" · Nova temporada iniciada"+(champion?" · Título conquistado!":"")+(game.mode==="player"&&game.age===15?" · Primeiro contrato profissional oferecido pelo clube.":""),...game.history]});setTab("Painel");setNotice("Nova temporada criada com calendário de 38 rodadas.");}
const tabs=["Painel","Clubes","Seleções","Elenco","Calendário","Classificação","Estatísticas","Mercado","Base","Estádio/Finanças"];
return <main className="app"><header className="top"><div className="brand">FOOTBALL <span>LEGACY</span><small>WORLD CAREER · BUILD 0.4.0</small></div><div className="small">{game?labels[game.mode].toUpperCase()+" · "+game.season:"NOVA CARREIRA"}</div></header><div className="wrap"><section className="hero"><div><span className="eyebrow">SUA HISTÓRIA NO FUTEBOL</span><h1>VIVA O<br/><span style={{color:"#b9e36a"}}>LEGADO.</span></h1><p>Carreira com clubes selecionáveis, partidas simuladas e estatísticas persistentes.</p></div><span className="season">⚽ {game?game.club:"WORLD CAREER"}</span></section>
{!game?<><div className="modes">{(["player","manager","director"] as CareerMode[]).map(m=><button key={m} onClick={()=>setMode(m)} className={"mode "+(mode===m?"active":"")}><b>{labels[m].toUpperCase()}</b><small>{m==="player"?"Atue em campo e acompanhe seu desempenho.":m==="manager"?"Comande partidas, campanha e elenco.":"Gerencie contratações, caixa e operação."}</small></button>)}</div><form className="panel" onSubmit={(e)=>{e.preventDefault();start();}}><div className="notice" role="status" aria-live="polite">{notice}</div><h3>1. Configure seu perfil</h3><div className="fields"><div className="field"><label>Nome</label><input value={name} onChange={e=>setName(e.target.value)}/></div><div className="field"><label>Idade</label><input type="number" min={mode==="player"?15:18} max={mode==="player"?40:70} step="1" value={age} onChange={e=>setAge(e.target.value)} onBlur={()=>{if(mode==="player"&&(!Number.isInteger(Number(age))||Number(age)<15))setAge("15");}}/></div>{mode==="player"&&<div className="field"><label>Posição em campo</label><select value={position} onChange={e=>setPosition(e.target.value as Position)}>{positions.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}</select></div>}</div><button className="btn" style={{marginTop:14}} type="submit">INICIAR CARREIRA COMO {labels[mode].toUpperCase()} →</button><h3 style={{marginTop:24}}>2. Escolha seu clube · selecionado: <span style={{color:"#b9e36a"}}>{club}</span></h3><p className="muted">Toque em um clube abaixo. O cartão selecionado ficará destacado.</p><div className="club-picker">{br.map(c=><button type="button" key={c.id} onClick={()=>setClub(c.name)} className={"club-choice "+(club===c.name?"chosen":"")}><b>{c.name}</b><small>{c.league} · {c.stadium}</small><small>Orçamento simulado: {money(c.budget)}</small>{club===c.name&&<span className="tag">✓ SELECIONADO</span>}</button>)}</div><button className="btn" style={{marginTop:20}} onClick={start}>INICIAR CARREIRA COMO {labels[mode].toUpperCase()} →</button></form></>:<><nav className="tabs">{tabs.map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t}</button>)}</nav>
{tab==="Painel"&&<><div className="metrics"><Metric label="OVERALL" value={String(game.overall)}/><Metric label="TEMPORADA" value={String(game.season)}/><Metric label="RODADA" value={game.round+"/38"}/><Metric label="MORAL" value={game.morale+"%"}/></div><section className="panel"><h3>{game.name} · {labels[game.mode]}</h3><p>{game.age} anos · {game.club}{game.mode==="player"?" · "+pos(game.position)+" · "+(game.academyCategory||category(game.age)):""}</p><div className="actions"><button className="btn" onClick={simulate}>SIMULAR PRÓXIMA RODADA ⚽</button><button className="btn secondary" onClick={nextSeason} disabled={game.round!==38}>ENCERRAR TEMPORADA</button></div>{game.mode==="player"&&<><h4>Departamento de futebol e desenvolvimento</h4><p className="muted">O plano semanal é definido pela comissão técnica. A evolução ocorre automaticamente ao longo da temporada, conforme idade, carga, desempenho, potencial e lesões. Você não edita atributos nem define o próprio salário.</p><p>Overall {game.overall} · carga física {game.trainingLoad||0}% · {game.injuryDays?("lesão: "+game.injuryDays+" dias"):"apto"} · contrato: {game.contractYears||0} temporada(s) · remuneração {game.salary?money(game.salary):"sem contrato profissional"}</p></>}</section><section className="panel"><h3>Resumo da carreira · {game.season}</h3><div className="metrics"><Metric label="JOGOS" value={String(game.stats.apps)}/><Metric label="VITÓRIAS" value={String(game.stats.wins)}/><Metric label="EMPATES" value={String(game.stats.draws)}/><Metric label="DERROTAS" value={String(game.stats.losses)}/></div><p className="muted">Último resultado: {game.last}</p></section></>}
{tab==="Clubes"&&<section className="panel"><h3>Clubes disponíveis</h3><p className="muted">Nomes de clubes reais; dados financeiros, elenco e resultados são simulações, não dados oficiais.</p>{clubs.map(c=><div className="row" key={c.id}><b>{c.name} · {c.country} · {c.league}</b><span className="tag">{money(c.budget)}</span></div>)}</section>}
{tab==="Elenco"&&<section className="panel"><h3>Elenco de {game.club}</h3>{game.mode==="manager"&&<><label>Formação tática</label><select value={game.formationId||"4-2-3-1"} onChange={e=>setGame({...game,formationId:e.target.value,history:["Formação alterada para "+e.target.value,...game.history]})}>{FORMATIONS.map(f=><option key={f.id} value={f.id}>{f.name} — {f.description}</option>)}</select><p className="muted">A formação escolhida fica salva e altera a força tática simulada da equipe. Escalação individual, instruções por setor e substituições ainda serão integradas.</p></>}<p className="muted">{apiSquad.length? "Elenco importado da API-Football. Idades e posições conforme cobertura da fonte; atributos técnicos não são fornecidos pela API.":"Elenco demonstrativo fictício: a sincronização de elencos ainda não foi executada ou esta equipe não tem cobertura."}</p>{squad.map((p,i)=><div className="row" key={p.n}><b>#{p.number||i+1} {p.n} · {pos(p.p)} · {p.age} anos</b><span className="tag">{p.real?"DADO REAL":"FICTÍCIO"}</span></div>)}{(game.youthPlayers||[]).filter(y=>y.level==="senior").map(y=><div className="row" key={y.id}><b>{y.name} · {pos(y.position)} · {y.age} anos</b><span className="tag">PROMOVIDO DA BASE · OVR {y.overall}</span></div>)}{(game.signedPlayers||[]).map(y=><div className="row" key={y.id}><b>{y.name} · {y.position} · {y.age} anos</b><span className="tag">CONTRATADO · {money(y.wage)}/semana</span></div>)}</section>}
{tab==="Seleções"&&<section className="panel"><h3>Seleções nacionais</h3><p className="muted">Catálogo inicial por confederação. Convocações e calendários internacionais ainda não estão integrados.</p>{(["CONMEBOL","CONCACAF","UEFA","AFC","CAF","OFC"] as const).map(conf=><div key={conf}><h4>{conf}</h4>{NATIONAL_TEAMS.filter(t=>t.confederation===conf).map(t=><div className="row" key={t.id}><b>{t.name}</b><span className="tag">{t.fifaCode}</span></div>)}</div>)}</section>}
{tab==="Calendário"&&<section className="panel"><h3>Temporada {game.season} · Série A simulada</h3><p className="muted">Fonte dos dados reais: {footballDataStatus.isLive?"API-Football · temporada-base "+footballDataStatus.season+" · sincronizado em "+new Date(footballDataStatus.updatedAt!).toLocaleString("pt-BR"):"API-Football não sincronizada"} · {footballDataStatus.clubs} clubes · {footballDataStatus.squads} elencos importados.</p><p>{game.round}/38 rodadas simuladas</p>{Array.from({length:38},(_,i)=><div className="row" key={i}>Rodada {i+1}<span className="tag">{i<game.round?"CONCLUÍDA":i===game.round?"PRÓXIMA":"AGENDADA"}</span><small>{game.fixtures.filter(f=>f.round===i+1).length} partidas</small></div>)}<button className="btn" onClick={simulate}>Simular próxima rodada</button></section>}
{tab==="Classificação"&&<section className="panel"><h3>Classificação · Série A</h3>{sorted.map((r,i)=><div className="row" key={r.club}><b>{i+1}. {r.club}</b><span>{r.pts} pts · {r.pj} J · {r.v} V · {r.e} E · {r.d} D · SG {r.gp-r.gc}</span></div>)}</section>}
{tab==="Estatísticas"&&<><section className="panel"><h3>{labels[game.mode]} · Estatísticas da carreira</h3>{game.mode==="player"?<div className="metrics"><Metric label="JOGOS" value={String(game.stats.apps)}/><Metric label="GOLS" value={String(game.stats.goals)}/><Metric label="ASSISTÊNCIAS" value={String(game.stats.assists)}/><Metric label="MINUTOS" value={String(game.stats.minutes)}/><Metric label="AMARELOS" value={String(game.stats.yellow)}/><Metric label="VERMELHOS" value={String(game.stats.red)}/><Metric label="NOTA MÉDIA" value={avg}/><Metric label="TÍTULOS" value={String(game.stats.titles)}/></div>:game.mode==="manager"?<div className="metrics"><Metric label="PARTIDAS" value={String(game.stats.apps)}/><Metric label="VITÓRIAS" value={String(game.stats.wins)}/><Metric label="EMPATES" value={String(game.stats.draws)}/><Metric label="DERROTAS" value={String(game.stats.losses)}/><Metric label="PONTOS" value={String(game.stats.points)}/><Metric label="APROVEITAMENTO" value={game.stats.apps?Math.round(game.stats.points/(game.stats.apps*3)*100)+"%":"—"}/><Metric label="TÍTULOS" value={String(game.stats.titles)}/><Metric label="MORAL" value={game.morale+"%"}/></div>:<div className="metrics"><Metric label="JOGOS DO CLUBE" value={String(game.stats.apps)}/><Metric label="CONTRATAÇÕES" value={String(game.stats.transfersIn)}/><Metric label="GASTO EM TRANSFERÊNCIAS" value={money(game.stats.spent)}/><Metric label="RECEITA OPERACIONAL" value={money(game.stats.revenue)}/><Metric label="DESPESAS" value={money(game.stats.expenses)}/><Metric label="SALDO OPERACIONAL" value={money(game.stats.revenue-game.stats.expenses)}/><Metric label="PÚBLICO ACUMULADO" value={game.stats.attendance.toLocaleString("pt-BR")}/><Metric label="LIMPEZA DO ESTÁDIO" value={game.stats.cleanliness+"%"}/></div>}</section><section className="panel"><h3>Diário de carreira</h3>{game.history.map((h,i)=><div className="row" key={i}>{h}</div>)}</section></>}
{tab==="Mercado"&&<section className="panel"><h3>Mercado · negociações e registros</h3>{game.mode==="director"?<><p className="muted">Jogadores importados da API-Football quando a sincronização está disponível. Taxas e salários são estimativas do simulador, não valores oficiais. Janelas do jogo: pré-temporada e meio da temporada.</p>{marketPlayers.filter(p=>p.clubName!==game.club&&!(game.signedPlayers||[]).some(x=>x.id===p.id)).slice(0,40).map(p=><div className="row" key={p.id}><b>{p.name} · {p.position} · {p.age} anos · {p.clubName}</b><button className="btn secondary" onClick={()=>signPlayer(p.id)}>CONTRATAR · VALOR ESTIMADO</button></div>)}</>:<><p className="muted">Mudança de clube exige janela de registro e proposta contratual. Atletas menores de 18 anos não podem realizar transferência internacional fora das exceções autorizadas pela FIFA.</p>{(game.transferOffers||[]).map(o=><div className="row" key={o.id}><b>Proposta de {o.club} · {money(o.salary)} · {o.years} anos</b><button className="btn secondary" onClick={()=>decideOffer(o.id,true)}>ACEITAR</button><button className="btn secondary" onClick={()=>decideOffer(o.id,false)}>RECUSAR</button></div>)}{clubs.filter(c=>c.name!==game.club).map(c=><div className="row" key={c.id}><b>{c.name} · {c.country}</b><button className="btn secondary" onClick={()=>transfer(c.name)}>SOLICITAR PROPOSTA</button></div>)}</>}</section>}
{tab==="Base"&&<section className="panel"><h3>Categorias de base · Sub-15 / Sub-17 / Sub-20</h3><p className="muted">A base precisa formar jogadores para o profissional: Sub-15 (15 anos), Sub-17 (16–17), Sub-20 (18–19) e profissional a partir de 20 anos. Os nomes captados são fictícios até haver fonte de dados de base verificada.</p>{game.mode==="director"&&<button className="btn" disabled={game.balance<35000} onClick={scoutAcademy}>CAPTAR JOVEM COM OLHEIRO · R$ 35 MIL</button>}{prospects.map(p=><div className="row" key={p.name}><b>{p.name} · {p.club} · {p.level} · {p.age} anos</b><span className="tag">POTENCIAL {p.potential}</span></div>)}{(game.youthPlayers||[]).map(p=><div className="row" key={p.id}><b>{p.name} · {p.level} · {p.age} anos · OVR {p.overall}</b><span className="tag">POT. {p.potential}</span>{p.level!=="senior"&&<button className="btn secondary" onClick={()=>promoteAcademy(p.id)}>PROMOVER</button>}</div>)}</section>}
{tab==="Estádio/Finanças"&&<section className="panel"><h3>{current.stadium}</h3><div className="metrics"><Metric label="CAIXA" value={money(game.balance)}/>{game.clubFinance&&<><Metric label="DÍVIDA" value={money(game.clubFinance.debt)}/><Metric label="FOLHA SEMANAL" value={money(game.clubFinance.weeklyWageBill)}/><Metric label="ORÇAMENTO DE TRANSFERÊNCIAS" value={money(game.clubFinance.transferBudget)}/><Metric label="CONFIANÇA DA DIRETORIA" value={game.clubFinance.boardConfidence+"%"}/></>}<Metric label="CAPACIDADE" value={current.capacity.toLocaleString("pt-BR")}/><Metric label="PREÇO INGRESSO" value={money(game.ticket)}/><Metric label="NÍVEL ESTÁDIO" value={String(game.stadiumLevel)}/><Metric label="RECEITAS REGISTRADAS" value={money(game.stats.revenue)}/><Metric label="DESPESAS REGISTRADAS" value={money(game.stats.expenses)}/><Metric label="LIMPEZA" value={game.stats.cleanliness+"%"}/></div><p className="muted">No modo dirigente, as decisões de preço e manutenção alteram o caixa e as condições do estádio. Valores são parâmetros de simulação.</p>{game.mode==="director"&&<div className="actions"><button className="btn secondary" onClick={()=>setGame({...game,ticket:game.ticket+5,history:["Ingresso reajustado para "+money(game.ticket+5),...game.history]})}>Aumentar ingresso +R$ 5</button><button className="btn secondary" disabled={game.balance<25000} onClick={()=>setGame({...game,stats:{...game.stats,cleanliness:Math.min(100,game.stats.cleanliness+10),expenses:game.stats.expenses+25000},balance:game.balance-25000,history:["Limpeza reforçada · custo R$ 25.000",...game.history]})}>Reforçar limpeza · R$ 25 mil</button><button className="btn secondary" disabled={game.balance<180000} onClick={()=>setGame({...game,stadiumLevel:game.stadiumLevel+1,balance:game.balance-180000,stats:{...game.stats,expenses:game.stats.expenses+180000},history:["Segurança do estádio modernizada · R$ 180.000",...game.history]})}>Modernizar segurança · R$ 180 mil</button></div>}</section>}
<button className="btn secondary" style={{marginTop:18}} onClick={()=>{if(confirm("Apagar a carreira salva neste aparelho?")){localStorage.removeItem("fl-save-v4");setGame(null);}}}>APAGAR CARREIRA</button></>}
<div className="notice">{notice}</div><footer className="footer">FOOTBALL LEGACY · DADOS REAIS QUANDO SINCRONIZADOS; FINANÇAS DE JOGO ESTIMADAS</footer></div></main>}
function Metric({label,value}:{label:string;value:string}){return <div className="metric"><small>{label}</small><strong>{value}</strong></div>}
