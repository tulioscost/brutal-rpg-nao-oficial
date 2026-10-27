# Publicação no GitHub e instalação no Foundry VTT

Repositório: <https://github.com/tulioscost/brutal-rpg-nao-oficial>  
Versão: `0.1.0` — tag da Release: `v0.1.0`

## 1. Preencher o repositório (ZIP do código-fonte)

1. Extraia **brutal-rpg-github-v0.1.0.zip** no computador.
2. Envie **os arquivos e subpastas extraídos** para a raiz do repositório `tulioscost/brutal-rpg-nao-oficial`, na branch `main`. Não envie o ZIP inteiro como arquivo único e não coloque tudo dentro de uma pasta adicional.
3. Confira se `system.json`, `brutal.mjs`, `README.md`, `module/`, `templates/`, `styles/` etc. estão diretamente na raiz; os arquivos `.github/workflows/` ficam no diretório `.github`.
4. Pela linha de comando, outra opção é extrair em um clone do repositório, depois executar `git add .`, `git commit -m "Adicionar BRUTAL RPG 0.1.0"` e `git push origin main`.

## 2. Criar a Release manualmente (ZIP de instalação)

1. Abra <https://github.com/tulioscost/brutal-rpg-nao-oficial/releases/new>.
2. Crie a tag `v0.1.0` baseada na branch `main` e escolha o título `BRUTAL RPG v0.1.0`.
3. Anexe o arquivo **brutal-rpg-v0.1.0.zip** (o ZIP de instalação).
4. Opcionalmente, anexe também `system.json` como *asset* da Release, permitindo a instalação dessa versão específica pelo manifesto da Release. Esse arquivo é o mesmo do repositório.
5. Publique a Release.

**Atenção:** se as GitHub Actions do repositório estiverem habilitadas, criar a tag também pode acionar o workflow automático `release.yml`, que verifica e anexa os dois arquivos. Não é necessário anexá-los duas vezes; verifique a conclusão do workflow.

## 3. Testar os links após a publicação

- Manifesto de atualizações: <https://raw.githubusercontent.com/tulioscost/brutal-rpg-nao-oficial/main/system.json>
- Download da versão: <https://github.com/tulioscost/brutal-rpg-nao-oficial/releases/download/v0.1.0/brutal-rpg-v0.1.0.zip>
- Manifesto específico (caso anexado à Release): <https://github.com/tulioscost/brutal-rpg-nao-oficial/releases/download/v0.1.0/system.json>

No Foundry VTT, em **Configuração → Sistemas → Instalar Sistema**, cole o link do manifesto estável. O `system.json` deve ser servido com JSON válido, e o campo `download` deve apontar para o ZIP disponibilizado na Release.

## 4. Criar novas versões

1. Atualize `version` e `download` de `system.json` (`vX.Y.Z` e `brutal-rpg-vX.Y.Z.zip`).
2. Atualize `CHANGELOG.md` e execute `node tests/smoke.mjs`.
3. Execute `python3 scripts/build_release.py` para criar o arquivo de instalação.
4. Envie o código atualizado para `main`; crie a tag `vX.Y.Z` sobre o commit correspondente; publique a Release com o respectivo ZIP.

O manifesto estável da branch `main` permite atualizações automáticas. Não altere o URL de `manifest` entre as versões. Nunca deixe `download` apontando para um ZIP de versão diferente da informada em `version`.

## Segurança e direitos autorais

O projeto é independente e não oficial. O livro, suas ilustrações e seus elementos editoriais não estão incluídos nos pacotes. A compatibilidade com Foundry VTT 14.369 continua **pendente de teste de integração na aplicação real**.
