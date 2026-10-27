import {SYSTEM_ID,ARCHETYPES,THREATS,killerStats} from "./constants.mjs";

const INT=n=>Math.max(0,Math.floor(Number(n)||0));
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const setting=k=>game.settings.get(SYSTEM_ID,k);
const setter=(k,v)=>game.settings.set(SYSTEM_ID,k,v);
function actors(){return game.actors.contents.filter(a=>a.type==="sobrevivente");}
export function activeKiller(){return game.actors.get(setting("killerId"))??game.actors.find(a=>a.type==="assassino")??null;}
export function isEncounter(){return setting("encounter");}
export function diceDiscarded(){return setting("discard");}
function gmAvailable(){return game.users.find(u=>u.isGM&&u.active);}
function dispatch(type,values={}){
 if(!gmAvailable()){ui.notifications.warn("É necessária uma Diretora conectada para atualizar as pilhas compartilhadas.");return false;}
 game.socket.emit(`system.${SYSTEM_ID}`,{type,...values,userId:game.user.id});return true;
}
async function log(content,actor,{secret=false,roll=null}={}){
 const data={speaker:ChatMessage.getSpeaker({actor}),content:`<div class="brutal-chat">${content}</div>`};
 if(roll)data.rolls=[roll];
 if(secret)data.whisper=ChatMessage.getWhisperRecipients("GM").map(u=>u.id);
 return ChatMessage.create(data);
}
async function gmHandle(message){
 if(!game.user.isGM)return;
 const sender=game.users.get(message.userId);
 if(!sender)return;
 const actor=game.actors.get(message.actorId);
 const amount=Math.min(100,INT(message.amount));
 const killer=activeKiller();
 if(message.type==="loss"){
   if(!actor||actor.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER")))return;
   if(amount===0)return;
   if(message.encounter||message.scare||!killer){await setter("discard",setting("discard")+amount);}
   else await killer.update({"system.pool.value":INT(killer.system.pool.value)+amount});
 }
 else if(message.type==="discard"){
   if(!sender.isGM && !(actor?.type==="sobrevivente" && actor.testUserPermission(sender,"OWNER")))return;
   await setter("discard",setting("discard")+amount);
 }
 else if(message.type==="recover"){
   if(!actor||actor.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER")))return;
   const allowed=Math.min(amount,INT(setting("discard")),6-INT(actor.system.pool.value));
   if(allowed<1){ui.notifications.warn("Sem dados de descarte ou com pilha cheia.");return;}
   await setter("discard",setting("discard")-allowed);
   await actor.update({"system.pool.value":INT(actor.system.pool.value)+allowed});
 }
 else if(message.type==="director-delta"){
   if(!actor||actor.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER"))||!killer)return;
   const oldValue=INT(killer.system.pool.value);
   const targetValue=Math.max(0,oldValue+Number(message.delta||0));
   await killer.update({"system.pool.value":targetValue});
   if(Number(message.delta)<0)await setter("discard",setting("discard")+(oldValue-targetValue));
   if(targetValue===0&&setting("encounter"))await awardClue();
 }
 else if(message.type==="take-discard") {
   if(!actor||actor.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER")))return;
   await setter("discard",Math.max(0,setting("discard")-Math.min(amount,setting("discard"))));
 }
 else if(message.type==="distract") {
   if(!actor||actor.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER"))||!killer)return;
   await killer.update({"system.distracted":INT(killer.system.distracted)+1});
 }
 else if(message.type==="sacrifice-used") {
   if(!actor||actor.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER")))return;
   await setter("sacrificeUsed",true);
 }
 else if(message.type==="escape-target") {
   const target=game.actors.get(message.targetId);
   if(!actor||!target||actor.type!=="sobrevivente"||target.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER")))return;
   await target.update({"system.escaped":true});
 }
 else if(message.type==="give"){
   const target=game.actors.get(message.targetId);
   if(!actor||!target||actor.type!=="sobrevivente"||target.type!=="sobrevivente"||!(sender.isGM||actor.testUserPermission(sender,"OWNER")))return;
   await target.update({"system.pool.value":Math.min(6,INT(target.system.pool.value)+amount)});
 }
}
export async function receiveSocket(message){
 if(!game.user.isGM||!message?.type||!message.userId)return;
 try{await gmHandle(message);}catch(e){console.error("BRUTAL: falha ao sincronizar pilhas",e);ui.notifications.error("BRUTAL: falha de sincronização das pilhas.");}
}
async function requestGM(type,payload={}){
 if(game.user.isGM)return gmHandle({type,...payload,userId:game.user.id});
 return dispatch(type,payload);
}
export async function setActiveKiller(actor){
 if(!game.user.isGM||actor.type!=="assassino")return;
 await setter("killerId",actor.id);
 ui.notifications.info(`${actor.name}: Assassino ativo.`);
}
export async function resetKiller(actor){
 if(!game.user.isGM)return;
 const stats=killerStats(actor.system.primary,actor.system.secondary);
 await actor.update({"system.pool.value":stats.initialDice,"system.horror":stats.initialHorror,"system.freeScares":stats.freeScares,"system.escape.max":stats.escape,"system.initiative":9});
 await setActiveKiller(actor);
 await log(`<strong>${esc(actor.name)}:</strong> pilhas iniciais calculadas (NB total ${stats.total}, fuga ${stats.escape}).`,actor,{secret:true});
}
export async function startEncounter(){
 if(!game.user.isGM)return;
 const killer=activeKiller();
 if(!killer){ui.notifications.warn("Crie um Assassino e torne-o ativo.");return;}
 const stats=killerStats(killer.system.primary,killer.system.secondary);
 if(getSuspense().active)await endSuspense();
 const visible=actors().filter(a=>!a.system.dead);
 if(!visible.length)return ui.notifications.warn("Não há Sobreviventes vivas no mundo.");
 const allowed=visible.some(a=>INT(killer.system.pool.value)>INT(a.system.pool.value));
 if(!allowed){ui.notifications.warn("A Pilha da Diretora não é maior que a de nenhuma Sobrevivente (p. 93).");return;}
 if(setting("enabledSafety"))ui.notifications.info("BRUTAL: respeite limites, consentimento e segurança do grupo.");
 for(const a of visible){
   const death=INT(a.system.pool.value)===0;
   await a.update({"system.escape.value":0,"system.escape.max":stats.escape,"system.escaped":false,...(death?{"system.dead":true}:{})});
 }
 await killer.update({"system.freeScares":stats.freeScares,"system.distracted":0});
 await setter("encounter",true);
 await log(`<b>ENCONTRO INICIADO</b><p>Valor Base de Fuga: ${stats.escape}. Iniciativa fixa por arquétipo. Assassino age por último.</p>`,killer);
}
export async function endEncounter(){
 if(!game.user.isGM)return;
 for(const a of actors()){
   const returning=INT(a.system.escape.value);
   if(returning||a.system.escaped){await a.update({"system.pool.value":Math.min(6,INT(a.system.pool.value)+returning),"system.escape.value":0,"system.escaped":false});}
 }
 await setter("encounter",false);
 await log("<b>FIM DE ENCONTRO</b><p>Dados da Pilha de Fuga retornaram à Pilha de Intérprete.</p>",activeKiller());
}
export function getSuspense(){return setting("suspense");}
export async function startSuspense(){
 if(!game.user.isGM)return;
 if(isEncounter())return ui.notifications.warn("Encerre o Encontro antes de iniciar um Suspense.");
 const killer=activeKiller();if(!killer)return ui.notifications.warn("Escolha um Assassino ativo.");
 const stats=killerStats(killer.system.primary,killer.system.secondary);
 await setter("suspense",{active:true,steps:0,target:stats.steps,traps:stats.traps,round:1,foundBy:[]});
 await log(`<b>SUSPENSE INICIADO</b><p>Investiguem os Caminhos. Passos necessários e Armadilhas ficam sob controle da Diretora.</p>`,killer);
}
export async function suspenseStep(actorId){
 if(!game.user.isGM)return;
 const state=getSuspense();if(!state.active)return ui.notifications.warn("Inicie um Suspense.");
 const target=game.actors.get(actorId);
 if(!target||target.type!=="sobrevivente")return ui.notifications.warn("Selecione quem encontrou o Passo.");
 const next={...state,steps:state.steps+1,foundBy:[...state.foundBy,actorId]};
 await setter("suspense",next);
 await log(`<b>PASSO DESCOBERTO</b> por ${esc(target.name)}.`,target);
 if(next.steps>=next.target)ui.notifications.info("Quantidade de Passos atingida. A Diretora pode resolver a cena.");
}
export async function suspenseTrap(delta){
 if(!game.user.isGM)return;
 const state=getSuspense();if(!state.active)return;
 await setter("suspense",{...state,traps:Math.max(0,state.traps+Number(delta||0))});
}
export async function suspenseNextRound(){
 if(!game.user.isGM)return;
 const state=getSuspense();if(!state.active)return;
 await setter("suspense",{...state,round:state.round+1});
}
export async function endSuspense(){
 if(!game.user.isGM)return;
 const state=getSuspense();if(!state.active)return;
 const scores=new Map();
 for(const id of state.foundBy)scores.set(id,(scores.get(id)||0)+3);
 for(const [id,points] of scores){
   const actor=game.actors.get(id);
   if(actor)await actor.update({"system.tension":Math.min(10,INT(actor.system.tension)+points)});
 }
 await setter("suspense",{...state,active:false});
 await log(`<b>FIM DE SUSPENSE</b><p>${state.steps} Passo(s). Recompensas: +3 PT por Passo encontrado, respeitando o limite de 10 PT.</p>`,activeKiller());
}
export async function approach(actor,type){
 if(!actor.isOwner||actor.type!=="sobrevivente")return;
 const s=getSuspense();if(!s.active)return ui.notifications.warn("Não há Suspense ativo.");
 const labels={direta:"Direta (buscar Passos ou Recompensas; risco de Armadilhas)",cautelosa:"Cautelosa (desarmar Armadilha; sem Passo)",investigativa:"Investigativa (Teste Complexo Firme ou Sagaz)"};
 if(!labels[type])return;
 await log(`<b>ABORDAGEM ${esc(type.toUpperCase())}</b><p>${esc(actor.name)} escolhe abordagem ${esc(labels[type])}. A Diretora resolve o Caminho.</p>`,actor);
}
export async function newSession(){
 if(!game.user.isGM)return;
 await setter("sacrificeUsed",false);await setter("encounter",false);await setter("discard",0);
 for(const a of actors())await a.update({"system.sacrificeUsed":false});
 ui.notifications.info("BRUTAL: sessão reiniciada. Use o botão de reiniciar pilhas do Assassino separadamente.");
}
export async function awardClue(){
 if(!game.user.isGM)return;
 const name=`Pista descoberta ${new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
 const clue=await Item.create({name,type:"pista",system:{description:"Defina o significado e alcance da Pista segundo o Thriller.",uses:{value:5,max:5}}});
 await log(`<b>PISTA DESCOBERTA!</b> A Pilha da Diretora foi esvaziada. ${esc(clue.name)} foi criada na aba Itens.`,activeKiller());
}
export async function rollTest(actor,opts={}){
 if(!actor?.isOwner)return ui.notifications.warn("Você não tem permissão para rolar por esta Sobrevivente.");
 if(actor.type!=="sobrevivente")return ui.notifications.warn("Rolagens de Sobrevivente requerem a ficha correspondente.");
 if(actor.system.dead)return ui.notifications.warn("A Sobrevivente está morta.");
 const pool=INT(actor.system.pool.value),fuga=INT(actor.system.escape.value);
 const nPool=Math.min(pool,INT(opts.dice??1));
 const nEscape=isEncounter()?Math.min(fuga,INT(opts.escapeDice??0)):0;
 const n=nPool+nEscape;
 if(!n)return ui.notifications.warn("Nenhum dado disponível para a rolagem.");
 const scare=opts.scare===true,move=opts.move??"",complex=opts.complex===true||move==="distrair";
 const style=scare?"":String(opts.style||"");
 const ownStyles=ARCHETYPES[actor.system.archetype]?.styles??[];
 const styleBonus=ownStyles.includes(style)&&!actor.system.disabled?.[style]?1:0;
 const resourceId=String(opts.resourceId??"");
 const resource=resourceId?actor.items.get(resourceId):null;
 const usableResource=resource?.type==="recurso"&&INT(resource.system.uses?.value)>0?resource:null;
 const resourceBonus=usableResource?1:0;
 const difficulty=scare?4:Math.max(1,Math.min(6,4-styleBonus-resourceBonus+INT(opts.penalty||0)));
 const roll=await new Roll(`${n}d6`).evaluate();
 const results=roll.dice[0].results.map(r=>r.result);
 const successes=results.filter(v=>v>=difficulty).length;
 const sixes=results.filter(v=>v===6).length;
 const passed=complex?(successes>=2||sixes>0):successes>0;
 const failPool=move==="ajudar"?0:results.slice(0,nPool).filter(v=>v<difficulty).length;
 const failEscape=move==="ajudar"?0:results.slice(nPool).filter(v=>v<difficulty).length;
 const failures=failPool+failEscape;
 let currentPool=pool-failPool,currentEscape=fuga-failEscape;
 let additionalDiscard=0, moved=0;
 if(move==="vazar"&&passed){
   // Sucessos que vieram da Pilha de Fuga permanecem nela. Os da Pilha de Intérprete migram.
   const successesPool=results.slice(0,nPool).filter(v=>v>=difficulty).length;
   const desired=complex?Math.floor((successes+sixes)/2):successesPool+sixes;
   moved=Math.min(desired,currentPool,6-currentEscape);
   currentPool-=moved;currentEscape+=moved;
   // Somente a Fuga Vantajosa (6) permite obter o bônus diretamente do Descarte.
   const short=Math.max(0,desired-moved);
   if(short>0&&sixes>0){
     additionalDiscard=Math.max(0,Math.min(short,sixes,INT(setting("discard")),6-currentEscape));
     currentEscape+=additionalDiscard;
   }
 }
 const extraPts=passed?Math.max(0,successes-(complex&&sixes===0?2:1)):0;
 const newTension=Math.min(10,INT(actor.system.tension)+extraPts);
 const escaped=isEncounter()&&move==="vazar"&&currentEscape>=INT(actor.system.escape.max);
 await actor.update({"system.pool.value":currentPool,"system.escape.value":Math.min(6,currentEscape),"system.tension":newTension,...(escaped?{"system.escaped":true}:{})});
 if(usableResource)await usableResource.update({"system.uses.value":INT(usableResource.system.uses.value)-1});
 if(failures)await requestGM("loss",{actorId:actor.id,amount:failures,encounter:isEncounter(),scare});
 if(additionalDiscard)await requestGM("take-discard",{actorId:actor.id,amount:additionalDiscard});
 if(move==="partir"&&passed)await requestGM("director-delta",{actorId:actor.id,delta:-1});
 if(move==="distrair"&&passed)await requestGM("distract",{actorId:actor.id,amount:1});
 let helped="";
 if(move==="ajudar"&&successes>0){
   const target=game.actors.get(opts.targetId);
   if(target&&target.type==="sobrevivente"&&target.id!==actor.id){
     const given=Math.max(0,Math.min(successes,currentPool,6-INT(target.system.pool.value)));
     await actor.update({"system.pool.value":currentPool-given});
     await requestGM("give",{actorId:actor.id,targetId:target.id,amount:given});
     helped=`<p>${given} dado(s) transferidos a ${esc(target.name)}.</p>`;
   }
 }
 const contextLabel=move?({vazar:"VAZAR DALI",partir:"PARTIR PRA CIMA",ajudar:"AJUDAR ALGUÉM",distrair:"DISTRAIR"}[move]||"TESTE"):(scare?"TESTE DE SUSTO":"TESTE");
 const result=`<h3>${esc(contextLabel)} — ${passed?"SUCESSO":"FRACASSO"}</h3><p>${n}d6 | Dificuldade ${difficulty}${complex?" | Complexo":""} | ${styleBonus?"Estilo: "+esc(style):"Sem bônus de Estilo"}</p><p>Faces: <strong>${results.join(" · ")}</strong> | Sucessos: ${successes} | Falhas: ${failures}</p><p>${failures?`${failures} dado(s) ${isEncounter()||scare?"descartados":"sacrificados"}.`:"Nenhum dado perdido."} ${extraPts?`+${extraPts} PT.`:""}</p>${helped}${escaped?"<p><strong>SOBREVIVENTE ESCAPOU DO ENCONTRO!</strong></p>":""}`;
 await log(result,actor,{roll});
 return {passed,roll,results,successes,failures,difficulty,moved};
}

export async function recover(actor,number=1){
 if(!actor?.isOwner||actor.type!=="sobrevivente")return;
 await requestGM("recover",{actorId:actor.id,amount:Math.min(6,INT(number))});
}
export async function maneuver(actor,key,opts={}){
 if(!isEncounter())return ui.notifications.warn("Manobras somente durante Encontros.");
 if(actor.system.dead||actor.system.escaped)return ui.notifications.warn("Esta Sobrevivente não pode agir no Encontro.");
 if(key==="folego"){
   const firm=ARCHETYPES[actor.system.archetype]?.styles.includes("firme")&&!actor.system.disabled.firme;
   const n=firm?2:1;await recover(actor,n);await log(`<b>RECUPERAR FÔLEGO</b>: até ${n} dado(s) recuperados do Descarte.`,actor);return;
 }
 if(key==="arriscar"){
   if(actor.system.sacrificeUsed||setting("sacrificeUsed"))return ui.notifications.warn("Arriscar Tudo já utilizado nesta sessão.");
   const target=game.actors.get(opts.targetId);
   if(!target||target.type!=="sobrevivente"||target.system.dead)return ui.notifications.warn("Escolha uma Sobrevivente válida.");
   const alive=actors().filter(a=>!a.system.dead&&!a.system.escaped);
   if(alive.length<2)return ui.notifications.warn("Não é possível Arriscar Tudo sendo a última Sobrevivente.");
   const dices=INT(actor.system.pool.value)+INT(actor.system.escape.value);
   await actor.update({"system.pool.value":0,"system.escape.value":0,"system.sacrificeUsed":true});
   await requestGM("discard",{actorId:actor.id,amount:dices});
   await requestGM("escape-target",{actorId:actor.id,targetId:target.id});
   await requestGM("sacrifice-used",{actorId:actor.id});
   await log(`<b>ARRISCAR TUDO</b>: ${esc(actor.name)} descarta ${dices} dados e ${esc(target.name)} escapa.`,actor);return;
 }
 return rollTest(actor,{...opts,move:key,style:({vazar:"ligeiro",partir:"potente",ajudar:"sagaz",distrair:"desenrolado"})[key]});
}
export async function killerAction(killer,key,targetId){
 if(!game.user.isGM||killer.type!=="assassino")return;
 const target=game.actors.get(targetId);
 const pool=INT(killer.system.pool.value);
 if(key==="escape"){
   await killer.update({"system.pool.value":pool+1});
   await endEncounter();return;
 }
 if(!target||target.type!=="sobrevivente")return ui.notifications.warn("Selecione uma Sobrevivente.");
 if(key==="scare"){
   if(INT(target.system.pool.value)===0)return ui.notifications.warn("Sem dados para o susto.");
   if(setting("encounter")&&killer.system.freeScares<1)return ui.notifications.warn("Sem sustos livres; ação de turno pode ser gerida manualmente.");
   if(setting("encounter"))await killer.update({"system.freeScares":INT(killer.system.freeScares)-1});
   return rollTest(target,{dice:1,scare:true});
 }
 if(key==="wound"){
   if(pool<1)return ui.notifications.warn("Pilha da Diretora vazia.");
   const roll=await new Roll("1d6").evaluate();const face=roll.total;
   const old=INT(target.system.conditions.ferida),scar=INT(target.system.conditions.sequela);
   await killer.update({"system.pool.value":pool-1});
   await target.update({"system.conditions.ferida":old+face,"system.conditions.sequela":scar+1,...(old+face>=6?{"system.dead":true}:{})});
   if(old>0)await requestGM("discard",{amount:1});
   await log(`<b>FERIR</b>: ${esc(target.name)} recebe ${face} Ferida(s) e uma Sequela. Total: ${old+face}.${old+face>=6?" <b>MORTE.</b>":""}`,killer,{roll});
   if(pool-1===0&&isEncounter())await awardClue();return;
 }
 if(key==="kill"){
   if(!isEncounter())return ui.notifications.warn("Matar exige um Encontro.");
   const extra=INT(killer.system.distracted);
   const diceCost=2+extra;
   const horrorCost=2*extra;
   if(pool<diceCost||INT(killer.system.horror)<horrorCost)return ui.notifications.warn("Dados ou PH insuficientes para Matar.");
   if(INT(target.system.pool.value)+INT(target.system.escape.value)>=pool)return ui.notifications.warn("Matar exige que a Sobrevivente tenha menos dados que a Diretora.");
   await killer.update({"system.pool.value":pool-diceCost,"system.horror":INT(killer.system.horror)-horrorCost,"system.distracted":0});
   await setter("discard",setting("discard")+diceCost);
   await target.update({"system.dead":true});
   await log(`<b>MATAR</b>: ${esc(target.name)} morreu. ${diceCost} dados descartados da Diretora.`,killer);
   if(pool-diceCost===0&&isEncounter())await awardClue();return;
 }
}
export async function changeTension(actor,delta){
 if(!actor?.isOwner)return;
 await actor.update({"system.tension":Math.max(0,Math.min(10,INT(actor.system.tension)+delta))});
}
export async function giveHorror(actor,delta){
 if(!game.user.isGM||actor.type!=="assassino")return;
 await actor.update({"system.horror":Math.max(0,INT(actor.system.horror)+delta)});
}
export function setupAPI(){return {activeKiller,isEncounter,diceDiscarded,rollTest,maneuver,recover,setActiveKiller,resetKiller,startEncounter,endEncounter,getSuspense,startSuspense,suspenseStep,suspenseTrap,suspenseNextRound,endSuspense,approach,newSession,killerAction,changeTension,giveHorror,awardClue};}
