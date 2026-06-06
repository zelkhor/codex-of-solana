---
name: feedback-view-model-logic
description: 'All business/derived logic must live in view models, not components'
metadata:
  node_type: memory
  type: feedback
  originSessionId: ea3cb07c-cc3f-483a-9e0a-38b28943d609
---

Components are dumb render functions — they hold only React-specific state (open/closed, refs, event handlers). All derived data, index lookups, navigation logic, and anything that queries the Redux store must live in a co-located `*.view-model.ts` file exporting a `use*ViewModel` hook.

**Why:** Keeps components as pure render shells; logic is testable in isolation and reusable without coupling to the component tree.

**How to apply:** When adding any feature that involves computing data from the store or deriving values (e.g. "what is the next card?", "is this the last item?"), write that logic in a `use*ViewModel` hook in a co-located `*.view-model.ts` file and have the component call it. The component only wires up event handlers and renders what the view model returns.
