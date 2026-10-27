import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PACKS,CONTENT_VERSION,installCompendiums,missingEntries} from '../module/compendiums.mjs';
import {killerStats,ARCHETYPES,THREATS} from '../module/constants.mjs';

const store={};
for(const [slug,min] of [['assassinos',20],['sobreviventes',24],['itens',100]]){
  const data=JSON.parse(await readFile(new URL(`../data/compendios/${slug}.json`,import.meta.url),'utf8'));
  assert.ok(data.length>=min,`${slug}: tamanho mínimo`);
  assert.equal(new Set(data.map(x=>x.flags['brutal-rpg'].sourceId)).size,data.length,`${slug} sourceIds únicos`);
  for (const d of data){
    assert.ok(d.name?.length>5,`Nome de ${slug}`);
    assert.ok(d.system,`Sistema de ${d.name}`);
    if(slug==='assassinos'){
      assert.equal(d.type,'assassino');assert.ok(d.system.bio.length>170);
      assert.ok(THREATS[d.system.primary]&&THREATS[d.system.secondary]);
      assert.ok(d.items.length>=2);
      assert.equal(d.system.pool.value,killerStats(d.system.primary,d.system.secondary).initialDice);
      assert.ok(d.items.every(i=>i.type==='equipamento'&&i.system.uses.value===0));
    }
    if(slug==='sobreviventes'){
      assert.equal(d.type,'sobrevivente');assert.ok(ARCHETYPES[d.system.archetype]);
      assert.ok(d.system.bio.length>150&&d.items.length>=2);
      assert.equal(d.system.initiative,ARCHETYPES[d.system.archetype].initiative);
      assert.ok(d.items.filter(i=>i.type==='recurso').length<=1,'Um Recurso inicial por sobrevivente');
      assert.ok(d.items.every(i=>i.type!=='pista'),'Pistas são desbloqueadas em jogo');
    }
    if(slug==='itens'){
      assert.ok(['recurso','pista','equipamento'].includes(d.type));
      assert.equal(d.system.uses.value,d.type==='pista'?5:d.type==='recurso'?3:0);
      assert.equal(d.system.uses.max,d.system.uses.value);
    }
  }
  store[slug]=data;
}
assert.equal(PACKS.length,3);
assert.equal(missingEntries(store.itens,store.itens).length,0);

const packs=new Map();
class FakePack {
 constructor(def){this.collection=`world.${def.name}`;this.documentName=def.type;this.private=false;this.locked=false;this.docs=[];}
 async getDocuments(){return this.docs;}
 async configure(flags){Object.assign(this,flags);}
}
globalThis.foundry={documents:{collections:{CompendiumCollection:{
 async createCompendium(metadata){const p=new FakePack(metadata);packs.set(p.collection,p);return p;}
}}}};
const create=async (data,opts)=>{const p=packs.get(opts.pack);assert.ok(p);p.docs.push(...data.map(x=>structuredClone(x)));return data;};
globalThis.Actor={createDocuments:create};
globalThis.Item={createDocuments:create};
globalThis.game={user:{isGM:true},packs:{get:(key)=>packs.get(key)},settings:{
 settings:{has:()=>true},set:async(ns,key,value)=>{assert.equal(ns,'brutal-rpg');assert.equal(key,'compendiumsVersion');assert.equal(value,CONTENT_VERSION);}
}};
globalThis.ui={notifications:{info:()=>{},warn:()=>{}}};
globalThis.fetch=async url=>{
 const m=/\/([^/]+)\.json$/.exec(url);return {ok:!!m,json:async()=>store[m[1]]};
};
let result=await installCompendiums({silent:true});
assert.deepEqual(Object.fromEntries(Object.entries(result).map(([k,v])=>[k,v.added])),{assassinos:20,sobreviventes:24,itens:store.itens.length});
assert.ok(packs.get('world.brutal-assassinos').private);
assert.ok(packs.get('world.brutal-sobreviventes').private);
assert.equal(packs.get('world.brutal-itens').private,false);
result=await installCompendiums({silent:true});
assert.ok(Object.values(result).every(x=>x.added===0),'Importação idempotente');
console.log(`OK: 3 compêndios, 20 Assassinos, 24 Sobreviventes, ${store.itens.length} Itens, privacidade e importação sem duplicar`);
