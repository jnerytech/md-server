---
name: openspec-archive-change
description: Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.1"
  generatedBy: "1.3.1"
---

Archive a completed change in the experimental workflow.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run `openspec list --json` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show only active changes (not already archived).
   Include the schema used for each change if available.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check artifact completion status**

   Run `openspec status --change "<name>" --json` to check artifact completion.

   **If any artifacts are not `done`:**
   - Display warning listing incomplete artifacts
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

3. **Check task completion status**

   Read the tasks file (typically `tasks.md`) to check for incomplete tasks.
   Count tasks marked with `- [ ]` (incomplete) vs `- [x]` (complete).

   **If incomplete tasks found:**
   - Display warning showing count of incomplete tasks
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

   **If no tasks file exists:** Proceed without task-related warning.

4. **Perform the archive**

   Run:
   ```bash
   openspec archive "<name>" --yes
   ```

   This single command:
   - Syncs delta specs to `openspec/specs/` (if any)
   - Moves the change directory to `openspec/changes/archive/YYYY-MM-DD-<name>/`

   If the command fails, report the error output verbatim and stop.

5. **Display summary**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location (`openspec/changes/archive/YYYY-MM-DD-<name>/`)
   - Spec sync status (synced / skipped / no delta specs)
   - Note about any warnings (incomplete artifacts/tasks)

**Output On Success**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs (or "No delta specs" or "Sync skipped")

All artifacts complete. All tasks complete.
```

**Guardrails**
- Always prompt for change selection if not provided
- Use artifact graph (openspec status --json) for completion checking
- Don't block archive on warnings - just inform and confirm
- Use `openspec archive <name> --yes` — do NOT manually `mv` or sync specs
- If the CLI command fails, report the error and stop

## Language

Always respond in Brazilian Portuguese (pt-BR).
- **Keep in English:** technical terms (e.g. scanner, renderer, middleware), code identifiers, CLI flags, file/function names, section headers (Why, What Changes, Capabilities, etc.), and inline code
- **Always in pt-BR:** all prose, explanations, reasoning, and descriptions
