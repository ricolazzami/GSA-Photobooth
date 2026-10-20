# PRD — Photobooth PWA (iPad Gen 11)

## 1. Executive Summary
Classic photostrip PWA for iPad Gen 11 kiosk deployment. 4-shot automated sequence with countdown animations, flash effects, template overlays, instant Cloudflare R2 upload, and QR code distribution for guest downloads.

## 2. Target Hardware & Environment
- **Device:** iPad Gen 11 (A16 Bionic, 11" Retina, 120Hz touch)
- **OS:** iPadOS 17+ Safari standalone PWA
- **Network:** Venue Wi-Fi with offline fallback (long-press save)
- **Camera:** Front-facing FaceTime HD camera

## 3. Core Workflow
1. Select template (A/B layout options)
2. Preview camera feed (mirrored)
3. Tap Start → 4 captures (3-2-1 countdown, 350ms flash, 1.5s interval)
4. Composite onto 1200×3600 canvas with PNG template overlay
5. Upload to R2, display QR code for download

## 4. Functional Requirements
- **F1 (PWA Shell):** Standalone mode, 72px min touch targets, Google Stitch UI tokens
- **F2 (Camera Stream):** `getUserMedia` 1080p front-facing, mirrored display
- **F3 (Capture Engine):** Sequential canvas rendering, center-crop compositing
- **F4 (Cloud Storage):** Base64 → `/api/upload.js` → Cloudinary via native fetch
- **F5 (QR Generator):** Client-side `qrcodejs` instant rendering
