import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const AIPredictor = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const PREDICTOR_URL = import.meta.env.VITE_PREDICTOR_URL || "http://localhost:5001";

  useEffect(() => {
    fetch(`${PREDICTOR_URL}/symptoms`)
      .then((res) => res.json())
      .then((data) => setSymptoms(data.symptoms || []))
      .catch(() => toast.error("Could not load symptoms. Is the predictor API running?"));
  }, [PREDICTOR_URL]);

  const handlePredict = async () => {
    try {
      const response = await fetch(`${PREDICTOR_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }
      setPredictionResult(data);
      setActiveCategory("");
      toast.success("Analysis ready — explore the sections below.");
    } catch (err) {
      toast.error(err.message || "Prediction failed");
    }
  };

  const handleResultButtonClick = (type) => {
    setActiveCategory(type);
  };

  const normalizeField = (field) => {
    if (!field) return [];
    let items = [];
    if (Array.isArray(field) && Array.isArray(field[0])) {
      items = field[0];
    } else if (Array.isArray(field)) {
      items = field;
    } else if (typeof field === "string") {
      const s = field.trim();
      if (s.startsWith("[") && s.endsWith("]")) {
        try {
          items = JSON.parse(s.replace(/'/g, '"'));
        } catch {
          items = [field];
        }
      } else {
        items = [field];
      }
    } else {
      return [];
    }

    items = items.flatMap((it) => {
      if (typeof it === 'string') {
        const s = it.trim();
        if (s.startsWith('[') && s.endsWith(']')) {
          try {
            return JSON.parse(s.replace(/'/g, '"'));
          } catch {
            return [it];
          }
        }
        return [it];
      }
      return Array.isArray(it) ? it : [it];
    });

    const disease = (predictionResult?.disease || "").toString().trim().toLowerCase();
    items = items.filter((it) => {
      if (it === null || it === undefined) return false;
      const s = typeof it === 'string' ? it.toString().trim() : String(it);
      if (s.length === 0) return false;
      if (/^\d+(?:\.\d+)?$/.test(s)) return false;
      if (s.toLowerCase() === disease) return false;
      return true;
    });

    const seen = new Set();
    const cleaned = [];
    for (const it of items) {
      const val = typeof it === 'string' ? it.trim() : String(it);
      if (!seen.has(val)) {
        seen.add(val);
        cleaned.push(val);
      }
    }
    return cleaned;
  };

  const renderResultDetails = () => {
    if (!predictionResult || !activeCategory)
      return (
        <p className="text-sm text-muted">
          Run a prediction, then tap a category to see structured guidance.
        </p>
      );

    switch (activeCategory) {
      case "Diseases":
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-ink">Condition</h3>
            <p className="text-xl font-semibold text-primary">{predictionResult.disease}</p>
            <p className="text-sm leading-relaxed text-muted">{predictionResult.description}</p>
          </div>
        );
      case "Precautions":
        return (
          <div>
            <h3 className="mb-3 text-lg font-bold text-ink">Precautions</h3>
            <ul className="space-y-2 text-sm text-muted">
              {(() => {
                const items = normalizeField(predictionResult.precautions);
                return items && items.length > 0 ? (
                  items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li>No data</li>
                );
              })()}
            </ul>
          </div>
        );
      case "Workout":
        return (
          <div>
            <h3 className="mb-3 text-lg font-bold text-ink">Workout</h3>
            <ul className="space-y-2 text-sm text-muted">
              {(() => {
                const items = normalizeField(predictionResult.workout);
                return items && items.length > 0 ? (
                  items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li>No data</li>
                );
              })()}
            </ul>
          </div>
        );
      case "Diet":
        return (
          <div>
            <h3 className="mb-3 text-lg font-bold text-ink">Diet</h3>
            <ul className="space-y-2 text-sm text-muted">
              {(() => {
                const items = normalizeField(predictionResult.diet);
                return items && items.length > 0 ? (
                  items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li>No data</li>
                );
              })()}
            </ul>
          </div>
        );
      case "Medication":
        return (
          <div>
            <h3 className="mb-3 text-lg font-bold text-ink">Medication</h3>
            <ul className="space-y-2 text-sm text-muted">
              {(() => {
                const items = normalizeField(predictionResult.medications);
                return items && items.length > 0 ? (
                  items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li>No data</li>
                );
              })()}
            </ul>
          </div>
        );
      default:
        return <p className="text-sm text-muted">Select a category.</p>;
    }
  };

  const handleSymptomChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedSymptoms(options);
  };

  const resultTabs = [
    ["Diseases", "Overview"],
    ["Precautions", "Precautions"],
    ["Workout", "Workout"],
    ["Diet", "Diet"],
    ["Medication", "Medication"],
  ];

  return (
    <div className="pb-20">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark p-8 text-white shadow-card sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <img src={assets.logo} alt="" className="h-10 w-auto rounded-lg bg-white/95 px-2 py-1 shadow-sm" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-100">MediConnect</p>
            <h1 className="text-2xl font-bold sm:text-3xl">AI symptom assistant</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-teal-50">
          Educational demo: select symptoms, run analysis, then review precautions, diet, and more. This is not a substitute for professional care.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl bg-card p-6 shadow-card ring-1 ring-slate-200/80 sm:p-8">
          <h2 className="text-lg font-bold text-ink">Your symptoms</h2>
          <p className="mt-1 text-sm text-muted">Hold Ctrl / Cmd to multi-select in the list.</p>

          <label htmlFor="symptoms" className="sr-only">Symptoms</label>
          <select
            id="symptoms"
            multiple
            value={selectedSymptoms}
            onChange={handleSymptomChange}
            className="mt-4 h-52 w-full rounded-xl border border-slate-200 bg-surface px-3 py-2 text-sm text-ink outline-none ring-primary/20 focus:border-primary focus:ring-2"
          >
            {symptoms.map((symptom, index) => (
              <option key={index} value={symptom}>
                {symptom.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          {selectedSymptoms.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSymptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-primary-muted px-3 py-1 text-xs font-semibold text-primary-dark ring-1 ring-primary/20"
                >
                  {sym.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handlePredict}
            disabled={selectedSymptoms.length === 0}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-45"
          >
            Run analysis
          </button>
          <p className="mt-2 text-xs text-muted">API: {PREDICTOR_URL}</p>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card ring-1 ring-slate-200/80 sm:p-8">
          <h2 className="text-lg font-bold text-ink">Results</h2>
          <p className="mt-1 text-sm text-muted">After a run, choose a section to read details.</p>

          {predictionResult && (
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {resultTabs.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleResultButtonClick(key)}
                  className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
                    activeCategory === key
                      ? "bg-primary text-white shadow-md"
                      : "bg-surface text-ink ring-1 ring-slate-200 hover:ring-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 min-h-[120px] rounded-xl border border-slate-100 bg-surface/50 p-5">
            {renderResultDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictor;
