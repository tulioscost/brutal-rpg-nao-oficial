// Testes de lógica, sem iniciar o Foundry. Execute: node tests/smoke.mjs
import assert from "node:assert/strict";
import {ARCHETYPES,THREATS,ARCHETYPE_ABILITIES,killerStats} from "../module/constants.mjs";
import {rollTest,recover,resetKiller,killerAction,startSuspense,suspenseStep,endSuspense,maneuver} from "../module/rules.mjs";
const m=killerStats("brutamontes","carniceiro");
assert.deepEqual([m.total,m.initialHorror,m.escape,m.steps,m.traps],[6,3,4,1,1]);
assert.equal(Object.keys(ARCHETYPES).length,8);
assert.equal(Object.keys(THREATS).length,13);
assert.ok(Object.values(ARCHETYPE_ABILITIES).every(a=>a.length===6));
assert.deepEqual(Object.values(ARCHETYPES).map(a=>a.initiative).sort(),[1,2,3,4,5,6,7,8]);
const store=new Map([["killerId","killer"],["encounter",false],["discard",0],["enabledSafety",false],["suspense",{active:false,steps:0,target:0,traps:0,round:0,foundBy:[]}] ]);
const setPath=(obj,k,v)=>{const path=k.split(".");for(let i=0;i<path.length-1;i++)obj=obj[path[i]];obj[path.at(-1)]=v;};
const gm={id:"gm",isGM:true};
const actor=(id,type,system)=>({id,type,name:id,isOwner:true,system,items:{get:()=>null},async update(values){for(const [k,v] of Object.entries(values))setPath(this,k,v)},testUserPermission:()=>true});
const survivor=actor("s1","sobrevivente",{archetype:"atleta",pool:{value:6,max:6},escape:{value:0,max:4},tension:0,dead:false,escaped:false,disabled:{ligeiro:false,potente:false},conditions:{ferida:0,sequela:0}});
const killer=actor("killer","assassino",{primary:"brutamontes",secondary:"carniceiro",pool:{value:6,max:99},escape:{value:0,max:6},horror:3,freeScares:1,distracted:0});
const actors=[survivor,killer];
const logs=[];
const sequences=[[1,4,6],[2],[1,4],[3,4,6]];
globalThis.game={
 user:gm,users:new Map([["gm",gm]]),actors:{contents:actors,get:(id)=>actors.find(a=>a.id===id),find:(fn)=>actors.find(fn),filter:(fn)=>actors.filter(fn)},
 settings:{get:(_ns,k)=>store.get(k),set:async (_ns,k,v)=>{store.set(k,v)}}
};
globalThis.ui={notifications:{warn:(x)=>logs.push(`WARN: ${x}`),info:(x)=>logs.push(`INFO: ${x}`),error:console.error}};
globalThis.ChatMessage={create:async x=>logs.push(x),getSpeaker:()=>({alias:"Test"}),getWhisperRecipients:()=>[gm]};
globalThis.Item={create:async data=>data};
globalThis.Roll=class{constructor(formula){this.formula=formula;} async evaluate(){const n=Number(this.formula.match(/^\d+/)?.[0]);let results=sequences.shift();if(results?.length!==n)throw Error(`Dados de teste incompatíveis: ${this.formula}, ${results}`);this.dice=[{results:results.map(result=>({result}))}];this.total=results.reduce((x,y)=>x+y,0);return this;}};
let r=await rollTest(survivor,{dice:3,style:"ligeiro"});
assert.equal(r.difficulty,3);assert.equal(r.successes,2);assert.equal(r.failures,1);
assert.equal(survivor.system.pool.value,5);assert.equal(survivor.system.tension,1);assert.equal(killer.system.pool.value,7);
r=await rollTest(survivor,{dice:1,scare:true});
assert.equal(r.passed,false);assert.equal(store.get("discard"),1);assert.equal(survivor.system.pool.value,4);
await recover(survivor,1);assert.equal(store.get("discard"),0);assert.equal(survivor.system.pool.value,5);
r=await rollTest(survivor,{dice:2,complex:true});
assert.equal(r.passed,false);assert.equal(killer.system.pool.value,8);assert.equal(survivor.system.pool.value,4);
await resetKiller(killer);assert.equal(killer.system.pool.value,6);assert.equal(killer.system.horror,3);
await startSuspense();assert.equal(store.get("suspense").target,1);
await suspenseStep(survivor.id);assert.equal(store.get("suspense").steps,1);
await endSuspense();assert.equal(survivor.system.tension,4);
store.set("encounter",true);
r=await maneuver(survivor,"vazar",{dice:3});
assert.equal(r.successes,3);assert.equal(survivor.system.escape.value,4);assert.equal(survivor.system.escaped,true);
console.log("OK: 8 arquétipos, 13 ameaças, 48 habilidades, testes, perda/recuperação, suspense, fuga vantajosa");
