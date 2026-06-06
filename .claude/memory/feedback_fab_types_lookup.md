---
name: feedback_fab_types_lookup
description: How to handle unknown enum values from @flesh-and-blood/types without browsing the package
metadata:
  node_type: memory
  type: feedback
  originSessionId: 5ee00c61-55f3-49eb-bbab-15c9a93beded
---

Avoid looking inside the `@flesh-and-blood/types` node_modules package to discover enum values.

**Why:** The user prefers to keep exploration inside the project's own source code.

**How to apply:** When a specific enum value is needed (e.g. for a test), either:

1. Infer it via TypeScript (e.g. reading the type alias in `packages/core/src/card-catalog/domain/card.ts`)
2. Use `Object.values(CARD_X)[0]` as a guaranteed-valid dumb value
3. Ask the user for a concrete example value
