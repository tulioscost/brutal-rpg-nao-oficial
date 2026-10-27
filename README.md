# Atualização v0.4.1 — correção da abertura das fichas

A falha `Cannot add property minWidth, object is not extensible` observada no Foundry 14.369 foi corrigida na configuração do `ActorSheetV2` (veja a seção **Correção da ficha v0.4.1**).

## Recursos anteriores (v0.4.0) — fichas e dados 3D obrigatórios

**Compatibilidade declarada:** Foundry VTT 14 (alvo 14.369). **Não validado em instância licenciada real**; verificações locais de JavaScript, integração simulada e estrutura de arquivos foram aprovadas.

## Instalação de dependências obrigatórias

Instale e habilite no Mundo antes de criar ou abrir fichas:
- **Dice Tray (dice-calculator)** — https://foundryvtt.com/packages/dice-calculator (v4.0.0 ou superior)
- **Dice So Nice! (dice-so-nice)** — https://foundryvtt.com/packages/dice-so-nice (v6.0.0 ou superior)

Ambos constam de `system.json` em `relationships.requires`, o mecanismo formal de dependências do Foundry. Os módulos são aplicativos de terceiros e não estão distribuídos neste repositório.

## Dado 3D automático do BRUTAL

O sistema registra no evento `diceSoNiceReady` um preset **BRUTAL — D6 Slasher** (`brutal-rpg-cinema`) para d6. Cada resultado de 1–6 tem uma imagem própria em `assets/d6/face-1.webp` ... `face-6.webp` (256×256). As rolagens `d6` iniciadas pelo motor do BRUTAL recebem a aparência personalizada automaticamente por `die.options.appearance.system`. O evento `diceSoNiceRollStart` aplica a mesma aparência aos d6 da Dice Tray e de comandos `/roll`, sem rolar novamente nem duplicar mensagens. O Dice So Nice anima as rolagens normais publicadas no chat; **os valores e probabilidades NÃO são alterados**. O preset aparece também no seletor de visuais do módulo. As preferências pessoais de outros sistemas podem continuar distintas.

## Fichas v14 e diagnóstico

- Partes Handlebars são inseridas no **formulário** administrado por `ActorSheetV2`/`ItemSheetV2`, sem marcar `root: true` sobre um `<section>` interno. Esse ajuste visa evitar falhas de renderização.
- Abertura forçada para verificação: `await game.brutal.diagnoseActorSheet()` (ou `macros/08-diagnosticar-ficha.js`).
- Para diagnóstico com um ID: `await game.brutal.diagnoseActorSheet("ID-DO-ATOR")`. A função imprime os detalhes do erro no **Console do navegador (F12)**.
- Caso uma ficha antiga esteja selecionada, abra suas opções de configuração e selecione a ficha **BRUTAL**. Se persistir após instalar a v0.4.1, copie o erro completo do Console. Sem o log da execução real, a causa precisa não pode ser assegurada.

## Distribuição

A Release **v0.4.1** contém: `brutal-rpg-v0.4.1.zip`, `system.json`, `RELEASE_v0.4.1.md`. O primeiro é o ZIP instalável; os três devem ser anexados separadamente à Release de tag `v0.4.1`.

---

# BRUTAL RPG — Sistema comunitário para Foundry VTT

**Versão do pacote:** 0.4.1 (correção de construção da ficha no Foundry 14)
**Livro utilizado:** *BRUTAL RPG 0.3*, Léo “Craw” Naito, Bruce Barbosa e Thales “Bif” Cunha, Editora New Order.
**Alvo de implementação:** Foundry VTT 14, incluindo o build 14.369.
**Status de testes:** sintaxe JavaScript e verificações automatizadas do motor aprovadas; **ainda não foi possível executar uma sessão dentro de uma instalação real do Foundry 14.369**. Trata-se de uma versão inicial, não de um sistema oficial ou certificado.

> **Aviso de direitos autorais:** projeto de código independente e não oficial. Não contém o texto integral, as imagens originais, as páginas ou as fontes comerciais do livro. Consulte o exemplar legítimo para regras completas, descrições de habilidades e material editorial. Não há qualquer vínculo ou endosso da editora ou dos autores.

## Repositório e distribuição

- **Código-fonte:** https://github.com/tulioscost/brutal-rpg-nao-oficial
- **Assets da Release `v0.4.1`:** `brutal-rpg-v0.4.1.zip` (instalável), `system.json` (manifesto) e `RELEASE_v0.4.1.md` (notas)
- **Manifesto estável:** `https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json`
- **Publicação:** [docs/PUBLICACAO.md](docs/PUBLICACAO.md)
- **Compilação reprodutível do ZIP:** `python3 scripts/build_release.py`

## Instalação manual

