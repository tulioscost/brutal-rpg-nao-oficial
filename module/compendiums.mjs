/** Compêndios de mundo populados por JSON de distribuição do sistema.
 * Sem banco LevelDB empacotado: o Foundry cria seu próprio armazenamento ao importar.
 * A operação é idempotente; não modifica personagens alterados após a importação.
 */
import {SYSTEM_ID} from './constants.mjs';
export const PACKS=Object.freeze([
  {slug:'assassinos',name:'brutal-assassinos',label:'BRUTAL | Assassinos',type:'Actor',private:true},
  {slug:'sobreviventes',name:'brutal-sobreviventes',label:'BRUTAL | Sobreviventes',type:'Actor',private:true},
  {slug:'itens',name:'brutal-itens',label:'BRUTAL | Itens',type:'Item',private:false}
]);
export const CONTENT_VERSION='0.2.0';

/** Evita duplicação por sourceId e preserva edições e documentos manuais. */
export function missingEntries(source,existing) {
  const ids=new Set(existing.map(doc=>doc.flags?.[SYSTEM_ID]?.sourceId).filter(Boolean));
  return source.filter(doc=>!ids.has(doc.flags?.[SYSTEM_ID]?.sourceId));
}

export async function installCompendiums({silent=false}={}) {
  if(!game.user?.isGM){ui.notifications.warn('Somente a Diretora pode instalar os compêndios.');return null;}
  const results={};
  for (const def of PACKS) {
    const key=`world.${def.name}`;
    let pack=game.packs.get(key);
    if(!pack){
      pack=await foundry.documents.collections.CompendiumCollection.createCompendium({
        name:def.name,label:def.label,type:def.type,package:'world'
      });
    }
    if(pack.documentName!==def.type)throw new Error(`${def.label}: tipo incompatível no compêndio existente.`);
    const path=`systems/${SYSTEM_ID}/data/compendios/${def.slug}.json`;
    const response=await fetch(path);
    if(!response.ok)throw new Error(`Não foi possível carregar ${path}: HTTP ${response.status}`);
    const source=await response.json();
    if(!Array.isArray(source))throw new Error(`Conteúdo inválido para ${def.label}.`);
    const existing=await pack.getDocuments();
    const additions=missingEntries(source,existing);
    // Não atualizar documentos existentes: usuário pode ter personalizado histórias e itens.
    if(additions.length){
      const wasLocked=pack.locked;
      if(wasLocked)await pack.configure({locked:false});
      try {
        const cls=def.type==='Actor'?Actor:Item;
        await cls.createDocuments(additions,{pack:pack.collection});
      } finally {
        if(wasLocked)await pack.configure({locked:true});
      }
    }
    if(def.private&& !pack.private)await pack.configure({private:true});
    results[def.slug]={added:additions.length,total:source.length,pack:pack.collection};
  }
  if(game.settings.settings.has(`${SYSTEM_ID}.compendiumsVersion`)){
    await game.settings.set(SYSTEM_ID,'compendiumsVersion',CONTENT_VERSION);
  }
  if(!silent){
    ui.notifications.info(`Compêndios BRUTAL: ${Object.values(results).map(x=>x.added).reduce((a,b)=>a+b,0)} registros adicionados em 3 acervos.`);
  }
  return results;
}
