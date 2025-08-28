# SPV & Associates — Deployment Guide (Vercel)

## 1) Create a Supabase project (if not already)
- https://supabase.com/ → New project → Free plan
- In SQL Editor: paste and run `supabase_schema.sql` from this folder

## 2) Get your keys
- Project Settings → API → copy:
  - Supabase URL
  - anon public key
  - service role key (KEEP PRIVATE)

## 3) Configure environment variables
Create a `.env.local` (for local) or set these in Vercel project Settings → Environment Variables:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
ADMIN_SECRET=choose_a_strong_admin_passcode
```

> `VITE_*` vars are exposed to the browser. `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_SECRET` remain private on the server.

## 4) Install & run locally
```
npm install
npm run dev
```

## 5) Deploy to Vercel
- Push to GitHub
- Import repo in https://vercel.com → **New Project**
- Framework: **Vite**
- Build Command: `vite build`
- Output Directory: `dist`
- Add the Environment Variables (see above)
- Deploy

## 6) Admin Panel
- Visit `/admin` on your deployed site
- Enter your **ADMIN_SECRET** (passcode) you set in env
- You’ll see flagged questions/answers; you can **Hide / Unhide / Delete** using the serverless API.

## 7) Security tightening (optional but recommended)
- In Supabase, restrict update/delete RLS policies for `questions`/`answers` so anon cannot update `is_hidden` or delete directly.
- Our serverless function uses the **service role key**, bypassing RLS safely on the server side.
- If you want, I can provide locked-down policies and an `rpc()` function alternative next.
