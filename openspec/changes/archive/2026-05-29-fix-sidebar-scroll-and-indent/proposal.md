## Why

O menu lateral tem dois problemas de UX: os itens não têm indentação visual em relação ao header do grupo (parecem estar no mesmo nível), e ao clicar em um arquivo o scroll do sidebar reseta para o topo na página seguinte, fazendo o item ativo sumir da viewport.

## What Changes

- Aumentar `padding-left` do `.sidebar-item` no `CSS_LAYOUT` para criar indentação visual sob os `.sidebar-group-header`
- Adicionar lógica `sessionStorage` no script inline do template de layout: salvar `sidebar.scrollTop` ao clicar em qualquer `.sidebar-item`, restaurar ao carregar a página
- O `.content` (área principal) já inicia no topo naturalmente a cada navegação — nenhuma mudança necessária

## Capabilities

### New Capabilities

- `sidebar-ux`: Comportamento correto de indentação e scroll persistence no menu lateral

### Modified Capabilities

<!-- nenhuma spec existente muda -->

## Impact

- `src/templates.ts` — único arquivo afetado: CSS string `CSS_LAYOUT` e script inline no template de layout
- Sem mudanças de API, rotas, ou dependências externas
