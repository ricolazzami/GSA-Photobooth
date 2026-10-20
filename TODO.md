# Implementation Checklist — Photobooth PWA

## Phase 1: UI Alignment — Google Stitch MCP Tokens
- [x] 1.1 Replace dark obsidian palette with Google Stitch MCP colors (white base, light gray surfaces, Google Blue primary)
- [x] 1.2 Update typography to Google Sans font family, weights 400/500/700
- [x] 1.3 Apply card shadow tokens, 8px border radius, 16px grid spacing
- [x] 1.4 Verify 72px min touch targets on all primary buttons

## Phase 2: Classic Photostrip Engine
- [x] 2.1 Camera manager with error states, 1080p resolution, front-facing constraint
- [x] 2.2 4-shot countdown (3-2-1) + 350ms flash animation, 1.5s interval
- [x] 2.3 1200×3600 canvas compositor, center-crop, PNG template overlay

## Phase 3: Backend & Storage
- [x] 3.1 `/api/upload.js` Vercel function with `@aws-sdk/client-s3`
- [x] 3.2 Cloudflare R2 upload, dynamic key `photobooth/{timestamp}.jpg`
- [x] 3.3 Request validation, 12MB size limit

## Phase 4: QR & Kiosk Polish
- [x] 4.1 Client-side QR generation with `qrcodejs`
- [x] 4.2 "Start Over" state reset, preserve camera stream
- [x] 4.3 Offline fallback: display error, enable long-press save
- [ ] 4.4 iPad Safari Guided Access end-to-end QA
