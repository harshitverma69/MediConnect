import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const formatSymptomLabel = (symptom) =>
  symptom.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Express returns JSON; HTML means VITE_BACKEND_URL points at the wrong host (e.g. frontend SPA). */
async function readApiJson(res, requestUrl) {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("text/html")) {
    throw new Error(
      `Response was HTML (Content-Type: text/html), not JSON — usually the frontend host or a 404 page, not your API. ` +
        `Set VITE_BACKEND_URL at build time to your Express server (e.g. https://YOUR-API.onrender.com), redeploy the frontend, then hard-refresh. ` +
        `Tried: ${requestUrl}`
    );
  }
  const text = await res.text();
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(
      `Empty response from ${requestUrl}. Set VITE_BACKEND_URL to your deployed Node/Express API (same URL you use for the rest of the app).`
    );
  }
  const looksHtml =
    /^<!/i.test(trimmed) ||
    /^<html/i.test(trimmed) ||
    /<!doctype html/i.test(trimmed);
  if (looksHtml) {
    throw new Error(
      `That URL returned a web page (HTML), not your API. ` +
        `Rebuild the frontend with VITE_BACKEND_URL set to your Express server only — e.g. https://YOUR-BACKEND.onrender.com — ` +
        `not the Vercel/Netlify frontend URL. Request: ${requestUrl}`
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    const snippet = trimmed.slice(0, 80);
    const express404 = /^cannot get\//i.test(trimmed);
    throw new Error(
      express404
        ? `No route on this host (${requestUrl}). Often VITE_BACKEND_URL is wrong, or the backend was deployed without /api/ai. Snippet: ${snippet}`
        : `Invalid JSON from API (${requestUrl}). Start: ${snippet}… — check VITE_BACKEND_URL and backend deploy.`
    );
  }
}

