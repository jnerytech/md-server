## MODIFIED Requirements

### Requirement: Sidebar exibe todos os arquivos agrupados por pasta
A sidebar SHALL listar todos os arquivos encontrados na raiz servida (de qualquer extensão suportada), agrupados por diretório, em todas as páginas de conteúdo. O nome exibido na sidebar SHALL ser o nome completo do arquivo incluindo a extensão.

#### Scenario: Arquivos em múltiplas pastas
- **WHEN** o servidor serve uma pasta com arquivos em subdiretórios
- **THEN** a sidebar exibe cada grupo com o nome do diretório como cabeçalho e os arquivos como links

#### Scenario: Arquivos na raiz
- **WHEN** existem arquivos diretamente na raiz (sem subpasta)
- **THEN** a sidebar os exibe agrupados sob um cabeçalho de raiz (ex: "(raiz)")

#### Scenario: Sidebar exibe extensão completa
- **WHEN** existem arquivos `README.md` e `scanner.ts` na sidebar
- **THEN** os links exibem `README.md` e `scanner.ts` (não `README` e `scanner`)

#### Scenario: Dois arquivos com mesmo nome e extensões diferentes
- **WHEN** existem `config.ts` e `config.md` no mesmo diretório
- **THEN** ambos aparecem na sidebar com nomes distintos (`config.ts` e `config.md`)
