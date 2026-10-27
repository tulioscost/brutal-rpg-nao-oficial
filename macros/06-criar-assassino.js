const actor=await Actor.create({name:"Novo Assassino",type:"assassino",img:"systems/brutal-rpg/assets/logo.svg",ownership:{default:0}});
await game.brutal.resetKiller(actor);
await actor.sheet.render(true);
