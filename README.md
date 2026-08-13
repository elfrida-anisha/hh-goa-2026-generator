# HH Goa 2026 — Frame / Builder ID Generator

An event identity web tool created for **Hacker House Goa 2026**. Upload a photo, customize your builder profile, roll a title, and get a ready-to-share digital event credential and PFP frame in seconds.

🌐 **Live Website**: [https://hh-goa-2026-generator-three.vercel.app](https://hh-goa-2026-generator-three.vercel.app)

---

## ✨ Features

- **Format A — PFP Frame**: 1:1 square profile picture overlay (1080×1080 px) wrapped in HH Goa 2026 branding, location details, and role badge stickers.
- **Format B — Builder ID**: Social-media portrait event credential badge (1080×1350 px) featuring oversized typography, tech stack tags, builder title, scannable barcode, and pass ID `#HHG26-8942`.
- **Photo Upload Support**:
  - Accepts **JPG**, **PNG**, **WEBP**, and iPhone **HEIC** photo formats (with automatic client-side HEIC conversion via `heic2any`).
  - Automatic photo fitting, cover cropping, and interactive touch/mouse drag-to-pan positioning directly on canvas.
  - Scale, rotation, brightness, and contrast fine-tuning controls.
- **Title Randomizer**: Playful `GENERATE ANOTHER ↻` builder title randomizer (Product Hacker, Interface Architect, Autonomous Agent Wrangler, Code Cartographer, etc.).
- **High-Res PNG Export**: Client-side HTML5 Canvas rendering producing crisp 1080×1350 / 1080×1080 PNG downloads in < 50ms.
- **1-Click Share on X**: Opens Twitter/X post composer with pre-filled caption: `"Building, shipping and making things in Goa. See you at HH Goa 2026. 🌴 #FrameInGoa"`.
- **Mobile Responsive**: Fully optimized touch-friendly interface designed for mobile, tablet, and desktop viewports.
- **No Login Wall**: 100% client-side instant execution with zero friction.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Graphics Engine**: HTML5 Canvas API (Pure client-side high-res rendering)
- **HEIC Decoding**: `heic2any`
- **Icons**: `lucide-react`
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Commands

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/elfrida-anisha/hh-goa-2026-generator.git
   cd hh-goa-2026-generator
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 📜 License

Created for Hacker House Goa 2026 shortlisting task.
