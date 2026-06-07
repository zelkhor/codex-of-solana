---
name: feedback_combine_imports
description: Never split import additions from their usage into separate Edit calls — always combine both in one Edit
metadata:
  type: feedback
---

Always combine import additions and their usage into a single `Edit` or `Write` call. Never make a separate tool call just to add an import.

**Why:** The user reviews the implementation, not the import. Splitting them into two calls means the user sees and must approve the import change separately, which is unnecessary friction. This rule is in the global CLAUDE.md.

**How to apply:** When a change requires a new import, include both the import line and the code that uses it in the same `old_string`/`new_string` block.
