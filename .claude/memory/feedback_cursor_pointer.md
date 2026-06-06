---
name: feedback_cursor_pointer
description: Always add cursor-pointer to buttons and interactive elements
metadata:
  type: feedback
---

Always add `cursor-pointer` to all `<button>` elements and other interactive controls. Browsers default `<button>` to `cursor: default` (the arrow), but users expect the pointer cursor on all clickable elements.

**Why:** User noticed that buttons throughout the app were missing `cursor-pointer` and found it inconsistent/unexpected.

**How to apply:** Every `<button>`, accordion toggle, tag/pill, close button, etc. should have `cursor-pointer` in its className.
