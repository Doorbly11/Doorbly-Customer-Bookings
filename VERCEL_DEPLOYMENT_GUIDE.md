# Doorbly - Vercel Deployment Guide

This project is fully configured and ready for **1-click zero-configuration deployment on [Vercel](https://vercel.com)**.

---

## ⚡ Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and log in.
   - Select your GitHub repository (`doorbly`).
   - Vercel will automatically detect **Vite** as the framework preset.

3. **Configure Environment Variables (Optional)**:
   The project includes fallback defaults so it will build and run immediately. For custom Supabase databases or Gemini API keys, add these in Vercel's **Environment Variables** section:

   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Your live Supabase URL |
   | `VITE_SUPABASE_ANON_KEY` | `your-anon-key` | Your Supabase anonymous key |
   | `GEMINI_API_KEY` | `your-gemini-key` | Optional for server-side AI features |

4. **Click "Deploy"**:
   - Vercel will build the application in under 30 seconds.
   - Your live website will be accessible at `https://your-project.vercel.app`!

---

## 🚀 Method 2: Deploy via Vercel CLI (Instant)

If you have Node.js installed locally, you can deploy directly from your terminal:

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to Preview
vercel

# 4. Deploy to Production
vercel --prod
```

---

## 🛠 Pre-Configured Vercel Features in this Project

1. **`vercel.json`**:
   - Single Page Application (SPA) routing fallback: All URLs route smoothly to `index.html`.
   - **Direct APK Downloads**: Configured headers (`Content-Type: application/vnd.android.package-archive` and `Content-Disposition`) so `doorbly.apk` downloads and installs cleanly on mobile devices.
   - **PWA Service Worker**: Instant revalidation (`max-age=0, must-revalidate`) for `sw.js` and `registerSW.js` to ensure users always have the freshest app version upon new deployments.
   - **Digital Asset Links**: Proper `application/json` content-type header for `/.well-known/assetlinks.json` required for Google Play Trusted Web Activities (TWA).
   - **Long-term Caching**: Immutable 1-year cache headers for all compiled JS and CSS chunks in `/assets/`.

2. **Clean Builds**:
   - Build output automatically outputs to `dist`.
   - Standard Vite 6 + React 19 + Tailwind CSS 4 build pipeline.
