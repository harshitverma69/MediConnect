# Deploy MediConnect AI predictor (FastAPI)

The production app is **`main.py`** (FastAPI). It loads `svc.pkl` and CSVs under `Dataset/` once at startup.

## URLs after deploy

- Health: `https://<your-service>.onrender.com/health`
- Symptoms: `https://<your-service>.onrender.com/symptoms`
- Predict: `https://<your-service>.onrender.com/predict`

Point the **Node backend** (Render/Vercel host for Express) at your Python service. Either form works; the API normalizes to `.../predict`:

```bash
AI_SERVICE_URL=https://<your-service>.onrender.com
# or
AI_SERVICE_URL=https://<your-service>.onrender.com/predict
```

The backend calls `.../symptoms` and `.../health` by swapping the path.

### If the app shows “Not Found” / symptoms never load

1. **Frontend** — Rebuild the patient app with **`VITE_BACKEND_URL`** set to your **deployed Express API** (not `http://localhost:4000`). If this is wrong, the browser calls localhost and symptoms fail.
2. **Backend** — On the same host as Express, set **`AI_SERVICE_URL`** to your **Python Render URL** (see above). Without it, `/api/ai/symptoms` returns 503.
3. **Smoke test** — Open `https://<your-express-api>/api/ai/health`. You want `aiServiceConfigured: true` and `upstreamReachable: true`. If `upstreamReachable` is false, the Python service URL is wrong or the AI service is sleeping/failed (check Render logs; confirm `svc.pkl` and `Dataset/` are in the deployed repo).
4. **Python service** — In a browser, open `https://<your-ai>.onrender.com/health` → should return `{"status":"ok"}`. Then `https://<your-ai>.onrender.com/symptoms` → JSON with a `symptoms` array.

## Render

1. Push this repo (ensure `svc.pkl` and `Dataset/` are committed — large files may need Git LFS if you hit limits).
2. **New** → **Web Service** → connect repository.
3. **Root directory**: `ai-predictor-dataset` (if the repo is the monorepo root).
4. **Runtime**: Python 3.
5. **Build command**: `pip install -r requirements.txt`
6. **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. **Health check path**: `/health` (recommended). The app also answers **`GET /`** and **`HEAD /`** with `200` so default probes to `/` do not return 404 — that pattern used to show as `HEAD HTTP/1.1" 404 Not Found` in logs and could restart the service.
8. Add env **`CORS_ORIGINS`** (optional): comma-separated origins, or leave unset for `*` (fine when only your backend calls this service).

Alternatively use **`render.yaml`** from this folder as a Blueprint.

## Railway

1. **New project** → **Deploy from GitHub** → select repo.
2. Set **Root directory** to `ai-predictor-dataset`.
3. Railway sets **`PORT`** automatically. **`Procfile`** in this folder runs:

   `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. If Railway does not pick the Procfile, set **Custom start command** to the same line (use `$PORT`).

## Local (same as production)

```bash
cd ai-predictor-dataset
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 10000
```

Backend `.env`:

```bash
AI_SERVICE_URL=http://127.0.0.1:10000/predict
```

## Train / refresh `svc.pkl`

If the model file is missing:

```bash
python3 train_and_export.py
```
