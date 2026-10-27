## Atualização v0.3.0 — ficha de Ator e imagens individuais

- Fichas de Sobrevivente e Assassino com 27 ações registradas explicitamente em `ApplicationV2` (Foundry VTT v14); a interface usa `render({force:true})` para os seletores/janelas.
- Troca de retratos na ficha: clique em **TROCAR FOTO** para selecionar imagem e atualizar o token protótipo; a ficha do Item também disponibiliza **TROCAR ÍCONE**.
- 152 novas imagens locais em `assets/compendios/`: 20 Assassinos (WebP), 24 Sobreviventes (WebP) e 108 itens (SVG com ilustração pertinente).
- Instalação/reinstalação com migração seletiva: itens e retratos antigos com ícones genéricos são atualizados, enquanto imagens alteradas pela Diretora são preservadas.
- Para executar novamente a migração: `await game.brutal.installCompendiums()`.

**Limitação:** testes de desenvolvimento não substituem validação no cliente do Foundry 14.369.

# BRUTAL RPG — Sistema comunitário para Foundry VTT

**Versão do pacote:** 0.2.0 (fichas responsivas e compêndios originais)
**Livro utilizado:** *BRUTAL RPG 0.3*, Léo “Craw” Naito, Bruce Barbosa e Thales “Bif” Cunha, Editora New Order.
**Alvo de implementação:** Foundry VTT 14, incluindo o build 14.369.
**Status de testes:** sintaxe JavaScript e verificações automatizadas do motor aprovadas; **ainda não foi possível executar uma sessão dentro de uma instalação real do Foundry 14.369**. Trata-se de uma versão inicial, não de um sistema oficial ou certificado.

> **Aviso de direitos autorais:** projeto de código independente e não oficial. Não contém o texto integral, as imagens originais, as páginas ou as fontes comerciais do livro. Consulte o exemplar legítimo para regras completas, descrições de habilidades e material editorial. Não há qualquer vínculo ou endosso da editora ou dos autores.

## Repositório e distribuição

- **Código-fonte:** https://github.com/tulioscost/brutal-rpg-nao-oficial
- **Assets da Release `v0.2.0`:** `brutal-rpg-v0.2.0.zip` (instalável), `system.json` (manifesto) e `RELEASE_v0.2.0.md` (notas)
- **Manifesto estável:** `https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json`
- **Publicação:** [docs/PUBLICACAO.md](docs/PUBLICACAO.md)
- **Compilação reprodutível do ZIP:** `python3 scripts/build_release.py`

## Instalação manual

1. Feche o Foundry VTT (ou interrompa seu servidor).
2. Abra a pasta de dados do Foundry. Dentro de `Data/systems`, crie uma pasta `brutal-rpg`.
3. Extraia o conteúdo de `brutal-rpg-v0.2.0.zip` **dentro dessa pasta**. O manifesto deve ficar em `Data/systems/brutal-rpg/system.json` (e não em subpasta dupla).
4. Inicie o Foundry 14.369, crie um Mundo e escolha o sistema **BRUTAL RPG — Sistema Comunitário**.
5. Na primeira entrada como Diretora, três compêndios serão criados no Mundo automaticamente: **BRUTAL | Assassinos**, **BRUTAL | Sobreviventes** e **BRUTAL | Itens**. Para reinstalar sem duplicar, execute `await game.brutal.installCompendiums();` pelo console (F12) ou pela macro 07. O comando `installCatalogue()` permanece disponível para importar referências do manual em pasta separada.
6. Crie personagens nas fichas `sobrevivente` ou `assassino` pela aba de Atores.
7. Na ficha de Sobrevivente, selecione o Arquétipo e clique em **Aplicar 5 Vantagens do Arquétipo** e, em seguida, **Adicionar Habilidade Inicial**.
8. Na ficha do Assassino, escolha Ameaça Primária e Secundária; clique em **Calcular Pilhas Iniciais**, que também define o Assassino ativo.
9. Para iniciar um Encontro, use **Iniciar Encontro** na ficha do Assassino; para encerrá-lo, clique em **Encerrar Encontro**.

**Instalação por manifesto (após publicar os arquivos no GitHub):** no Foundry, escolha **Instalar Sistema** e informe:

`https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json`

O `system.json` na raiz do repositório aponta para o arquivo `brutal-rpg-v0.2.0.zip` da Release `v0.2.0`. **Esse link só funciona quando o código-fonte e a Release tiverem sido publicados**, com esses nomes exatos. Para publicação, consulte [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

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
