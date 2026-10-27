# BRUTAL RPG v0.4.1 — Hotfix da ficha de Ator

**Correção:** a ficha não abria no Foundry 14.369 e mostrava `TypeError: Cannot add property minWidth, object is not extensible` na inicialização de `BrutalActorSheet`. Foram retiradas as propriedades não aceitas `minWidth` e `minHeight` do bloco `position` de `ApplicationV2`.

## Incluído nesta versão

- Construção de fichas de Sobrevivente e Assassino com `position` compatível com a API do Foundry 14.
- Teste automatizado de regressão específico para o erro reportado no Console (F12).
- Diagnóstico mais preciso: `await game.brutal.diagnoseActorSheet();` exibe a fase da falha e as propriedades de posicionamento.
- Permanecem o d6 visual (6 faces próprias), a integração com Dice So Nice, a dependência de Dice Tray e os compêndios ilustrados com 20 Assassinos, 24 Sobreviventes e 108 itens.

## Instalação e verificação

1. Publique o código na branch `main` de `tulioscost/brutal-rpg-nao-oficial`.
2. Crie a Release de tag `v0.4.1` e anexe separadamente `brutal-rpg-v0.4.1.zip`, `system.json` e `RELEASE_v0.4.1.md`.
3. Atualize o sistema pelo Foundry, reinicie o aplicativo e entre no Mundo.
4. Tente abrir uma ficha. Para confirmar o diagnóstico use o Console (F12):
   `await game.brutal.diagnoseActorSheet();`

**Observação:** os testes de JavaScript e a reprodução da causa passaram em ambiente simulado; a abertura visual no Foundry 14.369 precisa ser testada no aplicativo. Não é uma versão oficial do livro.
