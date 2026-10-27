# BRUTAL RPG — Sistema comunitário para Foundry VTT

**Versão do pacote:** 0.1.0 (primeira adaptação funcional)
**Livro utilizado:** *BRUTAL RPG 0.3*, Léo “Craw” Naito, Bruce Barbosa e Thales “Bif” Cunha, Editora New Order.
**Alvo de implementação:** Foundry VTT 14, incluindo o build 14.369.
**Status de testes:** sintaxe JavaScript e verificações automatizadas do motor aprovadas; **ainda não foi possível executar uma sessão dentro de uma instalação real do Foundry 14.369**. Trata-se de uma versão inicial, não de um sistema oficial ou certificado.

> **Aviso de direitos autorais:** projeto de código independente e não oficial. Não contém o texto integral, as imagens originais, as páginas ou as fontes comerciais do livro. Consulte o exemplar legítimo para regras completas, descrições de habilidades e material editorial. Não há qualquer vínculo ou endosso da editora ou dos autores.

## Repositório e distribuição

- **Código-fonte:** https://github.com/tulioscost/brutal-rpg-nao-oficial
- **Pacote para Release `v0.1.0`:** `brutal-rpg-v0.1.0.zip` (conteúdo instalável, `system.json` na raiz)
- **Manifesto estável:** `https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json`
- **Publicação:** [docs/PUBLICACAO.md](docs/PUBLICACAO.md)
- **Compilação reprodutível do ZIP:** `python3 scripts/build_release.py`

## Instalação manual

1. Feche o Foundry VTT (ou interrompa seu servidor).
2. Abra a pasta de dados do Foundry. Dentro de `Data/systems`, crie uma pasta `brutal-rpg`.
3. Extraia o conteúdo de `brutal-rpg-v0.1.0.zip` **dentro dessa pasta**. O manifesto deve ficar em `Data/systems/brutal-rpg/system.json` (e não em subpasta dupla).
4. Inicie o Foundry 14.369, crie um Mundo e escolha o sistema **BRUTAL RPG — Sistema Comunitário**.
5. Como GM, execute a macro ou o comando `await game.brutal.installCatalogue();` no console do navegador (F12). Isso cria uma pasta com 90+ referências no diretório de Itens do Mundo.
6. Crie personagens nas fichas `sobrevivente` ou `assassino` pela aba de Atores.
7. Na ficha de Sobrevivente, selecione o Arquétipo e clique em **Aplicar 5 Vantagens do Arquétipo** e, em seguida, **Adicionar Habilidade Inicial**.
8. Na ficha do Assassino, escolha Ameaça Primária e Secundária; clique em **Calcular Pilhas Iniciais**, que também define o Assassino ativo.
9. Para iniciar um Encontro, use **Iniciar Encontro** na ficha do Assassino; para encerrá-lo, clique em **Encerrar Encontro**.

**Instalação por manifesto (após publicar os arquivos no GitHub):** no Foundry, escolha **Instalar Sistema** e informe:

`https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json`

O `system.json` na raiz do repositório aponta para o arquivo `brutal-rpg-v0.1.0.zip` da Release `v0.1.0`. **Esse link só funciona quando o código-fonte e a Release tiverem sido publicados**, com esses nomes exatos. Para publicação, consulte [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

## Recursos presentes

- Fichas próprias e responsivas para Sobrevivente e Assassino, em português, com estética slasher vermelha e preta.
- Oito Arquétipos, seus respectivos Estilos e iniciativa fixa.
- Treze Ameaças com Nível de Brutalidade correto, fórmulas de Pilha inicial, Horror, Fuga, Passos e Armadilhas.
- Modelo de dados de oito tipos de itens: Habilidade, Vantagem, Recurso, Pista, Ameaça, Ação, Apavoro e Condição.
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
- Construção de cenas, mapas, trilhas sonoras, baralho de Desafios, atores prontos e compêndios Foundry `.ldb`.
- Adaptações para habilidades excepcionais (p.ex., Final Girl ou Sacrifício Heroico), que podem modificar manobras comuns.

Nenhuma dessas funções é apresentada como totalmente automatizada nesta versão. O livro é a autoridade em situações divergentes.

## Macros

A pasta `macros` inclui seis scripts opcionais. No Foundry, crie uma Macro de tipo **Script**, copie seu conteúdo e coloque-a na barra de atalhos. Também é possível executá-los pelo console (F12).

## Comandos da API

```js
await game.brutal.installCatalogue(); // importa referências ao diretório de Itens
await game.brutal.startEncounter();     // encontro e pilhas de fuga
await game.brutal.endEncounter();       // devolve dados de fuga
await game.brutal.startSuspense();
await game.brutal.endSuspense();
await game.brutal.newSession();         // reinicia marcadores de sessão
```

## Testes locais

`node tests/smoke.mjs`

Os testes usam um ambiente simulado (sem servidor Foundry) para verificar fórmula NB, modelos de Arquétipos e lógica de rolagem, descarte, recuperação, Suspense e fuga.

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
