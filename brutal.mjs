import {SurvivorData,KillerData,BrutalItemData} from "./module/models.mjs";
import {BrutalActorSheet,BrutalItemSheet} from "./module/sheets.mjs";
import {setupAPI,receiveSocket} from "./module/rules.mjs";
import {installCatalogue} from "./module/catalogue.mjs";
import {ARCHETYPES,SYSTEM_ID,THREATS} from "./module/constants.mjs";
Hooks.once("init",()=>{
  CONFIG.Actor.dataModels.sobrevivente=SurvivorData;
  CONFIG.Actor.dataModels.assassino=KillerData;
  for(const type of ["habilidade","vantagem","recurso","pista","ameaca","acao","apavoro","condicao"])CONFIG.Item.dataModels[type]=BrutalItemData;
  foundry.applications.apps.DocumentSheetConfig.registerSheet(foundry.documents.Actor,SYSTEM_ID,BrutalActorSheet,{makeDefault:true,types:["sobrevivente","assassino"]});
  foundry.applications.apps.DocumentSheetConfig.registerSheet(foundry.documents.Item,SYSTEM_ID,BrutalItemSheet,{makeDefault:true});
  CONFIG.Actor.trackableAttributes={
    sobrevivente:{bar:["pool","escape"],value:["tension","conditions.ferida","conditions.sequela"]},
    assassino:{bar:["pool"],value:["horror"]}
  };
  game.settings.register(SYSTEM_ID,"discard",{scope:"world",config:false,type:Number,default:0});
  game.settings.register(SYSTEM_ID,"encounter",{scope:"world",config:false,type:Boolean,default:false});
  game.settings.register(SYSTEM_ID,"killerId",{scope:"world",config:false,type:String,default:""});
  game.settings.register(SYSTEM_ID,"suspense",{scope:"world",config:false,type:Object,default:{active:false,steps:0,target:0,traps:0,round:0,foundBy:[]}});
  game.settings.register(SYSTEM_ID,"sacrificeUsed",{scope:"world",config:false,type:Boolean,default:false});
  game.settings.register(SYSTEM_ID,"enabledSafety",{scope:"world",config:true,type:Boolean,default:true,name:"Avisos de segurança",hint:"Exibir lembrete de limites e consentimento nos encontros."});
  game.brutal={...setupAPI(),installCatalogue,ARCHETYPES,THREATS};

});
Hooks.once("ready",()=>{
  game.socket.on(`system.${SYSTEM_ID}`,receiveSocket);
  if(game.user.isGM)ui.notifications.info("BRUTAL RPG: game.brutal.installCatalogue() importa o catálogo de referência.");
});
