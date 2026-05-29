## ADDED Requirements

### Requirement: Scanner encontra arquivos de código além de .md
O sistema SHALL escanear e incluir na lista de arquivos servidos todos os arquivos com extensões de uma whitelist de código e texto, além de `.md`.

#### Scenario: Pasta com múltiplos tipos de arquivo
- **WHEN** o servidor serve uma pasta contendo `.ts`, `.py`, `.md` e `.cs`
- **THEN** todos esses arquivos aparecem na sidebar e são acessíveis via `/file/<path>`

#### Scenario: Extensão fora da whitelist
- **WHEN** existe um arquivo `.exe` ou `.png` na pasta
- **THEN** o arquivo NÃO aparece na sidebar e retorna 404 em `/file/<path>`

#### Scenario: Arquivo sensível explicitamente excluído
- **WHEN** existe um arquivo `.env` na pasta
- **THEN** o arquivo NÃO aparece na sidebar e retorna 404 em `/file/<path>`

### Requirement: Arquivos de código são renderizados com syntax highlighting
O sistema SHALL renderizar arquivos de código como blocos de código com a linguagem correta para syntax highlighting via hljs.

#### Scenario: Arquivo TypeScript acessado
- **WHEN** o usuário acessa `GET /file/src/scanner.ts`
- **THEN** o conteúdo é exibido em um bloco de código com highlight de TypeScript

#### Scenario: Extensão desconhecida na whitelist sem mapeamento de linguagem
- **WHEN** o usuário acessa um arquivo cuja extensão está na whitelist mas sem linguagem hljs mapeada
- **THEN** o conteúdo é exibido em um bloco de código sem linguagem específica (sem highlight)

#### Scenario: Arquivo .md continua funcionando normalmente
- **WHEN** o usuário acessa `GET /file/README.md`
- **THEN** o conteúdo é renderizado como markdown (comportamento inalterado)
