# ANU2 V5.0 — Domain Intelligence + Human–AI Authorized Work

V5.0 is an experimental baseline that consolidates the work from V3/V4 without removing prior capabilities.

Key additions:
- Domain Intelligence: LIS, RIS, SIS, PIS, OIS, FIS, FMS on one shared University Core.
- Multimodal intake: documents, images, audio and video as governed Input Artifacts; CSV/JSON can still be committed to master data.
- Working System Admin user administration: create users, provision imported people, suspend/activate, reset password, add role assignments.
- System Admin can work with AI on governance work items; AI actions remain delegated and human-controlled.
- Agent assignment includes domain, resource scope, data scope, validity and human checkpoint.
- VI / EN / 中文 retained.

## Demo accounts
- admin / Admin123!
- rector / Rector123!
- executive / Executive123!
- manager / Manager123!
- lecturer / Lecturer123!
- researcher / Research123!
- student / Student123!
- staff / Staff123!
- multirole / MultiRole123!

## Run
```bash
npm install
npm run check
npm start
```

For GitHub Pages, deploy the repository root through the included Pages workflow.

See `docs/V5-ARCHITECTURE.md` for architecture and browser limitations.
