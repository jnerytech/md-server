## 1. scanner.ts — Split extension sets

- [x] 1.1 Export `MD_EXTENSIONS = new Set(['.md'])` and `CODE_EXTENSIONS = new Set([all current non-.md entries])`
- [x] 1.2 Keep `SUPPORTED_EXTENSIONS` as union of both (backward compat)
- [x] 1.3 Add `includeCode = false` parameter to `scanFiles(root, includeCode)`
- [x] 1.4 Inside `scanFiles`, select `allowed = includeCode ? SUPPORTED_EXTENSIONS : MD_EXTENSIONS` and filter by it

## 2. server.ts — Wire mode through server

- [x] 2.1 Add `code?: boolean` to `ServerOptions` interface
- [x] 2.2 Destructure `code = false` alongside existing options in `startServer`
- [x] 2.3 Pass `code` to `scanFiles` call in `GET /` redirect handler
- [x] 2.4 Pass `code` to `scanFiles` call in `GET /file/*` handler
- [x] 2.5 Change `/file/*` extension gate: `(code ? SUPPORTED_EXTENSIONS : MD_EXTENSIONS).has(ext)`

## 3. index.ts — Parse CLI flag

- [x] 3.1 Detect `--code` in `process.argv` and pass `code: true` to `startServer()`

## 4. Verify

- [x] 4.1 Run `npx tsc --noEmit` — no type errors
- [x] 4.2 Serve a mixed directory without `--code` — code files absent from sidebar and return 404
- [x] 4.3 Serve same directory with `--code` — code files appear in sidebar and render correctly
- [x] 4.4 Serve a single `.ts` file directly — works without `--code`
