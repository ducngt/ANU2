# ANU2 — SBBS v2.0

A static, browser-native reference implementation of ANU-SBBS designed to run directly on GitHub Pages.

## Architectural contract

ANU defines the institutional purpose, constitutional boundaries and living cycle. SBBS defines software composition:

- Smart Boxes: reusable capability units.
- Smart Wires: implementation-independent contracts connecting Boxes.
- Assemblies: orchestration of Boxes and Wires into business behavior.
- Components: human-facing interaction/UI.

The ANU living cycle is represented as:

`REALITY → DATA → KNOWLEDGE → CAPABILITY → INTELLIGENCE → DECISION → ACTION → EVIDENCE → LEARNING → NEW CAPABILITY`

with the constitutional envelope `IDENTITY × TRUST × GOVERNANCE × PRIVACY` and Human Purpose above it.

## What v2.0 adds relative to the v0.1.3 handoff

- Capability Registry is first-class and exposed in the UI.
- Smart Wire Registry is first-class.
- Admin can create identities and role assignments in the browser reference runtime.
- System Admin is explicitly separated from institutional approval authority.
- Audit events are captured for login and administrative mutations.
- Structure follows Smart Boxes + Smart Wires + Assemblies + Components.
- No Node backend is required for the GitHub Pages reference deployment.

## Run locally

Any static server works. For example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Demo accounts

- admin / Admin123!
- executive / Executive123!
- manager / Manager123!
- researcher / Research123!

These credentials are demo-only and are checked in browser code. Do not treat this as institutional authentication.

## Deploy as repository `ANU2`

1. Create/push this directory as the root of `ducngt/ANU2` on branch `main`.
2. In GitHub: Settings → Pages → Source: GitHub Actions.
3. The included workflow deploys the root as a static site.
4. The expected URL is `https://ducngt.github.io/ANU2/`.

All application URLs are relative, so the project works under the `/ANU2/` GitHub Pages path without rebuilding.

## Security boundary

GitHub Pages is static hosting. Browser-side authentication, authorization, localStorage and audit are suitable only for a reference implementation / sandbox. A production institutional deployment must move authoritative identity, authorization, audit, secrets and protected integrations to a trusted backend.

## BYOK

v2.0 deliberately does not store provider API keys. A future provider box may accept an API key only in memory. Direct browser calls should only be enabled for providers/endpoints that explicitly support CORS and whose risk model permits client-side keys. For institutional use, call providers through a secure backend/proxy.
