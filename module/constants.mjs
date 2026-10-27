export const SYSTEM_ID = "brutal-rpg";
export const STYLES = ["desenrolado", "firme", "ligeiro", "potente", "sagaz"];
export const ARCHETYPES = {
  heroina: {label:"Heroína", initiative:1, styles:["potente","sagaz"], page:66},
  atleta: {label:"Atleta", initiative:2, styles:["ligeiro","potente"], page:60},
  valentona: {label:"Valentona", initiative:3, styles:["firme","potente"], page:74},
  esbelta: {label:"Esbelta", initiative:4, styles:["desenrolado","firme"], page:64},
  inocente: {label:"Inocente", initiative:5, styles:["desenrolado","sagaz"], page:68},
  nerd: {label:"Nerd", initiative:6, styles:["ligeiro","sagaz"], page:70},
  relaxada: {label:"Relaxada", initiative:7, styles:["ligeiro","desenrolado"], page:72},
  cetica: {label:"Cética", initiative:8, styles:["firme","sagaz"], page:62}
};
export const THREATS = {
  amaldicoado:{label:"Amaldiçoado",nb:2,page:117},
  assombracao:{label:"Assombração",nb:2,page:119},
  brutamontes:{label:"Brutamontes",nb:3,page:121},
  carniceiro:{label:"Carniceiro",nb:3,page:123},
  desconhecido:{label:"Desconhecido",nb:1,page:125},
  descontrolado:{label:"Descontrolado",nb:3,page:127},
  estrategico:{label:"Estratégico",nb:1,page:129},
  inato:{label:"Inato",nb:2,page:131},
  maquina:{label:"Máquina",nb:2,page:133},
  mestre:{label:"Mestre",nb:1,page:135},
  monstruosidade:{label:"Monstruosidade",nb:3,page:137},
  obstinado:{label:"Obstinado",nb:2,page:139},
  perseguidor:{label:"Perseguidor",nb:2,page:141}
};
export const MOVES = {
  vazar:{label:"Vazar Dali",style:"ligeiro",page:99},
  partir:{label:"Partir pra Cima",style:"potente",page:99},
  ajudar:{label:"Ajudar Alguém",style:"sagaz",page:100},
  distrair:{label:"Distrair",style:"desenrolado",page:100},
  folego:{label:"Recuperar Fôlego",style:"firme",page:100},
  arriscar:{label:"Arriscar Tudo",style:null,page:100}
};
export const GENERAL_ADVANTAGES = [
  {name:"Choque de Realidade",cost:6, description:"Recupera um dado para a Pilha de Intérprete.",page:78},
  {name:"Tomar Jeito",cost:3, description:"Recupera um Estilo incapacitado.",page:78},
  {name:"Tratar Feridas",cost:0, description:"Gasta PT para reduzir Feridas; consulte o manual para Sequelas e recursos.",page:78},
];
export const STYLE_ADVANTAGES = [
  {name:"Compartilhar Forças",style:"desenrolado",cost:0,page:79},
  {name:"Preparar para o Pior",style:"firme",cost:2,page:79},
  {name:"Planejar Fuga",style:"ligeiro",cost:3,page:79},
  {name:"Aquecer",style:"potente",cost:3,page:79},
  {name:"Caçar Recursos",style:"sagaz",cost:4,page:79}
];
export const CONDITIONS = ["ferida", "sequela", "condenacao", "infeccao", "maldicao", "possessao"];
export function killerStats(primary, secondary) {
  const one=THREATS[primary]?.nb ?? 1, two=THREATS[secondary]?.nb ?? 1;
  const max=Math.max(one,two),total=one+two;
  return {one,two,total, initialDice:total, initialHorror:one,escape:max+1,steps:4-max,traps:7-total,freeScares:7-total,clues:max};
}
export const titleCase = s => s.charAt(0).toLocaleUpperCase("pt-BR")+s.slice(1);

export const ARCHETYPE_ABILITIES = {
  atleta:["Adrenalina","Coach de Equipe","Home Run","Superação","Resiliência","Hora da Revanche"],
  cetica:["Benefício da Dúvida","Noção Aguçada","Pé no Chão","Positividade Tóxica","Questionadora","Foco no Agora"],
  esbelta:["Berço de Ouro","Egocêntrica","Estrelinha","Patricinha","Pose Impecável","Ícone da Vez"],
  heroina:["Abre Alas","Até o Fim","Companheirismo","Farol","Sacrifício Heroico","Pedra no Sapato"],
  inocente:["Carência","Cobaia","Final Girl","Força de Vontade","Sorte de Principiante","Pureza de Espírito"],
  nerd:["Cola Amiga","Fé nas Malucas","Hipótese","Memória Fotográfica","Revelação","Análise Obstinada"],
  relaxada:["Cabeça na Lua","Olé","Trapalhada","Uni-Duni-Tê","Versátil","Tensão Aliviada"],
  valentona:["Babaca","Cabeça Dura","Cara Lavada","Casca Grossa","Nem Fodendo","Ponto Fraco"]
};
