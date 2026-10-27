const f=foundry.data.fields;
const number=(initial=0, max=999)=>new f.NumberField({required:true,integer:true,min:0,max,initial});
const str=(initial="")=>new f.StringField({required:true,blank:true,initial});
const checkbox=(initial=false)=>new f.BooleanField({required:true,initial});
const pool=(initial,max)=>new f.SchemaField({value:number(initial,max), max:number(max,999)});
const conditions=()=>new f.SchemaField({
  ferida:number(0,99),sequela:number(0,99),condenacao:number(0,6),
  infeccao:number(0,6),maldicao:number(0,6),possessao:number(0,6)
});
class BaseActorData extends foundry.abstract.TypeDataModel {
  static defineSchema(){return {
    bio:str(),notes:str(), pool:pool(6,6), escape:pool(0,6),initiative:number(1,9),
    dead:checkbox(),conditions:conditions(),
  };}
}
export class SurvivorData extends BaseActorData{
  static defineSchema(){return {...super.defineSchema(),
    initiative:number(2,9),archetype:str("atleta"), tension:number(0,10),
    iconic:str(), bond:str(), darkDesire:str(), looks:str(),
    hiddenRole:str(), scars:str(),
    disabled:new f.SchemaField({
      desenrolado:checkbox(),firme:checkbox(),ligeiro:checkbox(),potente:checkbox(),sagaz:checkbox()
    }),
    escaped:checkbox(), sacrificeUsed:checkbox(),
  };}
}
export class KillerData extends BaseActorData{
  static defineSchema(){return {...super.defineSchema(),
    initiative:number(9,9),primary:str("brutamontes"),secondary:str("carniceiro"),horror:number(3,999),
    intent:str(),stigma:str(),secret:str(),distracted:number(0,20),freeScares:number(1,10)
  };}
}
export class BrutalItemData extends foundry.abstract.TypeDataModel{
  static defineSchema(){return {
    description:str(), page:number(0,999),cost:number(0,999),uses:pool(3,5),
    style:str(),scene:str(), recharge:str(), threatNb:number(0,3),
    hidden:checkbox(),notes:str()
  };}
}
