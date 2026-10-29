## v0.5.4
- Novo hook de chat do Foundry 14 e classe de mensagem própria.
- Skin de rolagens e sidebar com CSS isolado e carregado por último.
- Corrigida a faixa decorativa da sidebar para não deslocar as abas.
- Adicionados testes automatizados para mensagens comuns e testes do sistema.

# Changelog

## v0.5.5
- Sidebar, chat e botões do Dice Tray reformulados para parecerem botões de videocassete.
- Campos de entrada do chat e do Dice Tray agora simulam visores digitais esverdeados.
- Estados hover/active com relevo e pressão física inspirados em aparelhos VHS.

## v0.5.3
- Estética BRUTAL aplicada às rolagens e resultados do chat.
- Sidebar inteira do Foundry restilizada para combinar com a interface trash/VHS.
- Inclusão de splash art definitiva e atualização do background do sistema.

## v0.5.2
- Retrato com sobreposição de câmera de segurança, scanlines e baixa fidelidade.
- Mensagens do chat reformuladas para a mesma estética trash/VHS do sistema.
- Inclusão automática da classe visual do BRUTAL nas mensagens geradas pelo sistema.

## v0.5.1
- Ajuste do layout para aderir diretamente ao mockup de referência da estética trash/VHS.
- Inclusão de faixa lateral de locadora, etiquetas coladas e tagline de baixo orçamento nas fichas.
- Refino visual das fichas de ator e item com base nas imagens de referência geradas.

## v0.5.0
- Nova identidade visual inspirada em filme trash, pôster de VHS e locadora.
- Fundo envelhecido com textura de cartaz rasgado e granulação analógica.
- Fichas e janelas de itens com aparência grosseira, desgastada e de papel amarelado.
- Painéis, abas, botões e campos reformulados em estilo grindhouse.
- Mantidas as correções de ficha, compêndios, integrações e artes das versões anteriores.

## 0.4.3 — Ícones dos 108 itens

- 108 WEBPs 512x512 próprios, com arte não violenta de objetos.
- Migração conservadora de ícones padrão SVG já importados e de inventários embutidos.
- Preserva imagens personalizadas do usuário.

## v0.4.2 — 24 novos retratos das Sobreviventes

# BRUTAL RPG — Release v0.4.2

## Novidade

- Substituição das artes anteriores dos **24 atores do compêndio de Sobreviventes**, agora com retratos cinematográficos originais, diferentes entre si e identificados por nome e profissão.
- Cada retrato em WEBP 512 × 512, compatível com miniaturas de ficha e token.
- Mantidos os nomes, as histórias, os Arquétipos, os inventários e os identificadores dos personagens existentes.
- Mantidos 20 Assassinos, 108 itens, 6 faces personalizadas do d6 e as integrações com Dice So Nice e Dice Tray.
- Mantida a correção da criação da ficha do Foundry 14 introduzida na versão 0.4.1.

## Atualização

Instale o novo ZIP pelo Foundry. As imagens usam os mesmos caminhos da versão anterior, de modo que compêndios já importados podem carregar as novas artes após reiniciar o Foundry e atualizar o cache do navegador (Ctrl+F5). Para reinstalar ou atualizar os compêndios, como Diretora, execute `await game.brutal.installCompendiums();`

Esta é uma adaptação comunitária não oficial. Os testes automatizados não substituem uma validação dentro do Foundry 14.369.

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
