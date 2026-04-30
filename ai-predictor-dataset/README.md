# MediConnect AI predictor

Disease suggestion from symptoms (learning project — not medical advice).

**Production app:** FastAPI in `main.py` (`POST /predict`, `GET /symptoms`, `GET /health`). Deploy with **DEPLOY.md**.

**Patient app:** calls the **Node backend** at `/api/ai/*`, which proxies to `AI_SERVICE_URL` (full URL ending in `/predict`).

## Run locally (FastAPI)

```bash
cd ai-predictor-dataset
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python3 train_and_export.py   # if svc.pkl is missing
uvicorn main:app --host 0.0.0.0 --port 10000
```

In **backend** `.env`: `AI_SERVICE_URL=http://127.0.0.1:10000/predict`

## Legacy Flask (`api.py`)

```bash
python3 api.py   # http://127.0.0.1:5001 — only for local experiments
```

Or `./run.sh` (Flask on port 5001).
