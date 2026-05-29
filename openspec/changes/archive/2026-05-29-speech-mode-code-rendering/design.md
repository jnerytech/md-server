## Context

`src/renderer.ts` expõe dois paths de renderização: `renderMarkdown` (normal) e `renderMarkdownSpeech` (TTS-friendly). O renderer speech converte blocos de código em `<p style="font-family:monospace;white-space:pre-wrap">` com `<br>` por linha — adequado para leitores de tela que ignoram `<pre>`.

`src/server.ts` tem uma função `renderFile` que, quando `speech=true` e arquivo não é `.md`, retorna um placeholder `[ Arquivo X: filename ]` em vez de renderizar. A variante `renderCodeFile` só chama `renderMarkdown` — não tem equivalente speech.

## Goals / Non-Goals

**Goals:**
- Arquivos de código renderizam conteúdo real em modo speech
- Renderização usa o renderer TTS-friendly existente (sem nova lógica de formatação)
- Modo normal não é afetado

**Non-Goals:**
- Não muda o renderer speech em si
- Não adiciona destaque de sintaxe no modo speech (highlight.js não é amigo de TTS)
- Não muda comportamento de arquivos `.md` em nenhum modo

## Decisions

**Decisão: nova função `renderCodeFileSpeech` em `renderer.ts`**

Alternativa: passar flag `speech` para `renderCodeFile` existente.

Escolha: função separada. Razão: `renderCodeFile` e `renderCodeFileSpeech` divergem em chamada interna (`renderMarkdown` vs `renderMarkdownSpeech`) — flag booleana cria um condicional desnecessário numa função que já é pequena. Duas funções com nomes claros é mais legível.

**Decisão: remover bloco de supressão inteiro**

O `suppressed: true` flag no retorno nunca é usado pelo chamador (`renderFilePage` não o lê). A supressão era a única razão do bloco existir. Sem supressão, o bloco desaparece e `renderCodeFileSpeech` cobre o caso.

## Risks / Trade-offs

- **Arquivos de código grandes** → leitores de tela vão ler linha por linha — potencialmente longo. Mitigação: comportamento esperado do usuário ao usar `--speech` com código; não é regressão.
- **`suppressed` flag removido** → se algum código futuro depender disso, quebraria. Mitigação: nenhum consumidor atual usa o campo.
