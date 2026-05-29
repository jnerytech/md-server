## Context

Todo o sidebar é gerado em `src/templates.ts`. O CSS do layout (`CSS_LAYOUT`) e o script inline do template de layout ficam na mesma string. Não há framework JS — tudo é HTML + CSS + vanilla JS injetado no `<script>` da página.

O sidebar usa `overflow-y: auto` para scroll independente do `.content`. Atualmente, `.sidebar-item` e `.sidebar-group-header` têm o mesmo `padding-left: 1rem`, removendo qualquer hierarquia visual. O script inline só trata o botão de toggle — não há lógica de scroll.

## Goals / Non-Goals

**Goals:**
- `.sidebar-item` visualmente indentado em relação a `.sidebar-group-header`
- Scroll do sidebar preservado entre navegações via `sessionStorage`
- `.content` (área principal) sempre inicia no topo em cada página

**Non-Goals:**
- Animações de scroll
- Persistência entre sessões de browser (`localStorage`)
- Qualquer mudança fora de `src/templates.ts`

## Decisions

### D1 — `padding-left` do `.sidebar-item`

Aumentar de `1rem` para `1.5rem`. Cria hierarquia visual sem quebrar o `text-overflow: ellipsis` (há espaço suficiente com sidebar de 240px).

Alternativa considerada: adicionar `margin-left` ao item. Rejeitado — o `box-shadow: inset 3px 0 0 #0969da` do estado `active` ficaria desalinhado.

### D2 — `sessionStorage` para scroll do sidebar

Salvar `sidebar.scrollTop` em `sessionStorage` no evento `click` de cada `.sidebar-item`. Restaurar no `DOMContentLoaded` (ou inline ao final do `<body>`).

**Por que `sessionStorage` e não `localStorage`?** Scroll position é contexto de sessão, não preferência persistente. Com `localStorage`, abrir nova aba herdaria posição indesejada.

**Por que salvar no `click` e não no `beforeunload`?** `beforeunload` pode não disparar de forma confiável em mobile e em navegações rápidas. Click é síncrono e sempre ocorre antes da navegação.

**Degradação**: Se `sessionStorage` não estiver disponível (ex: modo privado restrito), o bloco é envolto em `try/catch` — silenciosamente ignora, comportamento atual é mantido.

## Risks / Trade-offs

- **Posição ligeiramente deslocada após resize do sidebar**: Se o usuário redimensionar a janela entre páginas, o `scrollTop` salvo pode não corresponder ao mesmo item visualmente. Risco baixo — sidebar tem largura fixa (240px).
- **Um único key `sidebarScroll` no `sessionStorage`**: Múltiplas abas do mesmo servidor compartilham o mesmo `sessionStorage` por origem. Em uso normal (uma aba), sem impacto.
