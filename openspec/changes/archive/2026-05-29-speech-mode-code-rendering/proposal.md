## Why

Em modo `--speech`, arquivos de código (não-Markdown) são completamente suprimidos — exibem apenas `[ Arquivo TypeScript: templates.ts ]` em vez do conteúdo real. O renderer de speech já sabe renderizar blocos de código de forma TTS-friendly (usando `<p>` com `<br>` em vez de `<pre><code>`), mas nunca é acionado para arquivos de código.

## What Changes

- Remover bloco de supressão em `server.ts` que descarta conteúdo de arquivos não-.md em modo speech
- Adicionar `renderCodeFileSpeech` em `renderer.ts` que usa `speechMarked` para renderizar o conteúdo
- Arquivos de código em modo speech passam a exibir o conteúdo real com formatação TTS-friendly

## Capabilities

### New Capabilities

- `speech-code-rendering`: Renderização de arquivos de código em modo --speech usando o renderer TTS-friendly existente, produzindo `<p>` com `<br>` por linha em vez de `<pre><code>` que leitores de tela ignoram.

### Modified Capabilities

<!-- Nenhuma spec existente muda de requisitos — esta é uma correção de comportamento incompleto -->

## Impact

- `src/renderer.ts`: nova função `renderCodeFileSpeech`
- `src/server.ts`: bloco `if (!isMd && speech)` removido; chamada para `renderCodeFileSpeech` adicionada
- Sem breaking changes — modo normal não é afetado
