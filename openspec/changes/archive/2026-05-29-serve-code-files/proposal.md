## Why

O servidor serve apenas `.md`, mas repositórios de código contêm `.ts`, `.py`, `.cs`, `.go` e dezenas de outras extensões úteis de navegar. Precisamos servir todos os arquivos texto relevantes do projeto, respeitando `.gitignore` para não expor secrets ou arquivos gerados.

## What Changes

- `scanner.ts` passa a encontrar todos os arquivos de uma whitelist de extensões de código e texto (não só `.md`), respeitando todos os `.gitignore` aninhados via lib `ignore`
- Arquivos de código são renderizados como bloco de código com syntax highlighting (wrappando em markdown ` ```lang ` antes de passar ao `marked`)
- Sidebar exibe o nome completo do arquivo com extensão (não mais stripa `.md`)
- `--speech` suprime o conteúdo de arquivos de código, exibindo apenas o nome do arquivo: `[ Arquivo TypeScript: scanner.ts ]`
- Nova dependência: pacote npm `ignore` para suporte completo a `.gitignore` aninhados

## Capabilities

### New Capabilities

- `code-file-serving`: Scan, serve e renderizar arquivos de código com extensões de uma whitelist, com syntax highlighting via hljs
- `gitignore-filtering`: Filtrar arquivos respeitando todos `.gitignore` aninhados no diretório servido
- `speech-code-suppression`: Modo `--speech` suprime conteúdo de arquivos de código, exibindo identificador do arquivo

### Modified Capabilities

- `sidebar-navigation`: Sidebar passa a exibir extensão completa do arquivo (ex: `scanner.ts` em vez de `scanner`)

## Impact

- `src/scanner.ts`: reescrita para suportar múltiplas extensões + integração com `ignore`
- `src/templates.ts`: `buildSidebar` — remove strip de `.md`, exibe nome completo
- `src/server.ts`: detecta tipo de arquivo na rota `/file/*`, rota diferente para código vs markdown
- `src/renderer.ts`: nova função `renderCodeFile(content, lang)` que wrappa em bloco markdown
- `package.json`: adiciona dep `ignore`
- Compatível com modo `--speech` existente; nenhuma mudança em `src/index.ts`
