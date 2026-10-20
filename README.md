# Photobooth PWA — iPad Gen 11

Kiosk-ready classic photostrip PWA for iPad Gen 11 (A16 Bionic) running Safari in Guided Access mode. 4-shot automated sequence, 1200×3600 canvas compositing, Cloudinary uploads, instant QR distribution.

---

## Features
- **Classic Photostrip:**
  - 4-shot automated capture with 3-2-1 countdown and 350ms flash
  - 1200×3600 canvas composite with PNG template overlays
  - Center-crop photo slots without distortion
- **Cloud Storage:**
  - Vercel Serverless Function (`/api/upload.js`) with Cloudinary API
  - Instant public URL generation, CDN delivery
  - Client-side QR code generation (`qrcodejs`)
- **Kiosk Optimized:**
  - iPadOS Safari PWA standalone mode
  - 72px min touch targets, Google Stitch UI design tokens

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Locally
```bash
npm run dev
# Or run with vercel dev
vercel dev
```

---

## Documentation Suite
- [PRD.md](PRD.md) — Product requirements, iPad hardware specs
- [DESIGN.md](DESIGN.md) — Google Stitch MCP design tokens, touch layout
- [USERFLOW.md](USERFLOW.md) — Guest workflow, state screens, error handling
- [ENVIRONMENT.md](ENVIRONMENT.md) — Cloudinary configuration
- [TEST_PLAN.md](TEST_PLAN.md) — Test cases, QA scenarios
- [TODO.md](TODO.md) — Implementation roadmap
