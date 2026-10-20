# User Flow — Photobooth PWA

## Happy Path (<40s)
```
Launch PWA fullscreen
→ [S1: Template Select] tap A or B
→ [S2: Camera Preview] check pose, tap "Start"
→ [S3: Capture] 4× countdown (3-2-1 → flash → click), 1.5s interval, progress dots
→ [S4: Result] see 1200×3600 strip, upload status, QR code appears
→ Scan QR with phone, save/share
→ Tap "Start Over" → back to S1
```

## Error Flows
- **Camera denied / HTTP:** Red banner "Camera unavailable — needs HTTPS & Safari permission", stay S2, back button active
- **Upload fail (offline / bad ENV):** S4 shows "Upload failed: [error]" + "QR unavailable", strip still visible — guest long-press save
- **Template PNG missing:** Card shows label, canvas renders white background (no overlay)
- **Exit mid-sequence:** No cancel button; wait 4 shots or refresh page

## Screen States
- **S1 `screen-template`:** Template cards A/B, tap → `selectedTemplate`, start camera
- **S2 `screen-camera`:** Live `<video>` mirrored, "Tap to Start" button, "← Change Template" back
- **S3 `screen-capture`:** `<video>` stream, `#countdown` 3-2-1, `#flash` 350ms, progress dots (1/4...4/4)
- **S4 `screen-result`:** `#result-img` (base64), `#qrcode` container, `#upload-status` text, `#download-link`, "Start Over" → `reset()`

## State Diagram
```
[S1 Template] --select--> [S2 Camera] --start--> [S3 Capture Loop] --composite--> [S4 Result] --reset--> [S1]
                  ↑             |                      |                                |
                  |         back to S1          countdown/flash/shot              upload→QR / offline fallback
```
