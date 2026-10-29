# BRUTAL RPG — Release v0.5.7

## Correções

- **Ícones da sidebar visíveis:** removidos estilos `::before` que substituíam glifos Font Awesome por decorações vazias e a regra `font-size: 0` que escondia pictogramas.
- **Botões VHS mantidos:** plástico preto e iluminação preservados; não são adicionados símbolos artificiais que poderiam trocar o significado das funções do Foundry.
- **Foto do Ator em tamanho 2×:** retrato ampliado de 126×146 para 252×292 pixels em fichas de Sobrevivente e Assassino; layout ajustável em janelas estreitas (208×244 px abaixo de 760 px).
- **Imagem editável:** mantém a opção de trocar o retrato e o efeito de câmera de segurança.
- Sem alterações nas regras, dados e compêndios.

## Publicação

Anexar separadamente à Release com tag `v0.5.7`:

- `brutal-rpg-v0.5.7.zip`
- `system.json`
- `RELEASE_v0.5.7.md`

O repositório `main` também deve conter o `system.json` com `version: 0.5.7` e o `download` apontando para a Release.

## Verificação no Foundry

Feche e reabra o mundo depois da atualização, pressione `Ctrl+F5`, confira a sidebar e abra um Ator. Os testes automatizados de CSS, sintaxe e empacotamento não substituem o teste no Foundry 14.369.
