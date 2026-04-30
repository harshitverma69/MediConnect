import os
import sys

from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

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
        return jsonify(
            {
                "disease": disease,
                "description": desc,
                "precautions": pre,
                "medications": med,
                "diet": die,
                "workout": wrk,
            }
        )
    except Exception as e:
        print("Error in /predict:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify({"symptoms": training_symptoms})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001)
