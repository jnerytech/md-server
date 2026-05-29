## Why

Serving a directory today exposes all code files alongside `.md` files by default, which is unexpected for users who just want to browse documentation. The server should be a markdown viewer first, with code file support as an explicit opt-in.

## What Changes

- Default mode: only `.md` files are scanned, served, and shown in the sidebar
- New `--code` flag enables code file serving alongside `.md`
- Without `--code`, requests to `/file/*.ts` (or any non-`.md`) return 404
- Single-file mode (`md-server file.ts`) is unaffected — explicit path always works
- CLI help/usage updated to document the new flag

## Capabilities

### New Capabilities
- `code-flag`: `--code` CLI flag that opts into serving code files alongside `.md` in directory mode

### Modified Capabilities
- `code-file-serving`: code files are now served only when `--code` is active (was unconditional)
- `sidebar-navigation`: sidebar lists only `.md` files by default; shows code files too when `--code` is active

## Impact

- `src/scanner.ts`: `scanFiles()` gains an `includeCode` parameter; `SUPPORTED_EXTENSIONS` split into `MD_EXTENSIONS` + `CODE_EXTENSIONS`
- `src/server.ts`: `ServerOptions` gains `code?: boolean`; extension gate and `scanFiles` call updated
- `src/index.ts`: `--code` arg parsed and forwarded to `startServer()`
- No dependency changes
- No breaking change for single-file mode users
