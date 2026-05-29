## Why

O índice de arquivos como homepage obriga o usuário a voltar à raiz para navegar. Um sidebar persistente elimina esse round-trip e torna a experiência mais próxima de leitores de documentação modernos.

## What Changes

- Sidebar com lista de arquivos agrupados por pasta aparece em todas as páginas de conteúdo
- Arquivo atual fica destacado na sidebar
- Sidebar é colapsável via botão toggle
- `GET /` redireciona para `README.md` se existir, senão para o primeiro arquivo encontrado
- `renderIndexPage` é removido — a sidebar substitui essa função
- Navegação entre arquivos continua com reload de página (sem SPA)

## Capabilities

### New Capabilities
- `sidebar-navigation`: Sidebar persistente com lista de arquivos, destaque do arquivo ativo e toggle de visibilidade

### Modified Capabilities
- (nenhuma)

## Impact

- `src/templates.ts`: nova função de layout com sidebar; `renderIndexPage` removida; `renderFilePage` recebe `currentPath` e lista de arquivos
- `src/server.ts`: rota `GET /` passa a redirecionar; `GET /file/*` passa lista de arquivos e path atual ao template
- `src/scanner.ts`: sem mudanças
- `src/renderer.ts`: sem mudanças
