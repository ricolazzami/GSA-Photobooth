# Test Plan — Photobooth PWA

## 1. Overview
Validation suite: camera streaming, canvas compositing, R2 upload, QR generation, iPad kiosk UX.

---

## 2. Test Cases

### TC-01: PWA Shell & Standalone Mode
- **Target:** iPad Safari PWA
- **Action:** Add to Home Screen, launch
- **Expected:** Fullscreen, no browser chrome, white background per Stitch MCP

### TC-02: Camera Feed & Mirroring
- **Target:** Camera stream (`app.js`)
- **Action:** Request front camera (`facingMode: 'user'`)
- **Expected:** 1080p stream starts <1.5s, mirrored display (`scaleX(-1)`), permission error banner if denied

### TC-03: 4-Shot Sequence & Canvas Compositing
- **Target:** Capture loop & compositor
- **Action:** Select Template A, tap "Start"
- **Expected:**
  - 4 shots: 3-2-1 countdown, 350ms flash, 1.5s interval
  - Progress dots (1/4...4/4) update correctly
  - Final 1200×3600 canvas: template overlay applied, center-crop no distortion

### TC-04: Cloudinary Upload
- **Target:** `/api/upload.js`
- **Action:** POST base64 JPEG
- **Expected:** 200 OK, public URL returned, image at `photobooth/{timestamp}` folder, 12MB limit enforced

### TC-05: QR Code Generation
- **Target:** QR display
- **Action:** Receive upload URL
- **Expected:** QR renders <200ms, scan opens R2 URL on phone, "Start Over" resets state

### TC-06: Offline Fallback
- **Target:** Network failure
- **Action:** Trigger upload with network off
- **Expected:** Error message, strip visible, instruction to long-press save

### TC-07: Template PNG Missing
- **Target:** Template overlay
- **Action:** Remove template-a.png, capture
- **Expected:** Card shows label, canvas renders white background (no crash)
