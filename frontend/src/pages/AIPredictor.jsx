import React, { useState } from 'react';
import logo from '../assets/logo.png'; // Assuming logo.png is the desired logo

const AIPredictor = () => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [predictionResult, setPredictionResult] = useState(null); // To store results later

  // Placeholder symptoms - replace with actual data source if available
  const symptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Sore Throat', 'Shortness of Breath', 'Muscle Aches'
  ];

  const handlePredict = () => {
    // Placeholder prediction logic
    console.log('Predicting based on:', selectedSymptom);
    // In a real app, you would call an API here
    setPredictionResult({
      disease: 'Common Cold',
      precautions: ['Rest', 'Hydrate', 'Wash hands frequently'],
      workout: 'Light walking',
      diet: 'Warm soup, fluids',
      medication: 'Over-the-counter cold medicine'
    });
  };

  const handleResultButtonClick = (type) => {
    console.log('Showing result for:', type);
    // Logic to display specific part of the predictionResult
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex items-center mb-8">
        <img src={logo} alt="MediConnect Logo" className="h-10 w-auto mr-3" />
        <span className="text-2xl font-sans font-semibold" style={{ color: '#008080' }}> {/* Dark Teal */}
          MediConnect
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">AI Consultant</h1>
        <p className="text-gray-600 mb-8">
          Get personalized disease predictions, precautions, diet, workout, and medication plans based on your symptoms.
        </p>

        {/* Symptom Selector */}
        <div className="mb-6">
          <label htmlFor="symptoms" className="sr-only">Select symptoms</label>
          <select
            id="symptoms"
            value={selectedSymptom}
            onChange={(e) => setSelectedSymptom(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="" disabled>Select symptoms</option>
            {symptoms.map((symptom, index) => (
              <option key={index} value={symptom}>{symptom}</option>
            ))}
          </select>
        </div>

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={!selectedSymptom}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#006400' }} // Dark Green
        >
          Predict
        </button>

        {/* Result Buttons (Placeholder - shown after prediction) */}
        {predictionResult && (
          <div className="mt-10 grid grid-cols-2 gap-4">
            <button onClick={() => handleResultButtonClick('Diseases')} className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200">Diseases</button>
            <button onClick={() => handleResultButtonClick('Precautions')} className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200">Precautions</button>
            <button onClick={() => handleResultButtonClick('Workout')} className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200">Workout</button>
            <button onClick={() => handleResultButtonClick('Diet')} className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200">Diet</button>
            <button onClick={() => handleResultButtonClick('Medication')} className="bg-white text-gray-700 py-3 px-5 rounded-full shadow-md hover:shadow-lg transition duration-300 border border-gray-200">Medication</button>
             {/* Removed the duplicate 'Precautions' button as discussed */}
          </div>
        )}
         {/* Placeholder for displaying detailed results */}
         <div className="mt-6 text-left p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
            {/* Detailed results will be displayed here based on button clicks */}
            <p className="text-gray-500">Select a category above to view details.</p>
         </div>
      </div>
    </div>
  );
};

export default AIPredictor;