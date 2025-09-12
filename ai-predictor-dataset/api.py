from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and data
model = joblib.load('svc.pkl')
symptoms_df = pd.read_csv('Dataset/symtoms_df.csv')
description = pd.read_csv('Dataset/description.csv')
precautions = pd.read_csv('Dataset/precautions_df.csv')
medications = pd.read_csv('Dataset/medications.csv')
diets = pd.read_csv('Dataset/diets.csv')
workout = pd.read_csv('Dataset/workout_df.csv')
training_df = pd.read_csv('Dataset/Training.csv')

# Extract all unique symptoms from the columns Symptom_1 to Symptom_4
symptom_columns = ['Symptom_1', 'Symptom_2', 'Symptom_3', 'Symptom_4']
all_symptoms = set()
for col in symptom_columns:
    all_symptoms.update(symptoms_df[col].dropna().str.strip())
all_symptoms = sorted(list(all_symptoms))

# Use the exact symptom list (feature names) from Training.csv for input vector
training_symptoms = list(training_df.columns[:-1])  # Exclude the last column (prognosis)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        user_symptoms = data.get('symptoms', [])
        # Create input vector based on training symptom list
        input_vector = [1 if symptom in user_symptoms else 0 for symptom in training_symptoms]
        prediction = model.predict([input_vector])[0]
        disease = description.iloc[prediction]['Disease']
        desc = description.iloc[prediction]['Description']
        pre = precautions[precautions['Disease'] == disease].values.tolist()
        med = medications[medications['Disease'] == disease].values.tolist()
        die = diets[diets['Disease'] == disease].values.tolist()
        wrk = workout[workout['disease'] == disease].values.tolist()
        return jsonify({
            'disease': disease,
            'description': desc,
            'precautions': pre,
            'medications': med,
            'diet': die,
            'workout': wrk
        })
    except Exception as e:
        print("Error in /predict:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    # Return the list of symptoms used for model input (from Training.csv)
    return jsonify({'symptoms': training_symptoms})

if __name__ == '__main__':
    app.run(port=5001)