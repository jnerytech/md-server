## ADDED Requirements

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

### Requirement: Arquivo atual destacado na sidebar
O arquivo atualmente visualizado SHALL ser visualmente distinguido dos demais na sidebar.

#### Scenario: Usuário acessa um arquivo
- **WHEN** o usuário acessa `GET /file/<path>`
- **THEN** o link correspondente na sidebar aparece com estilo de ativo (ex: negrito ou cor diferente)

#### Scenario: Nenhum arquivo selecionado
- **WHEN** nenhum arquivo está sendo visualizado
- **THEN** nenhum item na sidebar aparece como ativo

### Requirement: Sidebar colapsável via toggle
O usuário SHALL poder ocultar e exibir a sidebar usando um botão toggle.

#### Scenario: Usuário colapsa a sidebar
- **WHEN** o usuário clica no botão toggle com a sidebar visível
- **THEN** a sidebar some e o conteúdo ocupa toda a largura disponível

#### Scenario: Usuário expande a sidebar
- **WHEN** o usuário clica no botão toggle com a sidebar oculta
- **THEN** a sidebar reaparece e o conteúdo retorna ao layout de duas colunas

### Requirement: GET / redireciona para conteúdo inicial
`GET /` (em modo pasta) SHALL redirecionar para um arquivo de entrada, sem renderizar página de índice.

#### Scenario: README.md existe na raiz
- **WHEN** o usuário acessa `GET /` e existe `README.md` na raiz servida
- **THEN** o servidor redireciona 302 para `/file/README.md`

#### Scenario: README.md não existe
- **WHEN** o usuário acessa `GET /` e não existe `README.md`
- **THEN** o servidor redireciona 302 para o primeiro arquivo `.md` encontrado

#### Scenario: Nenhum arquivo encontrado
- **WHEN** o usuário acessa `GET /` e não há arquivos `.md` na pasta
- **THEN** o servidor retorna 404 com mensagem apropriada