1. Feche o Foundry VTT (ou interrompa seu servidor).
2. Abra a pasta de dados do Foundry. Dentro de `Data/systems`, crie uma pasta `brutal-rpg`.
3. Extraia o conteúdo de `brutal-rpg-v0.4.1.zip` **dentro dessa pasta**. O manifesto deve ficar em `Data/systems/brutal-rpg/system.json` (e não em subpasta dupla).
4. Inicie o Foundry 14.369, crie um Mundo e escolha o sistema **BRUTAL RPG — Sistema Comunitário**.
5. Na primeira entrada como Diretora, três compêndios serão criados no Mundo automaticamente: **BRUTAL | Assassinos**, **BRUTAL | Sobreviventes** e **BRUTAL | Itens**. Para reinstalar sem duplicar, execute `await game.brutal.installCompendiums();` pelo console (F12) ou pela macro 07. O comando `installCatalogue()` permanece disponível para importar referências do manual em pasta separada.
6. Crie personagens nas fichas `sobrevivente` ou `assassino` pela aba de Atores.
7. Na ficha de Sobrevivente, selecione o Arquétipo e clique em **Aplicar 5 Vantagens do Arquétipo** e, em seguida, **Adicionar Habilidade Inicial**.
8. Na ficha do Assassino, escolha Ameaça Primária e Secundária; clique em **Calcular Pilhas Iniciais**, que também define o Assassino ativo.
9. Para iniciar um Encontro, use **Iniciar Encontro** na ficha do Assassino; para encerrá-lo, clique em **Encerrar Encontro**.

**Instalação por manifesto (após publicar os arquivos no GitHub):** no Foundry, escolha **Instalar Sistema** e informe:

`https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json`

