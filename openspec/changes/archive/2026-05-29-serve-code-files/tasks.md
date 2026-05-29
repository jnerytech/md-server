## 1. Dependências

- [x] 1.1 Adicionar `ignore` ao `package.json` com `npm install ignore`
- [x] 1.2 Verificar que tipos TypeScript de `ignore` estão disponíveis (`@types/ignore` ou bundled)

## 2. Scanner — whitelist e .gitignore

- [x] 2.1 Definir array `SUPPORTED_EXTENSIONS` em `scanner.ts` com whitelist de extensões
- [x] 2.2 Renomear `scanMarkdownFiles` para `scanFiles` e atualizar filtro para usar `SUPPORTED_EXTENSIONS`
- [x] 2.3 Implementar `loadGitignore(root)` que encontra todos os `.gitignore` aninhados e retorna instância `ignore`
- [x] 2.4 Aplicar filtro de gitignore no `scanFiles` usando caminhos relativos à raiz
- [x] 2.5 Atualizar todos os imports/chamadas de `scanMarkdownFiles` em `server.ts` para `scanFiles`

## 3. Renderer — renderização de código

- [x] 3.1 Adicionar `renderCodeFile(content: string, lang: string): string` em `renderer.ts` que wrappa em bloco markdown ` ```lang `
- [x] 3.2 Exportar `renderCodeFile` de `renderer.ts`

## 4. Server — roteamento por tipo de arquivo

- [x] 4.1 Definir `EXT_TO_LANG: Record<string, string>` em `server.ts` mapeando extensão → nome de linguagem hljs
- [x] 4.2 Na rota `/file/*`, detectar extensão do arquivo solicitado
- [x] 4.3 Se `speech=true` e arquivo não é `.md`: gerar placeholder `[ Arquivo <Lang>: <filename> ]` e retornar sem chamar renderer
- [x] 4.4 Se arquivo não é `.md`: chamar `renderCodeFile(content, lang)` e passar resultado para `renderFilePage`
- [x] 4.5 Se arquivo é `.md`: manter comportamento atual (sem mudança)

## 5. Templates — sidebar com extensão completa

- [x] 5.1 Em `buildSidebar`, substituir `path.basename(f, '.md')` por `path.basename(f)` para exibir extensão completa

## 6. Validação

- [x] 6.1 Testar servidor com pasta contendo `.ts`, `.py`, `.md` — todos aparecem na sidebar
- [x] 6.2 Testar que `.env` e `node_modules/` não aparecem (gitignore + extensão excluída)
- [x] 6.3 Testar `--speech` com arquivo `.ts` — exibe placeholder, não código
- [x] 6.4 Testar `--speech` com arquivo `.md` — continua renderizando markdown normalmente
- [x] 6.5 Rodar `npx tsc --noEmit` sem erros
