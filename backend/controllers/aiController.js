/**
 * Proxy to the Python AI predictor service (FastAPI).
 * Env: AI_SERVICE_URL = full URL to POST /predict, e.g. https://xxx.onrender.com/predict
 */

const DEFAULT_TIMEOUT_MS = 25_000;

function getPredictUrl() {
  const u = process.env.AI_SERVICE_URL?.trim();
  return u || "";
}

function getSymptomsUrl() {
  const predictUrl = getPredictUrl();
  if (!predictUrl) return "";
  const base = predictUrl.replace(/\/+$/, "");
  if (base.toLowerCase().endsWith("/predict")) {
    return `${base.slice(0, -"/predict".length)}/symptoms`;
  }
  return `${base}/symptoms`;
}

async function fetchWithTimeout(url, options = {}) {
  const timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const proxySymptoms = async (req, res) => {
  const symptomsUrl = getSymptomsUrl();
  if (!symptomsUrl) {
    console.warn("[ai-proxy] AI_SERVICE_URL not set — cannot proxy /symptoms");
    return res.status(503).json({
      success: false,
      message:
        "AI predictor is not configured. Set AI_SERVICE_URL on the server (e.g. https://your-service.onrender.com/predict).",
    });
  }

  try {
    console.log("[ai-proxy] GET symptoms →", symptomsUrl);
    const upstream = await fetchWithTimeout(symptomsUrl, { method: "GET" });
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[ai-proxy] Non-JSON symptoms response:", text.slice(0, 200));
      return res.status(502).json({
        success: false,
        message: "AI service returned an invalid response.",
      });
    }
    if (!upstream.ok) {
      console.error("[ai-proxy] Symptoms upstream error:", upstream.status, data);
      return res.status(upstream.status).json({
        success: false,
        message: data?.detail || data?.error || `AI service error (${upstream.status})`,
      });
    }
    console.log("[ai-proxy] Symptoms OK, count:", data?.symptoms?.length ?? 0);
    return res.json(data);
  } catch (err) {
    const aborted = err.name === "AbortError";
    console.error("[ai-proxy] Symptoms fetch failed:", err.message || err);
    return res.status(aborted ? 504 : 502).json({
      success: false,
      message: aborted
        ? "AI service request timed out."
        : "Could not reach AI predictor service.",
    });
  }
};

const proxyPredict = async (req, res) => {
  const predictUrl = getPredictUrl();
  if (!predictUrl) {
    console.warn("[ai-proxy] AI_SERVICE_URL not set — cannot proxy /predict");
    return res.status(503).json({
      success: false,
      message:
        "AI predictor is not configured. Set AI_SERVICE_URL on the server (e.g. https://your-service.onrender.com/predict).",
    });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const symptoms = Array.isArray(body.symptoms) ? body.symptoms : [];

  try {
    console.log("[ai-proxy] POST predict →", predictUrl, "symptoms:", symptoms.length);
    const upstream = await fetchWithTimeout(predictUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[ai-proxy] Non-JSON predict response:", text.slice(0, 200));
      return res.status(502).json({
        success: false,
        message: "AI service returned an invalid response.",
      });
    }
    if (!upstream.ok) {
      const detail = data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((d) => d.msg).join("; ")
            : data?.error || `AI service error (${upstream.status})`;
      console.error("[ai-proxy] Predict upstream error:", upstream.status, msg);
      return res.status(upstream.status).json({ success: false, message: msg });
    }
    console.log("[ai-proxy] Predict OK, disease:", data?.disease ?? "(unknown)");
    return res.json(data);
  } catch (err) {
    const aborted = err.name === "AbortError";
    console.error("[ai-proxy] Predict fetch failed:", err.message || err);
    return res.status(aborted ? 504 : 502).json({
      success: false,
      message: aborted
        ? "AI service request timed out."
        : "Could not reach AI predictor service.",
    });
  }
};

export { proxySymptoms, proxyPredict };
