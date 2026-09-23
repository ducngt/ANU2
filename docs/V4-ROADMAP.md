# ANU2 V4.0 incremental roadmap

V4 is delivered in controlled increments. No increment may remove a preserved V3 capability.

## Alpha 1 — foundation (this package)
- Admin-only AI/model configuration.
- Single active-role indicator in the header; no duplicate role block in the sidebar.
- i18n infrastructure with VI / EN / zh-CN catalogs and language switcher.
- Regression tests for role navigation and translation catalog parity.
- V3 Work / multi-agent / import / master data behavior preserved.

## Alpha 2 — real AI runtime
- Server/API gateway abstraction.
- Explicit provider health test.
- No silent fallback from real provider to mock.
- Provider/model configuration remains Admin-only.

## Alpha 3 — delegated Human–AI work
- Task-level Agent assignment and delegation UI.
- Capability, action, resource and time-scope authorization.
- Multi-agent orchestration with human checkpoints.

## Alpha 4 — universal multimodal intake
- Shared Work Artifact model.
- Document, image, audio, microphone and video inputs on every Work Item.
- Processing pipeline to evidence/provenance.

## Beta — full i18n and regression hardening
- All user-facing strings moved to catalogs.
- VI / EN / zh-CN coverage for every role and screen.
- Full preserved-feature regression matrix.
