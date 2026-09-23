# ANU2 v2.0 — Complete SBBS Reference Runtime

ANU2 v2.0 is the GitHub Pages reference implementation that upgrades the v0.1.3 role-aware operational workspace without replacing it with an architecture showcase.

## Principles

- v2.0 is a functional superset of the v0.1.3 target.
- ANU Manifesto defines purpose, trust, authority, provenance, human agency, memory and continuous evolution.
- SBBS Manifesto defines software composition: Smart Boxes, Smart Wires, Assemblies and Components.
- Capability is not Authority. System Admin is not institutional decision authority.
- One identity can have multiple role assignments, but only one active Working Context supplies effective permissions.

## GitHub Pages mode

This package runs directly on GitHub Pages. Persistence uses browser LocalStorage and BYOK keys remain only in tab memory. Therefore authentication/authorization in this build is a demonstrator/reference runtime, not a production institutional security boundary.

For production, keep the same contracts and replace BrowserStore/auth with authoritative server-side services and PostgreSQL.

## Demo accounts

- admin / Admin123!
- executive / Executive123!
- manager / Manager123!
- researcher / Research123!
- multirole / MultiRole123!

## Test

```bash
npm install
npm run check
python3 -m http.server 8080
```

## Deploy

Push the repository to `main`, enable GitHub Pages with **Source: GitHub Actions**, and the included workflow deploys the repository root.
