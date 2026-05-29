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
npm start                          # serves cwd
node bin/md-server ./some-folder   # serves a specific folder
node bin/md-server file.md --speech

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
| `src/scanner.ts` | Recursively finds `.md` files under a root directory |
| `src/renderer.ts` | Wraps `marked` — normal GFM render + speech-mode variant |
| `src/templates.ts` | All HTML/CSS generation; sidebar builder; `renderFilePage()` |

`bin/md-server` is a thin shim that `spawnSync`s `tsx src/index.ts` with forwarded args.

## Two operating modes

**Directory mode** (`startServer({ root })`) — scans all `.md` files, serves them with a persistent sidebar nav. Root redirects to `readme.md` if present, otherwise first file alphabetically. Files served at `/file/<relpath>`.

**Single-file mode** (`startServer({ file })`) — serves one `.md` at `/` with no sidebar, no back link.

## Speech mode (`--speech`)

Activated by the `--speech` flag. Uses a separate `Marked` instance with a custom `Renderer` that:
- Wraps code blocks in `<hr><p monospace>` instead of `<pre><code>` (TTS readers skip `<pre>`)
- Strips backtick formatting from inline code
- Renders blockquotes as plain `<div>` (avoids TTS pause artifacts)
- Disables table zebra-striping and resets `<th>` font weight

## Key constraints

- ESM-only (`"type": "module"` in package.json) — use `.js` extensions on local imports even though source is `.ts`
- HTML lang is `pt-BR` — the project targets Portuguese content
- highlight.js loaded from CDN (no local copy); syntax highlighting applied client-side via `hljs.highlightAll()`
- Path traversal protection in `/file/*` handler: resolves absolute path and checks it starts with `resolvedRoot + path.sep`


