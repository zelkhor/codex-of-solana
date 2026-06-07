# Memory Index

- [Combine imports with usage](feedback_combine_imports.md) — Never make a standalone Edit just for an import; always include the usage in the same call

- [FaB types lookup preference](feedback_fab_types_lookup.md) — Don't browse @flesh-and-blood/types; use Object.values or ask instead
- [cursor-pointer on all buttons](feedback_cursor_pointer.md) — Always add cursor-pointer to every button/interactive element; browsers default buttons to cursor:default
- [View model for all logic](feedback_view_model_logic.md) — All derived/business logic goes in \*.view-model.ts hooks; components are dumb render shells only
- [Never read .env files](feedback_env_files.md) — Treat .env files as containing secrets; never read them without explicit user permission
