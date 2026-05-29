## Context

`md-server` é um CLI que serve uma pasta de arquivos `.md` como site local. Atualmente: `GET /` retorna uma página de índice; `GET /file/*` retorna o conteúdo com um link "← Índice" no topo. Todo HTML é gerado server-side em `templates.ts` sem frontend framework.

## Goals / Non-Goals

**Goals:**
- Sidebar persistente em todas as páginas de conteúdo
- Arquivo ativo destacado na sidebar
- Toggle de visibilidade (colapsável)
- `GET /` redireciona para README.md ou primeiro arquivo
- Zero dependências novas

**Non-Goals:**
- Navegação SPA (sem fetch/AJAX)
- Busca dentro da sidebar
- Drag-and-drop ou reorganização de arquivos
- Persistência do estado collapsed entre sessões

## Decisions

**1. Sidebar embutida no HTML (server-side)**
- Alternativa considerada: endpoint `/api/files` + fetch JS
- Decisão: gerar sidebar inline. O servidor já tem a lista de arquivos; evita round-trip extra e mantém zero-JS para o conteúdo em si
- Consequência: cada request regenera a sidebar — OK para uso local

**2. Toggle via CSS + JS mínimo**
- `body.sidebar-collapsed` + CSS `display: none` / `width: 0`
- Alternativa: CSS puro com checkbox hack — mais frágil em acessibilidade
- ~5 linhas de JS inline, sem dependências

**3. Layout com CSS Grid**
```
body {
  display: grid;
  grid-template-columns: 240px 1fr;  /* collapsed: 0 1fr */
  grid-template-rows: auto 1fr;
}
```
- Alternativa: flexbox — Grid é mais explícito para layouts de duas colunas com header

**4. `renderIndexPage` removida**
- `GET /` passa a fazer redirect 302 para o primeiro arquivo encontrado (README.md prioritário)
- Não existe mais rota que use `renderIndexPage`

**5. `renderFilePage` recebe novos parâmetros**
```ts
renderFilePage(html, relPath, files, { showBack, speech, currentPath })
```
- `files: string[]` — lista completa para gerar sidebar
- `currentPath: string` — para destacar item ativo

## Risks / Trade-offs

- **Sidebar grande em repos com muitos arquivos** → sem virtualização; aceitável para uso local
- **Redirect em `GET /` quebra acesso direto à raiz** → comportamento esperado; documentar no README
- **Estado collapsed não persiste** → usuário perde preferência ao navegar entre arquivos. Mitigação futura: `localStorage`
