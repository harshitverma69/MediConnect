"""
MediConnect disease predictor — FastAPI (production).
Model and CSVs load once at import; workers should stay at 1 if memory is tight.
"""
from __future__ import annotations

import logging
import math
import os
import sys
from typing import Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("predictor")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "Dataset")
MODEL_PATH = os.path.join(BASE_DIR, "svc.pkl")


def _json_safe(obj: Any) -> Any:
    if obj is None:
        return None
    if isinstance(obj, np.str_):
        return str(obj)
    if isinstance(obj, (str, bool)):
        return obj
    if isinstance(obj, dict):
        return {str(k): _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_json_safe(x) for x in obj]
    if isinstance(obj, np.ndarray):
        return _json_safe(obj.tolist())
    if isinstance(obj, np.generic):
        return _json_safe(obj.item())
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    if isinstance(obj, int):
        return obj
    try:
        if pd.isna(obj):
            return None
    except (ValueError, TypeError):
        pass
    return obj


def _load_resources():
    if not os.path.isfile(MODEL_PATH):
        log.error("Missing svc.pkl at %s", MODEL_PATH)
        print(
            "\n  Missing svc.pkl — from this folder run:\n"
            "    python3 -m venv .venv && source .venv/bin/activate\n"
            "    pip install -r requirements.txt\n"
            "    python3 train_and_export.py\n",
            file=sys.stderr,
        )
        sys.exit(1)

    model = joblib.load(MODEL_PATH)
    description = pd.read_csv(os.path.join(DATASET_DIR, "description.csv"))
    precautions = pd.read_csv(os.path.join(DATASET_DIR, "precautions_df.csv"))
    medications = pd.read_csv(os.path.join(DATASET_DIR, "medications.csv"))
    diets = pd.read_csv(os.path.join(DATASET_DIR, "diets.csv"))
    workout = pd.read_csv(os.path.join(DATASET_DIR, "workout_df.csv"))
    training_df = pd.read_csv(os.path.join(DATASET_DIR, "Training.csv"))
    training_symptoms = list(training_df.columns[:-1])

    return model, description, precautions, medications, diets, workout, training_symptoms


log.info("Loading model and datasets (once)…")
(
    model,
    description,
    precautions,
    medications,
    diets,
    workout,
    training_symptoms,
) = _load_resources()
log.info("Predictor ready (%d symptom columns).", len(training_symptoms))

app = FastAPI(title="MediConnect AI Predictor", version="1.0.0")

_cors = os.environ.get("CORS_ORIGINS", "*")
_origins = [o.strip() for o in _cors.split(",") if o.strip()] or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    symptoms: list[str] = Field(default_factory=list)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/symptoms")
def get_symptoms():
    log.info("GET /symptoms")
    return {"symptoms": training_symptoms}


@app.post("/predict")
def predict(body: PredictRequest):
    user_symptoms = body.symptoms or []
    log.info("POST /predict — %d symptom(s) submitted", len(user_symptoms))
    try:
        input_vector = [1 if s in user_symptoms else 0 for s in training_symptoms]
        prediction = model.predict([input_vector])[0]
        disease = description.iloc[prediction]["Disease"]
        desc = description.iloc[prediction]["Description"]
        pre = precautions[precautions["Disease"] == disease].values.tolist()
        med = medications[medications["Disease"] == disease].values.tolist()
        die = diets[diets["Disease"] == disease].values.tolist()
        wrk = workout[workout["disease"] == disease].values.tolist()
        payload = {
            "disease": disease,
            "description": desc,
            "precautions": pre,
            "medications": med,
            "diet": die,
            "workout": wrk,
        }
        out = _json_safe(payload)
        log.info("POST /predict — result disease=%s", disease)
        return out
    except Exception as e:
        log.exception("POST /predict failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e
