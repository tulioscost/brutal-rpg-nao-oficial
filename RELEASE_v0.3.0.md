# BRUTAL RPG — Release v0.3.0

**Adaptação comunitária não oficial de BRUTAL RPG 0.3.**

## Correções

- Corrigida a ficha de Ator (Sobrevivente e Assassino) para Foundry VTT 14: as 27 ações `data-action` agora são registradas explicitamente no ciclo de `ApplicationV2`.
- Alterados os chamados de janelas para a forma suportada por `ApplicationV2`: `render({force:true})`.
- Aprimorado o layout responsivo da ficha e os limites de largura em janelas estreitas.
- A seleção de retrato atualiza a imagem do Ator e o token protótipo. A ficha de Item também permite trocar seu ícone.

## 152 artes e ícones exclusivos

- 20 retratos de Assassinos, baseados em uma ilustração original em mosaico, recortados e exportados individualmente (WebP).
- 24 retratos vetoriais ilustrados de Sobreviventes, diferenciados por cores, roupas, cabelo, fisionomia e acessórios (WebP).
- 108 ícones de itens em SVG, diferenciados por objetos, composição visual e legenda, com associação direta ao nome do item.
- Os inventários embutidos nas fichas do compêndio usam as mesmas artes dos itens correspondentes.

## Migração de compêndios existentes

Na primeira abertura do mundo pela Diretora, o sistema instala e atualiza as imagens padrão dos compêndios `BRUTAL | Assassinos`, `BRUTAL | Sobreviventes` e `BRUTAL | Itens`, sem duplicar registros e sem substituir imagens personalizadas. Também é possível atualizar manualmente no console (F12):

```javascript
await game.brutal.installCompendiums();
```

Registros que já foram importados para a aba Atores, fora dos compêndios, podem preservar suas imagens antigas; a Diretora pode trocar os retratos na ficha. A migração atualiza os três compêndios de Mundo sem apagar biografias ou edições de personagens.

## Instalação

Na aba **Sistemas de Jogo** do Foundry VTT, use **Instalar sistema** e informe:

`https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json`

Para instalação manual, descompacte `brutal-rpg-v0.3.0.zip` na pasta `Data/systems/brutal-rpg` — o arquivo `system.json` deve ficar na raiz da pasta.

## Arquivos da Release

1. `brutal-rpg-v0.3.0.zip` — pacote instalável do sistema.
2. `system.json` — manifesto do Foundry.
3. `RELEASE_v0.3.0.md` — estas notas.

**Importante:** versão com verificações automatizadas de sintaxe, preparação de dados e existência de artes. Ainda não validada dentro do Foundry VTT 14.369. Requer o livro original para consulta das regras.