O `system.json` na raiz do repositório aponta para o arquivo `brutal-rpg-v0.4.1.zip` da Release `v0.4.1`. **Esse link só funciona quando o código-fonte e a Release tiverem sido publicados**, com esses nomes exatos. Para publicação, consulte [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

## Recursos presentes

- Fichas próprias e responsivas para Sobrevivente e Assassino, em português, com estética slasher vermelha e preta; retrato alterável pelo botão **Trocar foto** e atualização da imagem padrão do token.
- Compêndios de Mundo com **20 Assassinos**, **24 Sobreviventes** e **108 Itens** originais, com histórias, segredos, pistas e equipamentos, estruturados em JSON e instalados automaticamente pela primeira Diretora.
- Quarto tipo de Item: **Equipamento**, objeto narrativo sem bônus automático; a norma de um Recurso por Sobrevivente é respeitada nas fichas pré-prontas.
- Oito Arquétipos, seus respectivos Estilos e iniciativa fixa.
- Treze Ameaças com Nível de Brutalidade correto, fórmulas de Pilha inicial, Horror, Fuga, Passos e Armadilhas.
- Modelo de dados de nove tipos de itens: Habilidade, Vantagem, Recurso, Pista, Ameaça, Ação, Apavoro, Condição e Equipamento.
- Catálogo de referência com 48 nomes de Habilidades (6 por Arquétipo, sendo a sexta uma Cicatriz), além de vantagens, ações, ameaças, condições, estilos e manobras.
- Rolagens d6 com dificuldade padrão 4, dificuldade reduzida por Estilo, Recursos e Testes Complexos.
- Consequências automáticas de falhas: sacrificar à Diretora em Cena Livre/Suspense; descartar em Encontro/Susto.
- Pontos de Tensão automáticos por sucessos excedentes, até 10, e controle de Pontos de Horror.
- Pilhas de Intérprete, Diretora, Descarte e Fuga sincronizadas pelo GM conectado.
- Manobras: Vazar Dali, Partir pra Cima, Ajudar Alguém, Distrair, Recuperar Fôlego e Arriscar Tudo.
- Controles de Suspense: início/fim, Passos, Armadilhas, rodadas, três Abordagens e recompensa por Passos.
- Ações gerais operacionalizadas: Assustar, Ferir, Matar e Escapar.
- Condições e Dados Marcadores; Ferida acumulada em 6 provoca morte; Sequela cumulativa.
- Criação de Pistas do Mundo quando a Pilha da Diretora chega a zero em Encontro.
- Logs detalhados no chat; dados rolados via API nativa do Foundry (outros módulos visuais de dados são opcionais).

## O que ainda requer atuação manual da Diretora

- Efeitos particulares de todas as 48 Habilidades, 13 Estigmas, Intentos, Apavoros e Ações Únicas.
- Seleção e consequências de Armadilhas, Caminhos e Recompensas de Suspense.
- Rito de Iniciação, Clamores e Funções Ocultas; o campo de Função Oculta é visível apenas à GM na ficha.
- Regras avançadas de Feridas, Sequelas, Condenações, Infecções, Maldições e Possessões.
- Aplicação de restrições narrativas e do limite de um Recurso comum por Sobrevivente.
- Construção de cenas, mapas, trilhas sonoras, baralho de Desafios e compêndios pré-empacotados em `.ldb`: nesta versão os compêndios são **criados no banco do Mundo**, a partir de JSON do sistema, no primeiro acesso da Diretora.
- Adaptações para habilidades excepcionais (p.ex., Final Girl ou Sacrifício Heroico), que podem modificar manobras comuns.

Nenhuma dessas funções é apresentada como totalmente automatizada nesta versão. O livro é a autoridade em situações divergentes.

## Macros

A pasta `macros` inclui sete scripts opcionais, incluindo a instalação/atualização dos compêndios. No Foundry, crie uma Macro de tipo **Script**, copie seu conteúdo e coloque-a na barra de atalhos. Também é possível executá-los pelo console (F12).

## Comandos da API

```js
await game.brutal.installCatalogue(); // importa referências ao diretório de Itens
await game.brutal.installCompendiums(); // cria/atualiza 3 compêndios do Mundo
await game.brutal.startEncounter();     // encontro e pilhas de fuga
await game.brutal.endEncounter();       // devolve dados de fuga
await game.brutal.startSuspense();
await game.brutal.endSuspense();
await game.brutal.newSession();         // reinicia marcadores de sessão
```

## Testes locais

`node tests/smoke.mjs`

Os testes usam ambiente simulado (sem servidor Foundry) para verificar fórmula NB, modelos de Arquétipos, rolagem, descarte, recuperação, Suspense, fuga e os três compêndios, incluindo importação sem duplicação: `node tests/smoke.mjs && node tests/compendiums.mjs`.

## Arquitetura

- `system.json` — manifesto v14;
- `brutal.mjs` — registro dos DataModels e das fichas v2;
- `module/models.mjs` — `TypeDataModel`;
- `module/sheets.mjs` — `ActorSheetV2` e `ItemSheetV2`;
- `module/rules.mjs` — motor de testes e estado compartilhado;
- `module/constants.mjs` — tabelas e fórmulas;
- `module/catalogue.mjs` — criação de itens de referência;
- `templates/` e `styles/` — interface Handlebars/CSS;
- `assets/` — SVGs originais, sem imagens retiradas do livro;
- `tests/` — testes independentes de Foundry.

## Compêndios e retratos (v0.2.0)

- **Assassinos**: 20 fichas prontas; historia, estigma, intentos, segredo da Diretora, pista, Ameaças e objetos. Privado para GM por padrão.
- **Sobreviventes**: 24 fichas prontas, 3 por Arquétipo; história, Item Icônico, vínculo, desejo, segredo da Diretora e inventário. Privado para GM por padrão (para não revelar segredos); importe personagens ao Mundo para compartilhá-los.
- **Itens**: 108 entradas: Recursos (3 usos), Pistas (5 usos compartilhados) e Equipamentos (0 usos, uso narrativo). A Diretora administra os limites e a obtenção de Pistas.

**Importante:** os três pacotes são *compêndios do Mundo*, gerados pelo próprio Foundry com os arquivos da pasta `data/compendios`. Não se trata de arquivos LevelDB (`.ldb`) pré-empacotados. A criação é automática na primeira entrada de um GM ativo; o botão **Instalar / Atualizar Compêndios** na aba Itens e a macro `07-instalar-compendios.js` podem repetir a importação, preservando personagens já modificados. Como compêndios do Mundo, persistem independentemente da versão instalada do sistema.

**Troca de retrato:** clique em **Trocar foto** no canto inferior da imagem da ficha; use o seletor do Foundry para escolher ou enviar o arquivo. A imagem é salva em `actor.img` e na textura do protótipo do token. Personagens importados com retrato personalizado preservam a imagem ao atualizar os acervos (não são sobrescritos).

**Pesquisa e inspiração:** consulte [docs/REFERENCIAS.md](docs/REFERENCIAS.md). Todos os perfis têm identidade, biografia e equipamentos originais; não reproduzem personagens de filmes, livros ou jogos.


## Correção da ficha v0.4.1

O diagnóstico do Foundry 14.369 identificou `TypeError: Cannot add property minWidth, object is not extensible` durante `new BrutalActorSheet`. A causa era `position.minWidth` (e `position.minHeight`) em `static DEFAULT_OPTIONS`. Os campos foram removidos; foram mantidos somente `position.width` e `position.height`, conforme a API `ApplicationV2`. A responsividade continua definida em CSS. O teste `node tests/sheets.mjs` agora simula a mesclagem de opções de posição de um objeto não-extensível para evitar reincidência.

**Validação ainda pendente:** a correção foi reproduzida e testada com simulação; não foi possível abrir a interface em um Foundry 14.369 real neste ambiente. Após atualizar, execute `await game.brutal.diagnoseActorSheet()` no Console para confirmar a janela. Esse comando agora informa também a fase da falha.
