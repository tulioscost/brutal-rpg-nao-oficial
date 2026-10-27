## v0.4.1 — Correção da abertura das fichas (Foundry 14.369)

- Corrige falha de construção `TypeError: Cannot add property minWidth, object is not extensible`.
- Remove `minWidth` e `minHeight` de `BrutalActorSheet.DEFAULT_OPTIONS.position`; mantém tamanho padrão e layout responsivo CSS.
- Amplia diagnóstico para indicar fase da falha e chaves de `position`.
- Adiciona teste de regressão com opções de posição não-extensíveis.
- Preserva módulos obrigatórios, dado ilustrado e 152 artes dos compêndios.
- Testes locais aprovados; validação no aplicativo Foundry continua pendente.

# Alterações BRUTAL RPG

## v0.4.0 — 2026-10-27
- Dice Tray e Dice So Nice declarados como dependências obrigatórias (`relationships.requires`).
- Dados 3D d6 com seis imagens distintas 256×256; as faces de 1 a 6 coincidem com os resultados.
- Preset registrado com API oficial `diceSoNiceReady`, com compatibilidade para API legada e inicialização idempotente.
- Aplicação automática de `appearance.system` nos d6 do sistema, Dice Tray e comandos `/roll`.
- Revisão da montagem dos templates em `ActorSheetV2` / `ItemSheetV2`, evitando `root:true` no formulário.
- Macro e comando de diagnóstico da abertura de fichas, reportando o erro de execução do Foundry.
- Mantidos os 3 compêndios, 152 ilustrações, macros e regras anteriores.
- Testes locais: todas as validações de scripts, arte, regras e dependências aprovadas; execução real no Foundry ainda pendente.

## v0.3.0

- Registro explícito de ações e abertura de janelas com API `ApplicationV2`.
- Correção e testes simulados da preparação da ficha de Ator.
- Interface de troca de imagem do Item, ajustes responsivos das fichas.
- 152 imagens individuais e atualização não destrutiva dos acervos existentes.

# 0.2.0 — 27/10/2026

- Retratos trocáveis via FilePicker V14 e novo padrão de token.
- Layout responsivo por container queries, sem miniaturização excessiva.
- Importação automática de 3 compêndios de Mundo (20 assassinos, 24 sobreviventes, 108 itens).
- Novos modelos de Equipamento, histórias originais e recursos conforme BRUTAL 0.3.
- Macros, documentação e testes de compêndios.

# Histórico de versões

## [0.1.0] — Primeira versão comunitária

- Fichas responsivas de Sobrevivente e Assassino.
- Implementação inicial de testes de d6, pilhas, manobras, Encontros e Suspenses.
- Oito arquétipos e treze tipos de Ameaças como referências mecânicas.
- Itens, macros auxiliares e catálogo referencial.
- Links para instalação e atualização por manifesto via GitHub Releases.

**Limitação:** os testes automatizados foram executados fora do Foundry; ainda não existe certificação de execução em um mundo real da versão 14.369. Consulte o README para o escopo não automatizado.
