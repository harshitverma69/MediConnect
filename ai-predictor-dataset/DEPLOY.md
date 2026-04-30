# Deploy MediConnect AI predictor (FastAPI)

The production app is **`main.py`** (FastAPI). It loads `svc.pkl` and CSVs under `Dataset/` once at startup.

## URLs after deploy

- Health: `https://<your-service>.onrender.com/health`
- Symptoms: `https://<your-service>.onrender.com/symptoms`
- Predict: `https://<your-service>.onrender.com/predict`

Point the Node backend at the **full predict URL**:

```bash
AI_SERVICE_URL=https://<your-service>.onrender.com/predict
```

The backend derives the symptoms URL by replacing `/predict` with `/symptoms`.

## Render

1. Push this repo (ensure `svc.pkl` and `Dataset/` are committed — large files may need Git LFS if you hit limits).
2. **New** → **Web Service** → connect repository.
3. **Root directory**: `ai-predictor-dataset` (if the repo is the monorepo root).
4. **Runtime**: Python 3.
5. **Build command**: `pip install -r requirements.txt`
6. **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. **Health check path**: `/health`
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
