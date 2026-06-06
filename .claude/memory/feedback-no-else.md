---
name: feedback-no-else
description: Avoid else statements; prefer early returns to flatten control flow
metadata:
  type: feedback
---

Avoid `else` statements. Early returns remove the need for `else` and flatten control flow.

**Why:** User preference for readable, flat code.

**How to apply:** Whenever you'd write `if (condition) { return x; } else { ... }`, drop the `else` and let the remaining code run as the default path.
