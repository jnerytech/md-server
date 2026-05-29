## 1. renderer.ts

- [x] 1.1 Adicionar função `renderCodeFileSpeech(content: string, lang: string): string` que usa `speechMarked.parse` em vez de `base.parse`
- [x] 1.2 Exportar `renderCodeFileSpeech`

## 2. server.ts

- [x] 2.1 Importar `renderCodeFileSpeech` de `renderer.js`
- [x] 2.2 Remover bloco `if (!isMd && speech)` que retorna placeholder e `suppressed: true`
- [x] 2.3 No branch de arquivo não-.md (normal), chamar `renderCodeFileSpeech` quando `speech=true` e `renderCodeFile` quando `speech=false`
- [x] 2.4 Remover campo `suppressed` do tipo de retorno se não tiver mais uso

## 3. Verificação

- [x] 3.1 Iniciar servidor com `--speech` e abrir arquivo `.ts` — confirmar código visível, sem placeholder
- [x] 3.2 Confirmar que modo normal ainda usa `<pre><code>` com highlight.js
- [x] 3.3 Rodar `npx tsc --noEmit` sem erros
