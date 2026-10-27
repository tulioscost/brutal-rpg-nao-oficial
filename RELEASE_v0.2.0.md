# BRUTAL RPG — Release v0.2.0

Atualização não oficial de BRUTAL RPG 0.3 para **Foundry VTT 14**, com foco na utilização das fichas e no conteúdo pronto para jogar.

## Alterações

- Retrato da ficha de Sobrevivente e Assassino agora **clicável**: o botão **Trocar foto** abre o seletor de arquivos do Foundry; a escolha altera retrato e imagem padrão do token.
- Layout responsivo com grades refluídas conforme a **largura real da ficha**, menus horizontais roláveis e foto sem redução exagerada em janelas estreitas.
- **20 Assassinos originais**, com biografia, 2 Ameaças compatíveis, estatísticas calculadas, intenções, estigma, pista, segredo e inventário narrativo.
- **24 Sobreviventes originais**, três para cada Arquétipo, com biografia, motivação, vínculos, Item Icônico e 2–3 objetos, limitando a um Recurso inicial ativo.
- **108 itens** independentes, incluindo 30 Recursos (3 usos), 21 Pistas (5 usos) e 57 Equipamentos narrativos (sem bônus próprio). Pistas especiais são conquistadas em jogo.
- Criação automática (primeira entrada da Diretora) de três **compêndios do Mundo**; comando e macro para reinstalar/atualizar conteúdos sem sobrescrever edições pessoais.
- Compêndios de Assassinos e Sobreviventes configurados inicialmente como privados, para preservar segredos narrativos.
- Tipagem `equipamento` e novos ícones vetoriais originais.
- Testes automatizados de compêndios, integridade de inventários, ameaças e fluxo de importação repetida.

## Instalação

1. Instale pelo manifesto: `https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json` (após publicar o repositório e a Release).
2. Ou extraia `brutal-rpg-v0.2.0.zip` em `Data/systems/brutal-rpg/`.
3. Ao abrir o Mundo como Diretora, os três compêndios serão criados automaticamente no **Mundo**, por meio do arquivo JSON entregue no ZIP.
4. Se necessário: `await game.brutal.installCompendiums();` no console como Diretora ou use a macro `07-instalar-compendios.js`.

**Arquivos a anexar separadamente na Release v0.2.0:** `brutal-rpg-v0.2.0.zip`, `system.json`, `RELEASE_v0.2.0.md`.

**Compatibilidade:** estrutura direcionada ao Foundry 14.369; teste final no aplicativo ainda pendente. Verificações estáticas e testes em mocks **não substituem** a instalação real.

**Aviso:** adaptação comunitária independente; personagens, histórias, inventários e ícones novos são criações originais. As regras, os nomes de Arquétipos/Ameaças e as mecânicas derivam do manual **BRUTAL RPG 0.3**; consulte o livro original. Não inclui conteúdo editorial integral nem artes do livro.
