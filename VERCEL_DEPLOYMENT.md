# Vercel Deployment Guide

This project is configured for deployment on both **Replit** (development) and **Vercel** (production).

## Project Architecture

The app uses a **dual-entry architecture**:

### For Replit/Local Development
- Entry: `server/index.ts`
- Starts Express server with `server.listen()` on port 5000
- Includes Vite dev server with HMR
- Serves both API and frontend

### For Vercel Production
- Entry: `api/[...slug].ts` (serverless catch-all function)
- Reconstructs URL path from Vercel's slug parameter
- Exports Express app without starting a server
- Frontend built to `dist/public` (static assets)
- API routes handled by serverless function

## Deployment Steps

### 1. Prerequisites

You need a [Vercel account](https://vercel.com) and the Vercel CLI (optional):

```bash
npm i -g vercel
```

### 2. Environment Variables

Add these environment variables in your Vercel project settings:

#### Required (if using Supabase):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key

> **Note:** The app will fall back to in-memory storage if Supabase credentials are not provided, but data will be lost on each deployment.

### 3. Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to [vercel.com/new](https://vercel.com/new)**

3. **Import your repository**

4. **Configure the project:**
   - Framework Preset: **Other** (already configured via vercel.json)
   - Root Directory: `.` (leave as root)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist/public` (auto-detected from vercel.json)
   - Install Command: `npm install` (auto-detected)

5. **Add Environment Variables** (Settings → Environment Variables):
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

6. **Click Deploy**

### 4. Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## How It Works

### Routing

Vercel automatically routes requests based on file structure:

- **API requests** (`/api/*`) → routed to `api/[...slug].ts` catch-all serverless function
  - The handler reconstructs the full path from Vercel's `slug` parameter
  - Example: `/api/text-entries` → handler receives `slug=['text-entries']` → rebuilds as `/api/text-entries` → Express routes correctly
- **All other requests** (`/*`) → served from `dist/public` static build
- **SPA routing** → handled by Vite's built-in fallback to `index.html`

### Build Process

When you run `npm run build`:

1. **Frontend build**: `vite build` → outputs to `dist/public`
2. **Backend build**: `esbuild server/index.ts` → outputs to `dist/index.js`

For Vercel deployment:
- Frontend: Static files from `dist/public` served via CDN
- Backend: `api/index.ts` compiled and run as serverless function

## File Structure

```
project/
├── api/
│   ├── [...slug].ts      # Vercel catch-all handler (reconstructs URL path)
│   └── package.json      # Module type config
├── server/
│   ├── app.ts            # Shared Express app factory
│   ├── index.ts          # Replit/local entry (starts server)
│   ├── routes.ts         # [DEPRECATED - moved to app.ts]
│   ├── storage.ts        # Database abstraction
│   └── vite.ts           # Vite dev middleware
├── client/               # React frontend
├── dist/
│   ├── public/           # Built frontend (Vercel serves this)
│   └── index.js          # Built backend (Replit uses this)
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies & scripts
```

## API Routes

All API routes are prefixed with `/api`:

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/text-entries` - Get all text entries
- `POST /api/text-entries` - Create new text entry

## Storage Options

### Supabase (Production Recommended)
Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables.

### In-Memory (Development/Testing)
If Supabase credentials are not set, the app uses in-memory storage. **Data will be lost on redeploy.**

## Troubleshooting

### 404 Errors on Routes

If you get 404 errors:
1. Ensure `vercel.json` is properly configured
2. Check that build output is in `dist/public`
3. Verify API routes start with `/api`

### Serverless Function Timeout

Vercel free tier has a 10-second timeout. Upgrade to Pro for 60 seconds if needed.

### Cold Starts

First request after inactivity may be slow (serverless cold start). This is normal.

### Build Failures

If build fails:
```bash
# Test build locally first
npm run build

# Check that dist/public and dist/index.js are created
ls -la dist/
```

## Local Testing

To test the production build locally:

```bash
# Build the project
npm run build

# Run production server
npm run start
```

Visit `http://localhost:5000`

## Differences: Replit vs Vercel

| Feature | Replit | Vercel |
|---------|--------|--------|
| **Server Type** | Always-on | Serverless (on-demand) |
| **Entry Point** | `server/index.ts` | `api/index.ts` |
| **Port** | 5000 (fixed) | N/A (serverless) |
| **HMR** | Yes (Vite dev server) | No (static build) |
| **Database** | Built-in PostgreSQL option | External (Supabase, Neon, etc) |
| **Environment** | Dev-friendly, persistent | Production, auto-scaling |

## Next Steps

1. Set up Supabase project if you haven't already
2. Configure environment variables in Vercel dashboard
3. Deploy and test your API endpoints
4. Set up custom domain (optional)
5. Monitor deployment logs in Vercel dashboard

---

For questions or issues, check the [Vercel documentation](https://vercel.com/docs) or [Supabase documentation](https://supabase.com/docs).
