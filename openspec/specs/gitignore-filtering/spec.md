## ADDED Requirements

### Requirement: Scanner respeita .gitignore aninhados
O sistema SHALL excluir do scan todos os arquivos e diretórios que correspondam a padrões definidos em qualquer `.gitignore` encontrado dentro do diretório servido, respeitando o caminho relativo de cada `.gitignore`.

#### Scenario: Arquivo ignorado pelo .gitignore da raiz
- **WHEN** o `.gitignore` da raiz contém `dist/` e existe `dist/bundle.js`
- **THEN** `dist/bundle.js` não aparece na sidebar

#### Scenario: .gitignore aninhado em subdiretório
- **WHEN** existe `packages/foo/.gitignore` com `*.generated.ts` e existe `packages/foo/api.generated.ts`
- **THEN** `packages/foo/api.generated.ts` não aparece na sidebar

#### Scenario: Pasta sem .gitignore
- **WHEN** o diretório servido não contém nenhum `.gitignore`
- **THEN** o scanner retorna todos os arquivos da whitelist sem filtro de gitignore

#### Scenario: .gitignore não oculta arquivos de outros diretórios
- **WHEN** `packages/foo/.gitignore` contém `*.log`
- **THEN** apenas `packages/foo/*.log` é filtrado; `packages/bar/debug.log` NÃO é filtrado por este `.gitignore`
