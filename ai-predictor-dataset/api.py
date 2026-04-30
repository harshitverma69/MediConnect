import math
import os
import sys

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS


def _json_safe(obj):
    """Convert numpy/pandas types and NaN/Inf to JSON-serializable values (strict JSON has no NaN)."""
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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "Dataset")
MODEL_PATH = os.path.join(BASE_DIR, "svc.pkl")


def _load_or_exit():
    if not os.path.isfile(MODEL_PATH):
        print(
            "\n  Missing svc.pkl — train the model once from this folder:\n"
            "    python3 -m venv .venv && source .venv/bin/activate\n"
            "    pip install -r requirements.txt\n"
            "    python3 train_and_export.py\n"
            "  Or run:  bash run.sh\n",
            file=sys.stderr,
        )
        sys.exit(1)

    model = joblib.load(MODEL_PATH)
    symptoms_df = pd.read_csv(os.path.join(DATASET_DIR, "symtoms_df.csv"))
    description = pd.read_csv(os.path.join(DATASET_DIR, "description.csv"))
    precautions = pd.read_csv(os.path.join(DATASET_DIR, "precautions_df.csv"))
    medications = pd.read_csv(os.path.join(DATASET_DIR, "medications.csv"))
    diets = pd.read_csv(os.path.join(DATASET_DIR, "diets.csv"))
    workout = pd.read_csv(os.path.join(DATASET_DIR, "workout_df.csv"))
    training_df = pd.read_csv(os.path.join(DATASET_DIR, "Training.csv"))

    symptom_columns = ["Symptom_1", "Symptom_2", "Symptom_3", "Symptom_4"]
    all_symptoms = set()
    for col in symptom_columns:
        all_symptoms.update(symptoms_df[col].dropna().str.strip())
    all_symptoms = sorted(list(all_symptoms))

    training_symptoms = list(training_df.columns[:-1])

    return (
        model,
        description,
        precautions,
        medications,
        diets,
        workout,
        training_symptoms,
    )


(
    model,
    description,
    precautions,
    medications,
    diets,
    workout,
    training_symptoms,
) = _load_or_exit()

app = Flask(__name__)
CORS(app)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        user_symptoms = data.get("symptoms", [])
        input_vector = [1 if symptom in user_symptoms else 0 for symptom in training_symptoms]
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
        return jsonify(_json_safe(payload))
    except Exception as e:
        print("Error in /predict:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify({"symptoms": training_symptoms})


if __name__ == "__main__":
    # Default 5001; override if busy: PREDICTOR_PORT=5002 python3 api.py (match VITE_PREDICTOR_URL in frontend)
    _port = int(os.environ.get("PREDICTOR_PORT", "5001"))
    print(f"Predictor API → http://127.0.0.1:{_port}")
    app.run(host="127.0.0.1", port=_port)
