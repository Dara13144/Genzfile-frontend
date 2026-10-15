# GenZ File - Frontend Web App

Modern, ultra-fast web application for GenZ File — cloud storage, media management, folder organization, image/video previews, GIF generator, CutLuy KHQR payment integration, and Supabase authentication.

## Features

- **Media & File Management**: High-speed upload, folder navigation, instant search, batch selection, and file streaming.
- **Media Previews & Viewers**: Fullscreen image gallery, in-browser video streaming player, and interactive animated GIF maker.
- **Sharing & Security**: Instant public link generation, password protection, and custom link expiration.
- **Supabase Authentication**: Integrated login, registration, and user profiles.
- **Khmer QR & Auto Payment**: Seamless upgrade plans with automated CutLuy QR payments.
- **Admin Dashboard**: Real-time user statistics, storage metrics, and moderation tools.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide Icons + Google Font (Inter & Kantumruy Pro)
- **Deployment**: Vercel / Netlify / Render ready

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env` and set your backend and Supabase URLs:
   ```bash
   cp .env.example .env
   ```

3. **Start local development**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
