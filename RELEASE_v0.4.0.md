# BRUTAL RPG — Release v0.4.0

**Adaptação não oficial | Foundry VTT 14 (alvo 14.369)**

## Correções da ficha de Ator
- Templates de Ator e Item migrados para partes internas do formulário de `ActorSheetV2`/`ItemSheetV2`, sem `root:true` sobre um elemento `<section>`.
- Proteções adicionais de dados e contexto na preparação da ficha.
- Macro `08-diagnosticar-ficha.js` e comando `await game.brutal.diagnoseActorSheet()` para isolar falhas restantes e capturar o erro do Foundry.

## Dependências obrigatórias
- Dice Tray — `dice-calculator` (v4.0+)
- Dice So Nice! — `dice-so-nice` (v6.0+)

Instale e habilite os dois módulos antes de usar o Mundo. Declarados como `relationships.requires` no manifesto.

## D6 BRUTAL (Dice So Nice)
- Seis faces distintas, vinculadas respectivamente aos números **1, 2, 3, 4, 5 e 6**.
- Texturas 256 × 256 em WebP; ambientação slasher em preto/vermelho.
- Preset automático `BRUTAL — D6 Slasher` no evento `diceSoNiceReady`.
- Aparência aplicada automaticamente a cada rolagem d6 do motor, da Dice Tray ou do comando `/roll` por meio do hook oficial, mesmo quando o jogador já escolheu outro conjunto de dados.
- Não altera valores, probabilidades ou regras.

## Preservado
- 20 Assassinos, 24 Sobreviventes, 108 itens com arte própria.
- Inventários, macros, rolagens, Suspenses, Encontros e privacidade dos compêndios.

## Status
Verificações de lógica, sintaxe, mapeamento de faces e estrutura do sistema concluídas. **Não foi possível testar a execução dentro do aplicativo Foundry 14.369.** Caso a ficha ainda não abra, execute a macro de diagnóstico e capture a saída do console (F12).

## Assets desta Release
1. `brutal-rpg-v0.4.0.zip` — instalador;
2. `system.json` — manifesto;
3. `RELEASE_v0.4.0.md` — estas notas.
