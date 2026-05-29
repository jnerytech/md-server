# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Use AskUserQuestion for clarifications - MANDATORY

Before asking anything in chat, use the `AskUserQuestion` tool.

- NEVER ask clarifying questions as plain text in the conversation
- ALWAYS use `AskUserQuestion` when you need input from the user
- This applies to ALL situations: requirements, decisions, ambiguity, confirmations

## Language

Always respond in Brazilian Portuguese (pt-BR).
- **Keep in English:** technical terms (e.g. scanner, renderer, middleware), code identifiers, CLI flags, file/function names, section headers (Why, What Changes, Capabilities, etc.), and inline code
- **Always in pt-BR:** all prose, explanations, reasoning, and descriptions

## Commands

```bash
# Run the server (dev)
npm start                                     # serves cwd
node bin/md-server ./some-folder              # serves a specific folder
node bin/md-server file.md --speech           # single-file, TTS mode
node bin/md-server ./docs --port 4000         # fixed port
node bin/md-server ./repo --code              # include code files alongside .md

# Type-check (no build step — tsx runs src directly)
npx tsc --noEmit
```

No test suite exists. No build/compile step — `tsx` executes TypeScript source directly at runtime.

## Architecture

Five source files with clear single responsibilities:

| File | Role |
|------|------|
| `src/index.ts` | CLI arg parsing, resolves target path, calls `startServer()` |
| `src/server.ts` | Express app setup, two route modes (single-file vs directory) |
| `src/scanner.ts` | Recursively finds supported files under a root directory |
| `src/renderer.ts` | Wraps `marked` — normal GFM render + speech-mode variant |
| `src/templates.ts` | All HTML/CSS generation; sidebar builder; `renderFilePage()` |

`bin/md-server` is a thin shim that `spawnSync`s `tsx src/index.ts` with forwarded args.

## Two operating modes

**Directory mode** (`startServer({ root })`) — scans all supported files, serves them with a persistent sidebar nav. Root redirects to `readme.md` if present, otherwise first file alphabetically. Files served at `/file/<relpath>`.

**Single-file mode** (`startServer({ file })`) — serves one file at `/` with no sidebar. `--code` flag is ignored in this mode (only relevant for directory scans).

## Speech mode (`--speech`)

Activated by the `--speech` flag in both modes. Uses a separate `Marked` instance with a custom `Renderer` that:
- Wraps code blocks in `<hr><p monospace>` instead of `<pre><code>` (TTS readers skip `<pre>`)
- Strips backtick formatting from inline code
- Renders blockquotes as plain `<div>` (avoids TTS pause artifacts)
- Disables table zebra-striping and resets `<th>` font weight

For code files in speech mode, `renderCodeFileSpeech` renders each line as an individual `<p>` with monospace styling — does NOT go through `marked`.

## Code file rendering

`renderCodeFile` works by wrapping the raw file content in a fenced markdown block (` ```lang\n...\n``` `) and delegating to `renderMarkdown`. The `lang` identifier comes from `EXT_TO_LANG` in `server.ts`. Syntax highlighting runs client-side via highlight.js CDN.

## Scanner and .gitignore

`scanFiles` in `scanner.ts` loads **all** `.gitignore` files found recursively under the root and applies them via the `ignore` package. Patterns from subdirectory `.gitignore` files are prefixed with their relative directory path so they apply correctly. Files matching any `.gitignore` rule are excluded from the sidebar and directory listing.

## Key constraints

- ESM-only (`"type": "module"` in package.json) — use `.js` extensions on local imports even though source is `.ts`
- HTML lang is `pt-BR` — the project targets Portuguese content; sidebar root-group label `(raiz)` is hardcoded in `templates.ts:138`
- highlight.js loaded from CDN (no local copy); syntax highlighting applied client-side via `hljs.highlightAll()`
- Path traversal protection in `/file/*` handler: resolves absolute path and checks it starts with `resolvedRoot + path.sep`
- Default port is `0` — OS picks a random available port; `--port` overrides
- `renderFilePage` branches on whether `files` is empty: empty → `CSS_FILE` (centered single-column layout), non-empty → `CSS_LAYOUT` (CSS grid with collapsible sidebar)