const AIPredictor = () => {
  const { backendUrl, prodBackendEnvMissing } = useContext(AppContext);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [symptomPanelOpen, setSymptomPanelOpen] = useState(false);
  const [symptomSearch, setSymptomSearch] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    if (!backendUrl) return;
    const load = async () => {
      const healthUrl = `${backendUrl}/api/ai/health`;
      const symptomsUrl = `${backendUrl}/api/ai/symptoms`;
      try {
        const healthRes = await fetch(healthUrl);
        const healthData = await readApiJson(healthRes, healthUrl);
        if (!healthData.aiServiceConfigured) {
          toast.warn(
            "Backend has no AI_SERVICE_URL. Add it on your Node host (Python service base URL), restart the API, then reload."
          );
        } else if (!healthData.upstreamReachable) {
          toast.warn(
            `Python AI service not reachable from backend (${healthData.aiServiceHost || "check URL"}). Verify AI is up and AI_SERVICE_URL matches it.`
          );
        }

        const res = await fetch(symptomsUrl);
        const data = await readApiJson(res, symptomsUrl);
        if (!res.ok) {
          throw new Error(
            data.message ||
              data.detail ||
              "Could not load symptoms. Deployed API must set AI_SERVICE_URL to your Python service."
          );
        }
        setSymptoms(data.symptoms || []);
      } catch (e) {
        const hint =
          e.message === "Failed to fetch"
            ? " Cannot reach backend — set VITE_BACKEND_URL at build time to your live API (not localhost)."
            : "";
        toast.error((e.message || "Could not load symptoms.") + hint);
      }
    };
    load();
  }, [backendUrl]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) setSymptomPanelOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setSymptomPanelOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filteredSymptoms = useMemo(() => {
    const q = symptomSearch.trim().toLowerCase();
    if (!q) return symptoms;
    return symptoms.filter(
      (s) =>
        s.toLowerCase().includes(q) || formatSymptomLabel(s).toLowerCase().includes(q)
    );
  }, [symptoms, symptomSearch]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((x) => x !== symptom) : [...prev, symptom]
    );
  };

  const selectFilteredVisible = () => {
    setSelectedSymptoms((prev) => {
      const set = new Set(prev);
      filteredSymptoms.forEach((s) => set.add(s));
      return Array.from(set);
    });
  };

  const clearSelection = () => setSelectedSymptoms([]);

  const handlePredict = async () => {
    const predictUrl = `${backendUrl}/api/ai/predict`;
    try {
      const response = await fetch(predictUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      const data = await readApiJson(response, predictUrl);
      if (!response.ok) {
        const msg =
          data.message ||
          (typeof data.detail === "string" ? data.detail : null) ||
          data.error ||
          "Prediction failed";
        throw new Error(msg);
      }
      setPredictionResult(data);
      setActiveCategory("");
      setSymptomPanelOpen(false);
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

  const resultTabs = [
    ["Diseases", "Overview"],
    ["Precautions", "Precautions"],
    ["Workout", "Workout"],
    ["Diet", "Diet"],
    ["Medication", "Medication"],
  ];

  return (
    <div className="pb-20">
      {prodBackendEnvMissing && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ring-1 ring-amber-200"
        >
          <p className="font-bold">API URL not set for this production build</p>
          <p className="mt-1 text-amber-900/90">
            In Vercel / Netlify / Cloudflare Pages, add environment variable{" "}
            <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">VITE_BACKEND_URL</code>{" "}
            = your Express server (e.g. <code className="font-mono text-xs">https://your-api.onrender.com</code>
            ), then <strong>redeploy</strong>. Vite bakes this in at build time — restarting the app is not enough if
            the variable was missing when the site was built.
          </p>
        </div>
      )}
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
          <p className="mt-1 text-sm text-muted">
            Open the list, search, and tick several symptoms — no keyboard shortcuts needed.
          </p>

          <div className="relative mt-4" ref={panelRef}>
            <button
              type="button"
              id="symptom-multiselect-trigger"
              aria-haspopup="listbox"
              aria-expanded={symptomPanelOpen}
              onClick={() => setSymptomPanelOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-ink shadow-sm outline-none ring-primary/20 transition hover:border-slate-300 focus:border-primary focus:ring-2"
            >
              <span>
                {selectedSymptoms.length === 0
                  ? "Choose symptoms…"
                  : `${selectedSymptoms.length} selected`}
              </span>
              <span
                className={`text-muted transition ${symptomPanelOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▼
              </span>
            </button>

            {symptomPanelOpen && (
              <div
                className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-200/80"
                role="listbox"
                aria-multiselectable="true"
                aria-labelledby="symptom-multiselect-trigger"
              >
                <div className="border-b border-slate-100 p-2">
                  <input
                    type="search"
                    value={symptomSearch}
                    onChange={(e) => setSymptomSearch(e.target.value)}
                    placeholder="Search symptoms…"
                    className="w-full rounded-lg border border-slate-200 bg-surface px-3 py-2 text-sm text-ink outline-none ring-primary/15 focus:border-primary focus:ring-2"
                    autoFocus
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={selectFilteredVisible}
                      className="rounded-lg bg-primary-muted px-2.5 py-1 text-xs font-semibold text-primary-dark ring-1 ring-primary/25 hover:bg-primary/15"
                    >
                      Add all in view
                    </button>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-muted ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <ul className="max-h-52 overflow-y-auto py-1">
                  {filteredSymptoms.length === 0 ? (
                    <li className="px-4 py-6 text-center text-sm text-muted">No matches</li>
                  ) : (
                    filteredSymptoms.map((symptom) => {
                      const checked = selectedSymptoms.includes(symptom);
                      return (
                        <li key={symptom}>
                          <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm text-ink transition hover:bg-surface">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSymptom(symptom)}
                              className="h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="select-none">{formatSymptomLabel(symptom)}</span>
                          </label>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            )}
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSymptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-primary-muted px-3 py-1 text-xs font-semibold text-primary-dark ring-1 ring-primary/20"
                >
                  {formatSymptomLabel(sym)}
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
          <p className="mt-2 text-xs text-muted">API: {backendUrl}/api/ai</p>
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
