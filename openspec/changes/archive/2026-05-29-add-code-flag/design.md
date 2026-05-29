## Context

`md-server` currently scans and serves all files matching `SUPPORTED_EXTENSIONS` (`.md` + ~30 code extensions) in directory mode. `scanFiles()` in `scanner.ts` has no mode awareness — it always returns everything. The sidebar and the `/file/*` route handler both trust this full list unconditionally.

The change makes code-file serving opt-in via `--code`. The primary extension points are `scanFiles()` (discovery) and the `/file/*` extension gate (request-time enforcement).

## Goals / Non-Goals

**Goals:**
- Default directory mode serves and exposes only `.md` files
- `--code` flag restores current behavior (`.md` + all code extensions)
- Single-file mode is unaffected regardless of flag

**Non-Goals:**
- Granular per-extension filtering (e.g. `--include=.ts,.py`)
- Changes to rendering, speech mode, or highlighting logic
- Any UI toggle — flag is CLI-only

## Decisions

### Split `SUPPORTED_EXTENSIONS` into two sets

`MD_EXTENSIONS = { '.md' }` and `CODE_EXTENSIONS = { all others }`. `SUPPORTED_EXTENSIONS` becomes their union (unchanged export for any external consumers).

**Why not a single set with a flag parameter?** Two named sets make the intent explicit at each call site and allow `includeCode ? SUPPORTED_EXTENSIONS : MD_EXTENSIONS` without string comparisons.

Alternatives considered:
- Filter `SUPPORTED_EXTENSIONS` inline at call sites → scattered logic, error-prone
- Pass allowed-set directly into `scanFiles` → flexible but over-engineered for two modes

### `scanFiles` gains `includeCode` boolean parameter (default `false`)

```ts
export function scanFiles(root: string, includeCode = false): string[]
```

`includeCode` selects which extension set to filter against. Default `false` = md-only.

**Why default false?** Matches the new server default; callers that don't pass the arg get the safe (md-only) behavior automatically.

### `ServerOptions` gains `code?: boolean`

Passed from `index.ts` → `startServer()` → `scanFiles()` and the `/file/*` extension gate. Same pattern as the existing `speech` flag.

### `/file/*` gate uses the mode-aware set

```ts
const allowed = code ? SUPPORTED_EXTENSIONS : MD_EXTENSIONS;
if (!allowed.has(ext)) { res.status(404)... }
```

Enforces the mode at request time, preventing direct URL access to code files when `--code` is absent.

## Risks / Trade-offs

- **Existing users surprised by 404s** → Behavior change is intentional; README / help text documents `--code`. Single-file mode unchanged.
- **`scanFiles` signature change** → No external consumers (private package); internal call sites are easy to audit (one in `server.ts`).

## Migration Plan

No data migration. Deploy is a drop-in replace of the binary. Users who relied on code file serving must add `--code`. The flag is additive — no removal of existing functionality.
