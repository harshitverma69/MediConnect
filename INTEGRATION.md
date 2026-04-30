# Two URLs: how they connect

You run **two** deployed services. Each has one job:

| URL | What it is | Who talks to it |
|-----|------------|-----------------|
| **Backend (Express)** | Node API: `/api/user`, `/api/doctor`, `/api/ai/*`, … | **Browser** (patient app) |
| **AI predictor (FastAPI)** | Python: `/health`, `/symptoms`, `/post` `/predict` | **Only Express** (server-to-server) |

## 1) Frontend (Vite build — Vercel / Netlify / Render static)

Set **exactly one** variable to your **Express** public URL (no `/api` suffix):

```bash
VITE_BACKEND_URL=https://YOUR-EXPRESS-SERVICE.onrender.com
```

Then **rebuild** the site. The browser never calls the Python URL for symptoms; it calls Express, which proxies to Python.

## 2) Backend (Express — Render Web Service)

Set **exactly one** variable to your **Python** public URL (base or `.../predict` both work):

```bash
AI_SERVICE_URL=https://YOUR-AI-SERVICE.onrender.com
```

Restart the Node service.

## 3) Verify in the browser

1. `https://YOUR-EXPRESS.../api/doctor/list` → JSON with `"success":true`
2. `https://YOUR-EXPRESS.../api/config` → JSON with `aiPredictorConfigured: true` and `aiPredictorHost` set
3. `https://YOUR-EXPRESS.../api/ai/health` → JSON, `upstreamReachable: true` after the AI service wakes up
4. `https://YOUR-AI.../health` → `{"status":"ok"}`

If (1) works but (2) shows `aiPredictorConfigured: false`, `AI_SERVICE_URL` is missing **on the Express service**, not on the frontend.

If the AI predictor page still errors, the **API base** shown on that page must match the same host as (1).
