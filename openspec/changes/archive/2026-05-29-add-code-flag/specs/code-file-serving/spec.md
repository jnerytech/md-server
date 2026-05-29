## MODIFIED Requirements

### Requirement: Scanner encontra arquivos de código além de .md
O sistema SHALL escanear e incluir na lista de arquivos servidos todos os arquivos com extensões de uma whitelist de código e texto, além de `.md`, **somente quando a flag `--code` estiver ativa**.

#### Scenario: Pasta com múltiplos tipos de arquivo, sem --code
- **WHEN** o servidor serve uma pasta contendo `.ts`, `.py`, `.md` e `.cs`, sem `--code`
- **THEN** apenas o arquivo `.md` aparece na sidebar e é acessível via `/file/<path>`; os demais retornam 404

#### Scenario: Pasta com múltiplos tipos de arquivo, com --code
- **WHEN** o servidor serve uma pasta contendo `.ts`, `.py`, `.md` e `.cs`, com `--code`
- **THEN** todos esses arquivos aparecem na sidebar e são acessíveis via `/file/<path>`

#### Scenario: Extensão fora da whitelist
- **WHEN** existe um arquivo `.exe` ou `.png` na pasta
- **THEN** o arquivo NÃO aparece na sidebar e retorna 404 em `/file/<path>` (comportamento inalterado)

#### Scenario: Arquivo sensível explicitamente excluído
- **WHEN** existe um arquivo `.env` na pasta
- **THEN** o arquivo NÃO aparece na sidebar e retorna 404 em `/file/<path>` (comportamento inalterado)

#### Scenario: Arquivo .md continua funcionando normalmente
- **WHEN** o usuário acessa `GET /file/README.md`
- **THEN** o conteúdo é renderizado como markdown (comportamento inalterado)
