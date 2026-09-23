# ANU2 V5.1 — Domain Intelligence + Human–AI Authorized Work

V5.1 is an experimental baseline that consolidates the work from V3/V4 without removing prior capabilities.

Key additions:
- Domain Intelligence: LIS, RIS, SIS, PIS, OIS, FIS, FMS on one shared University Core.
- Multimodal intake: documents, images, audio and video as governed Input Artifacts; CSV/JSON can still be committed to master data.
- Working System Admin user administration: create users, provision imported people, suspend/activate, reset password, add role assignments.
- System Admin can work with AI on governance work items; AI actions remain delegated and human-controlled.
- Agent assignment includes domain, resource scope, data scope, validity and human checkpoint.
- VI / EN / 中文 retained.


## V5.1 direct speech + document-assisted Human-AI work
- Every Work Item has a Human-AI request composer.
- Users can speak directly using the browser Web Speech API (Chrome/Edge support depends on browser/permissions), edit the transcript, attach files, and submit one request to all AI actors already delegated to the Work Item.
- Spoken/typed requests are stored as governed text Artifacts with provenance and linked to the Work Item.
- TXT/MD/CSV/JSON are text-extracted in-browser and included in AI context. PDF/Office/image/audio/video are recorded as Artifacts with metadata in this browser-only baseline; full binary extraction/vision/transcription remains a follow-up processor capability.
- AI responses continue to respect each assignment's capability, action, domain, resource scope, data scope, validity and Human Checkpoint.
- No Agent is auto-assigned simply because a user speaks or uploads a document; Human delegation remains the authority boundary.

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
