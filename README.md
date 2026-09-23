# ANU2 V4.0 alpha 1

Incremental V4 foundation built on the V3 operational workspace.

This increment deliberately changes only cross-cutting infrastructure while preserving V3 work, multi-agent, import, master-data and provisioning behavior.

## Included
- Admin-only AI/model configuration.
- One active role/context indicator in the header.
- VI / EN / Simplified Chinese (`zh-CN`) i18n infrastructure.
- Language switcher.
- Translation catalog parity tests.
- Navigation regression test preventing AI/model settings from appearing for non-admin roles.
- V4 roadmap in `docs/V4-ROADMAP.md`.

## Test
```bash
npm install
npm run check
```
Expected: 9 tests pass.

## Deploy
Static GitHub Pages deployment remains supported through `.github/workflows/pages.yml`.
