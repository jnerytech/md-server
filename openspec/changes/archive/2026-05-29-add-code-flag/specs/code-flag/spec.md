## ADDED Requirements

### Requirement: Flag --code habilita serving de arquivos de código em modo pasta
O sistema SHALL aceitar o argumento `--code` na CLI e, quando presente em modo pasta, incluir arquivos de código na descoberta, na sidebar e no roteamento.

#### Scenario: Servidor iniciado sem --code
- **WHEN** o usuário executa `md-server ./docs` (sem `--code`)
- **THEN** apenas arquivos `.md` são escaneados, exibidos na sidebar e acessíveis via `/file/*`

#### Scenario: Servidor iniciado com --code
- **WHEN** o usuário executa `md-server ./docs --code`
- **THEN** arquivos `.md` e de código são escaneados, exibidos na sidebar e acessíveis via `/file/*`

#### Scenario: --code não afeta modo single-file
- **WHEN** o usuário executa `md-server src/scanner.ts` (sem `--code`)
- **THEN** o arquivo é servido normalmente em `/` independentemente da flag
