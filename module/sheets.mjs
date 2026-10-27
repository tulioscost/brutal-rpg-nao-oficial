import {ARCHETYPES,THREATS,STYLES,CONDITIONS,killerStats,titleCase,ARCHETYPE_ABILITIES,GENERAL_ADVANTAGES,STYLE_ADVANTAGES} from "./constants.mjs";
import {rollTest,maneuver,activeKiller,resetKiller,setActiveKiller,startEncounter,endEncounter,isEncounter,diceDiscarded,killerAction,changeTension,giveHorror,recover,getSuspense,startSuspense,suspenseStep,suspenseTrap,suspenseNextRound,endSuspense,approach} from "./rules.mjs";
const {HandlebarsApplicationMixin}=foundry.applications.api;
const {ActorSheetV2,ItemSheetV2}=foundry.applications.sheets;
const choices=(obj,selected)=>Object.entries(obj).map(([value,o])=>({value,label:o.label??o,selected:value===selected}));
const listChoices=(values,selected)=>values.map(value=>({value,label:titleCase(value),selected:selected===value}));
const isIn=(arr,key)=>arr.includes(key);
const updates=async function(event,form,formData){
 const values=formData.object;
 const previous=this.document.system?.archetype;
 await this.document.update(values);
 if(this.document.type==="sobrevivente"&&this.document.system.archetype!==previous){
   await this.document.update({"system.initiative":ARCHETYPES[this.document.system.archetype]?.initiative??8});
 }
};
export class BrutalActorSheet extends HandlebarsApplicationMixin(ActorSheetV2){
 static DEFAULT_OPTIONS={
   classes:["brutal-sheet","brutal-actor"],tag:"form",position:{width:850,height:800},
   window:{resizable:true,icon:"fa-solid fa-clapperboard"},
   form:{handler:updates,submitOnChange:true,closeOnSubmit:false}
 };
 static PARTS={body:{template:"systems/brutal-rpg/templates/actor.hbs",root:true}};
 async _prepareContext(options){
   const context=await super._prepareContext(options);
   const actor=this.document,system=actor.system;
   const survivor=actor.type==="sobrevivente";
   const ownStyles=ARCHETYPES[system.archetype]?.styles??[];
   const entries=actor.items.contents.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
   return {...context,actor,system,owner:actor.isOwner,isSurvivor:survivor,isHidden:!survivor&&!game.user.isGM,
     gm:game.user.isGM,encounter:isEncounter(),discard:diceDiscarded(),suspense:getSuspense(),killerActive:activeKiller()?.id===actor.id,
     archetypes:choices(ARCHETYPES,system.archetype),primaryChoices:choices(THREATS,system.primary),secondaryChoices:choices(THREATS,system.secondary),
     stats:survivor?null:killerStats(system.primary,system.secondary),
     archetype:ARCHETYPES[system.archetype]?.label??"—",initiative:survivor?ARCHETYPES[system.archetype]?.initiative??8:9,
     styleChecks:STYLES.map(key=>({key,label:titleCase(key),owned:ownStyles.includes(key),disabled:system.disabled?.[key]??false})),
     testStyles:[{value:"",label:"Sem Estilo",selected:true},...STYLES.map(key=>({value:key,label:titleCase(key),selected:false}))],
     testResources:entries.filter(i=>i.type==="recurso"&&i.system.uses.value>0),
     initialAbilities:(ARCHETYPE_ABILITIES[system.archetype]??[]).slice(0,5).map(name=>({name})),
     otherActors:game.actors.filter(a=>a.type==="sobrevivente"&&!a.system.dead&&a.id!==actor.id),
     targets:game.actors.filter(a=>a.type==="sobrevivente"&&!a.system.dead),
     abilities:entries.filter(i=>i.type==="habilidade"),advantages:entries.filter(i=>i.type==="vantagem"),
     equipment:entries.filter(i=>["recurso","pista"].includes(i.type)),actions:entries.filter(i=>["acao","apavoro","ameaca"].includes(i.type)),
     conditions:CONDITIONS.map(key=>({key,label:titleCase(key),value:system.conditions[key]}))
   };
 }
 async _onRender(context,options){
   await super._onRender(context,options);
   const root=this.element;
   root.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{
     this._tab=b.dataset.tab;
     root.querySelectorAll("[data-tab]").forEach(el=>el.classList.toggle("active",el.dataset.tab===this._tab));
     root.querySelectorAll("[data-pane]").forEach(el=>el.classList.toggle("active",el.dataset.pane===this._tab));
   }));
   if(this._tab){root.querySelector(`[data-tab="${this._tab}"]`)?.click();}
 }
 async _onClickAction(event,button){
   const action=button.dataset.action,actor=this.document;
   if(!actor.isOwner)return ui.notifications.warn("Sem permissão para editar esta ficha.");
   const root=this.element;
   const get=(id)=>root.querySelector(id);
   const dice=Math.max(0,Number(get("[data-field='rollDice']")?.value)||1);
   const escapeDice=Math.max(0,Number(get("[data-field='escapeDice']")?.value)||0);
   const style=get("[data-field='rollStyle']")?.value||"";
   const resourceId=get("[data-field='rollResource']")?.value||"";
   const complex=get("[data-field='rollComplex']")?.checked||false;
   const targetId=get("[data-field='targetId']")?.value||"";
   if(action==="apply-advantages"){
     if(actor.type!=="sobrevivente")return;
     const available=[...GENERAL_ADVANTAGES,...STYLE_ADVANTAGES.filter(v=>ARCHETYPES[actor.system.archetype]?.styles.includes(v.style))];
     const known=new Set(actor.items.filter(i=>i.type==="vantagem").map(i=>i.name));
     const items=available.filter(v=>!known.has(v.name)).map(v=>({name:v.name,type:"vantagem",system:{style:v.style||"",cost:v.cost,page:v.page,description:`Consulte a página ${v.page} do livro BRUTAL RPG 0.3.`}}));
     if(items.length)await actor.createEmbeddedDocuments("Item",items);
     return;
   }
   if(action==="choose-ability"){
     if(actor.type!=="sobrevivente")return;
     const name=get("[data-field='ability']")?.value;
     if(!ARCHETYPE_ABILITIES[actor.system.archetype]?.slice(0,5).includes(name))return;
     if(actor.items.some(i=>i.type==="habilidade"&&i.system.style===actor.system.archetype))return ui.notifications.warn("Uma Habilidade inicial já foi selecionada. Remova-a antes de trocar.");
     const page=ARCHETYPES[actor.system.archetype].page+1;
     await actor.createEmbeddedDocuments("Item",[{name,type:"habilidade",system:{style:actor.system.archetype,page,description:`Habilidade inicial: consulte BRUTAL RPG 0.3, página ${page}.`}}]);
     return;
   }
   if(action==="start-suspense")return startSuspense();
   if(action==="step-suspense")return suspenseStep(targetId);
   if(action==="trap-more")return suspenseTrap(1);
   if(action==="trap-less")return suspenseTrap(-1);
   if(action==="round-suspense")return suspenseNextRound();
   if(action==="end-suspense")return endSuspense();
   if(action==="approach")return approach(actor,button.dataset.key);
   if(action==="roll")return rollTest(actor,{dice,escapeDice,style,resourceId,complex});
   if(action==="scare")return rollTest(actor,{dice:1,scare:true});
   if(action==="move")return maneuver(actor,button.dataset.move,{dice,escapeDice,complex,resourceId,targetId});
   if(action==="recover")return recover(actor,Number(button.dataset.count)||1);
   if(action==="pt-add")return changeTension(actor,1);
   if(action==="pt-sub")return changeTension(actor,-1);
   if(action==="ph-add")return giveHorror(actor,1);
   if(action==="ph-sub")return giveHorror(actor,-1);
   if(action==="active-killer")return setActiveKiller(actor);
   if(action==="reset-killer")return resetKiller(actor);
   if(action==="start-encounter")return startEncounter();
   if(action==="end-encounter")return endEncounter();
   if(action==="killer-action")return killerAction(actor,button.dataset.key,targetId);
   if(action==="item-open")return actor.items.get(button.dataset.itemId)?.sheet.render(true);
   if(action==="item-delete"){
     const item=actor.items.get(button.dataset.itemId);
     if(item&&await foundry.applications.api.DialogV2.confirm({window:{title:"Remover item"},content:`<p>Remover este item da ficha?</p>`}))await item.delete();
     return;
   }
   if(action==="item-create"){
     const type=button.dataset.type;
     if(!["habilidade","vantagem","recurso","pista","acao","apavoro","ameaca","condicao"].includes(type))return;
     const newItem=await Item.create({name:"Novo "+type,type,system:{uses:{value:3,max:3}}},{parent:actor});
     return newItem.sheet.render(true);
   }
   if(action==="res-use"){
     const item=actor.items.get(button.dataset.itemId);
     if(item?.system.uses?.value>0)return item.update({"system.uses.value":item.system.uses.value-1});
   }
   return super._onClickAction(event,button);
 }
}
export class BrutalItemSheet extends HandlebarsApplicationMixin(ItemSheetV2){
 static DEFAULT_OPTIONS={classes:["brutal-sheet","brutal-item"],tag:"form",position:{width:550,height:540},form:{handler:updates,submitOnChange:true,closeOnSubmit:false},window:{resizable:true}};
 static PARTS={body:{template:"systems/brutal-rpg/templates/item.hbs",root:true}};
 async _prepareContext(options){return {...await super._prepareContext(options),item:this.document,system:this.document.system};}
}
