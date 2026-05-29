## 1. CSS — Indentação do sidebar item

- [x] 1.1 Em `CSS_LAYOUT` em `src/templates.ts`, alterar `padding` do `.sidebar-item` para `0.3125rem 1rem 0.3125rem 1.5rem` (aumentar `padding-left` de `1rem` para `1.5rem`)

## 2. JS — Scroll persistence via sessionStorage

- [x] 2.1 No script inline do template de layout em `src/templates.ts`, adicionar listener de `click` em todos `.sidebar-item` que salva `sidebar.scrollTop` em `sessionStorage` com key `sidebarScroll`
- [x] 2.2 No mesmo script, ao carregar a página, ler `sessionStorage.getItem('sidebarScroll')` e aplicar ao `sidebar.scrollTop` se existir
- [x] 2.3 Envolver ambos os acessos ao `sessionStorage` em `try/catch` para degradação silenciosa
