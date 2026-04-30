"""
Train SVC on Dataset/Training.csv and write svc.pkl (same format api.py expects).
Run once from this folder:  python3 train_and_export.py
"""
import os
import joblib
import pandas as pd
from sklearn.svm import SVC

BASE = os.path.dirname(os.path.abspath(__file__))
training_path = os.path.join(BASE, "Dataset", "Training.csv")
desc_path = os.path.join(BASE, "Dataset", "description.csv")

training = pd.read_csv(training_path)
desc = pd.read_csv(desc_path)

# Fix known typos / spacing mismatches between Training.csv and description.csv
FIX_LABEL = {
    "Peptic ulcer diseae": "Peptic ulcer disease",
    "Diabetes ": "Diabetes",
    "Hypertension ": "Hypertension",
    "(vertigo) Paroymsal  Positional Vertigo": "(vertigo) Paroymsal Positional Vertigo",
}

X = training.drop(columns=["prognosis"])
y_raw = training["prognosis"].map(lambda s: FIX_LABEL.get(s, s))

disease_to_idx = {d: i for i, d in enumerate(desc["Disease"])}
missing = set(y_raw.unique()) - set(disease_to_idx.keys())
if missing:
    raise SystemExit(f"Training labels not in description.csv: {missing}")

y = y_raw.map(disease_to_idx)

model = SVC(kernel="linear", C=0.1)
model.fit(X, y)

out = os.path.join(BASE, "svc.pkl")
joblib.dump(model, out)
print(f"Saved {out} ({len(X)} rows, {X.shape[1]} features)")
