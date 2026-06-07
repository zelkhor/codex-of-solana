---
name: feedback_env_files
description: Never read .env files without explicit user permission — treat them as containing sensitive secrets
metadata:
  type: feedback
---

Never read `.env` files (or any file matching `.env*`) without the user explicitly asking to look at one. Even if the contents appear to be local dev defaults, the habit of reading secret files into context is dangerous.

**Why:** The user flagged this directly — if a real `.env` had production secrets, API keys, or passwords, reading it silently would be a serious privacy/security mistake.

**How to apply:** When a task involves env config, infer the structure from `.env.example`, `docker-compose.yml`, or ask the user what variables are set. Never `cat`/`Read` a `.env` file proactively.
