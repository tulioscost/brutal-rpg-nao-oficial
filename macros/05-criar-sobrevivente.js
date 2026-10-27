const actor=await Actor.create({name:"Nova Sobrevivente",type:"sobrevivente",img:"systems/brutal-rpg/assets/logo.svg"});
await actor.sheet.render(true);
