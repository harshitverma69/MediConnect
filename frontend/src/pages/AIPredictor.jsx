import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const AIPredictor = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); // now an array
  const [symptoms, setSymptoms] = useState([]); // fetched from backend
  const [predictionResult, setPredictionResult] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");

  // Fetch symptoms from backend on mount
  useEffect(() => {
    fetch("http://localhost:5001/symptoms")
      .then((res) => res.json())
      .then((data) => setSymptoms(data.symptoms || []));
  }, []);

  const handlePredict = async () => {
    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }
      setPredictionResult(data);
      setActiveCategory(""); // reset category view
    } catch (err) {
      alert("Prediction failed: " + err.message);
    }
  };

  const handleResultButtonClick = (type) => {
    setActiveCategory(type);
  };

  // Helper to render result details
  const renderResultDetails = () => {
    if (!predictionResult || !activeCategory)
      return (
        <p className="text-gray-500">
          Select a category above to view details.
        </p>
      );
    switch (activeCategory) {
      case "Diseases":
        return (
          <div>
            <h3 className="font-bold text-lg mb-2">Disease</h3>
            <p className="mb-2">{predictionResult.disease}</p>
            <p className="text-gray-600">{predictionResult.description}</p>
          </div>
        );
      case "Precautions":
        return (
          <div>
            <h3 className="font-bold text-lg mb-2">Precautions</h3>
            <ul className="list-disc ml-5">
              {predictionResult.precautions &&
              predictionResult.precautions.length > 0 ? (
                predictionResult.precautions[0].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <li>No data</li>
              )}
            </ul>
          </div>
        );
      case "Workout":
        return (
          <div>
            <h3 className="font-bold text-lg mb-2">Workout</h3>
            <ul className="list-disc ml-5">
              {predictionResult.workout &&
              predictionResult.workout.length > 0 ? (
                predictionResult.workout[0].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <li>No data</li>
              )}
            </ul>
          </div>
        );
      case "Diet":
        return (
          <div>
            <h3 className="font-bold text-lg mb-2">Diet</h3>
            <ul className="list-disc ml-5">
              {predictionResult.diet && predictionResult.diet.length > 0 ? (
                predictionResult.diet[0].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <li>No data</li>
              )}
            </ul>
          </div>
        );
      case "Medication":
        return (
          <div>
            <h3 className="font-bold text-lg mb-2">Medication</h3>
            <ul className="list-disc ml-5">
              {predictionResult.medications &&
              predictionResult.medications.length > 0 ? (
                predictionResult.medications[0].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <li>No data</li>
              )}
            </ul>
          </div>
        );
      default:
        return (
          <p className="text-gray-500">
            Select a category above to view details.
          </p>
        );
    }
  };

  // Multi-select handler
  const handleSymptomChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedSymptoms(options);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex items-center mb-8">
        <img src={logo} alt="MediConnect Logo" className="h-10 w-auto mr-3" />
        <span
          className="text-2xl font-sans font-semibold"
          style={{ color: "#008080" }}
        >
          MediConnect
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">AI Consultant</h1>
        <p className="text-gray-600 mb-8">
          Get personalized disease predictions, precautions, diet, workout, and
          medication plans based on your symptoms.
        </p>

        {/* Symptom Selector */}
        <div className="mb-6">
          <label htmlFor="symptoms" className="sr-only">
            Select symptoms
          </label>
          <div className="relative">
            <select
              id="symptoms"
              multiple
              value={selectedSymptoms}
              onChange={handleSymptomChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent h-48 bg-white text-gray-800 text-base"
              style={{
                minHeight: "12rem",
                fontFamily: "inherit",
                fontSize: "1rem",
                letterSpacing: "0.01em",
              }}
            >
              {symptoms.map((symptom, index) => (
                <option
                  key={index}
                  value={symptom}
                  className="py-2 px-2 hover:bg-teal-100"
                >
                  {symptom
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple symptoms.
          </div>
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSymptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium border border-teal-200"
                >
                  {sym
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={selectedSymptoms.length === 0}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#006400" }}
        >
          Predict
        </button>

        {/* Result Buttons */}
        {predictionResult && (
          <div className="mt-10 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleResultButtonClick("Diseases")}
              className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
            >
              Diseases
            </button>
            <button
              onClick={() => handleResultButtonClick("Precautions")}
              className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
            >
              Precautions
            </button>
            <button
              onClick={() => handleResultButtonClick("Workout")}
              className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
            >
              Workout
            </button>
            <button
              onClick={() => handleResultButtonClick("Diet")}
              className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
            >
              Diet
            </button>
            <button
              onClick={() => handleResultButtonClick("Medication")}
              className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
            >
              Medication
            </button>
          </div>
        )}
        {/* Display detailed results */}
        <div className="mt-6 text-left p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
          {renderResultDetails()}
        </div>
      </div>
    </div>
  );
};

export default AIPredictor;
