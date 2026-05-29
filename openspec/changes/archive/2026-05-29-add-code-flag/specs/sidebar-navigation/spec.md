## MODIFIED Requirements

### Requirement: Sidebar exibe todos os arquivos agrupados por pasta
A sidebar SHALL listar todos os arquivos encontrados na raiz servida **que correspondam ao modo ativo** (apenas `.md` por padrão; `.md` e código com `--code`), agrupados por diretório, em todas as páginas de conteúdo. O nome exibido na sidebar SHALL ser o nome completo do arquivo incluindo a extensão.

#### Scenario: Arquivos em múltiplas pastas, sem --code
- **WHEN** o servidor serve uma pasta com `.md` e `.ts` em subdiretórios, sem `--code`
- **THEN** a sidebar exibe apenas os arquivos `.md` agrupados por diretório

#### Scenario: Arquivos em múltiplas pastas, com --code
- **WHEN** o servidor serve uma pasta com `.md` e `.ts` em subdiretórios, com `--code`
- **THEN** a sidebar exibe ambos `.md` e `.ts` agrupados por diretório

#### Scenario: Arquivos na raiz
- **WHEN** existem arquivos diretamente na raiz (sem subpasta)
- **THEN** a sidebar os exibe agrupados sob um cabeçalho de raiz (ex: "(raiz)") (comportamento inalterado)

#### Scenario: Sidebar exibe extensão completa
- **WHEN** existem arquivos `README.md` e `scanner.ts` na sidebar (com `--code` ativo)
- **THEN** os links exibem `README.md` e `scanner.ts` (não `README` e `scanner`) (comportamento inalterado)

#### Scenario: Dois arquivos com mesmo nome e extensões diferentes
- **WHEN** existem `config.ts` e `config.md` no mesmo diretório, com `--code` ativo
- **THEN** ambos aparecem na sidebar com nomes distintos (`config.ts` e `config.md`) (comportamento inalterado)

### Requirement: GET / redireciona para conteúdo inicial
`GET /` (em modo pasta) SHALL redirecionar para um arquivo de entrada, sem renderizar página de índice.

#### Scenario: README.md existe na raiz
- **WHEN** o usuário acessa `GET /` e existe `README.md` na raiz servida
- **THEN** o servidor redireciona 302 para `/file/README.md` (comportamento inalterado)

#### Scenario: README.md não existe, sem --code
- **WHEN** o usuário acessa `GET /` e não existe `README.md`
- **THEN** o servidor redireciona 302 para o primeiro arquivo `.md` encontrado

#### Scenario: Nenhum arquivo .md encontrado, sem --code
- **WHEN** o usuário acessa `GET /` e não há arquivos `.md` na pasta (e `--code` não está ativo)
- **THEN** o servidor retorna 404 com mensagem apropriada
