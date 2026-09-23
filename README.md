# ANU2 V5.2 — Multimodal Processing Runtime

V5.2 keeps the V5 Domain Intelligence architecture (LIS, RIS, SIS, PIS, OIS, FIS, FMS) and upgrades Human–AI work so binary Artifacts can be processed by the configured AI provider instead of only being stored as metadata.

## V5.2 additions
- Universal Human input in Work Items: text, direct speech, documents, images, audio and video.
- The Admin Data Intake screen now also has direct speech, an AI request composer, file intake and an authorized Human–AI data-intake Work Item.
- New `MultimodalProcessor` writes AI-processed content back to the governed Artifact with provider/model/provenance metadata.
- Work-item AI consumes processed Artifact content automatically when the delegated assignment allows READ / READ_FILE / ANALYZE.
- `AI Nhập dữ liệu` may READ_FILE, MAP_FIELDS, ANALYZE, CREATE_DRAFT and WRITE_STAGING; master-data commit remains `BEFORE_COMMIT` Human checkpoint.
- No silent claim that a file was read. Unsupported provider/media combinations fail explicitly.

## Browser trial provider matrix
- TXT / MD / CSV / JSON: local text extraction.
- Gemini: inline multimodal processing for PDF, image, audio, video and other MIME types supported by the selected Gemini model.
- OpenAI / OpenRouter / OpenAI-compatible: image analysis with a vision-capable model.
- OpenAI: uploaded audio transcription through `gpt-4o-mini-transcribe`.
- Other unsupported combinations return an explicit error.

## Important browser limitation
GitHub Pages remains an experimental client-side runtime. Binary bytes exist only in the current browser tab/session. After a reload, metadata remains but the original file must be selected again before re-processing. Production should move API credentials, file bytes, object storage and multimodal processing to a secure backend gateway.

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

See `docs/V5.2-MULTIMODAL-RUNTIME.md` and `docs/V5-ARCHITECTURE.md`.
