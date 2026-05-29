## 1. Templates

- [x] 1.1 Remover `CSS_INDEX` e `renderIndexPage` de `templates.ts`
- [x] 1.2 Adicionar CSS de layout (grid duas colunas, sidebar, toggle) a `CSS_FILE`
- [x] 1.3 Criar função `buildSidebar(files, currentPath)` que gera HTML da sidebar com grupos por pasta e item ativo destacado
- [x] 1.4 Atualizar assinatura de `renderFilePage` para aceitar `files: string[]` e `currentPath: string`
- [x] 1.5 Integrar sidebar + botão toggle ao HTML gerado por `renderFilePage`

## 2. Server

- [x] 2.1 Atualizar rota `GET /` para buscar `README.md` primeiro, depois primeiro arquivo da scan, e retornar redirect 302
- [x] 2.2 Tratar caso sem arquivos em `GET /` (retornar 404)
- [x] 2.3 Atualizar chamada a `renderFilePage` em `GET /file/*` passando `files` e `relPath` como `currentPath`

## 3. Verificação

- [x] 3.1 Testar navegação entre arquivos com sidebar visível e arquivo ativo destacado
- [x] 3.2 Testar toggle colapsa/expande sidebar
- [x] 3.3 Testar `GET /` com README.md presente → redirect correto
- [x] 3.4 Testar `GET /` sem README.md → redirect para primeiro arquivo
- [x] 3.5 Testar `GET /` sem arquivos → 404
