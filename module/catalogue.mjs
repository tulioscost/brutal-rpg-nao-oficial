import {ARCHETYPES,THREATS,GENERAL_ADVANTAGES,STYLE_ADVANTAGES,STYLES,MOVES,SYSTEM_ID,titleCase,ARCHETYPE_ABILITIES} from "./constants.mjs";
const intro=(page)=>`Consulte o livro BRUTAL RPG 0.3, página ${page}, para descrição completa e restrições.`;
const item=(name,type,page,system={})=>({name,type,system:{description:intro(page),page,...system}});
export function catalogue(){
 const arr=[];
 for (const [key,a] of Object.entries(THREATS))arr.push(item(a.label,"ameaca",a.page,{threatNb:a.nb}));
 for(const v of GENERAL_ADVANTAGES)arr.push(item(v.name,"vantagem",v.page,{cost:v.cost,description:`${v.description} ${intro(v.page)}`}));
 for(const v of STYLE_ADVANTAGES)arr.push(item(v.name,"vantagem",v.page,{style:v.style,cost:v.cost}));
 for(const c of ["Ferida","Sequela","Condenação","Infecção","Maldição","Possessão"]){arr.push(item(c,"condicao",c==="Ferida"||c==="Sequela"?42:113));}
 for (const a of ["Assustar","Escapar","Ferir","Matar","Mutilar", "Acidentar","Amaldiçoar","Condenar","Destruir","Devorar","Imobilizar","Incapacitar","Infectar","Possuir"])arr.push(item(a,"acao",["Assustar","Escapar","Ferir","Matar","Mutilar"].includes(a)?143:144));
 for (const [key,m] of Object.entries(MOVES)) arr.push(item(m.label,"acao",m.page,{style:m.style??""}));
 for (const [key,v] of Object.entries(ARCHETYPES)){
   ARCHETYPE_ABILITIES[key].forEach((name,i)=>arr.push(item(name,"habilidade",v.page+1,{
     style:key,description:`${i===5?"Cicatriz de Arquétipo (não inicial). ":"Habilidade inicial disponível. "}${intro(v.page+1)}`
   })));
 }
 for (const s of STYLES)arr.push(item(`Estilo: ${titleCase(s)}`,"habilidade",s==="desenrolado"?76:77));
 return arr;
}
export async function installCatalogue(){
 if(!game.user.isGM) {ui.notifications.warn("Somente a Diretora pode importar o catálogo.");return;}
 const yes=await foundry.applications.api.DialogV2.confirm({window:{title:"BRUTAL — Catálogo inicial"},content:"<p>Criar os itens de referência do manual em uma pasta do mundo? A importação não copia o livro. Itens existentes não são duplicados.</p>"});
 if(!yes)return;
 let folder=game.folders.find(f=>f.name==="BRUTAL | Catálogo" && f.type==="Item");
 if(!folder)folder=await Folder.create({name:"BRUTAL | Catálogo",type:"Item",color:"#ab0b2a"});
 const data=catalogue();
 const exists=new Set(game.items.filter(i=>i.folder?.id===folder.id).map(i=>`${i.type}:${i.name}`));
 const create=data.filter(i=>!exists.has(`${i.type}:${i.name}`)).map(i=>({...i,folder:folder.id}));
 if(create.length)await Item.createDocuments(create);
 ui.notifications.info(`Catálogo BRUTAL: ${create.length} referências adicionadas (${data.length} disponíveis).`);
}
