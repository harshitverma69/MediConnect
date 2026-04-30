/**
 * Proxy to the Python AI predictor service (FastAPI).
 * Env: AI_SERVICE_URL = your Render URL, with or without /predict, e.g.
 *   https://your-service.onrender.com
 *   https://your-service.onrender.com/predict
 */

const DEFAULT_TIMEOUT_MS = 25_000;

/** Normalize so POST always targets .../predict (avoids 404 "Not Found" from hitting service root). */
function normalizePredictUrl(raw) {
  if (!raw || typeof raw !== "string") return "";
  let u = raw.trim().replace(/\/+$/, "");
  if (!u) return "";
  if (!/\/predict$/i.test(u)) {
    u = `${u}/predict`;
  }
  return u;
}

function getPredictUrl() {
  return normalizePredictUrl(process.env.AI_SERVICE_URL || "");
}

function getSymptomsUrl() {
  const predictUrl = getPredictUrl();
  if (!predictUrl) return "";
  return predictUrl.replace(/\/predict$/i, "/symptoms");
}

function getHealthUrl() {
  const predictUrl = getPredictUrl();
  if (!predictUrl) return "";
  return predictUrl.replace(/\/predict$/i, "/health");
}

function upstreamMessage(status, data, fallback) {
  const d = data?.detail;
  if (typeof d === "string") {
    if (status === 404 && (d === "Not Found" || d.toLowerCase().includes("not found"))) {
      return (
        "AI service returned 404. Set AI_SERVICE_URL on this API to your Python service root " +
        "(e.g. https://your-name.onrender.com) or full .../predict. Open /api/ai/health to verify."
      );
    }
    return d;
  }
  if (Array.isArray(d) && d[0]?.msg) return d.map((x) => x.msg).join("; ");
  return data?.error || data?.message || fallback;
}

function safeHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return "(invalid URL)";
  }
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
      const msg = upstreamMessage(upstream.status, data, `AI service error (${upstream.status})`);
      console.error("[ai-proxy] Symptoms upstream error:", upstream.status, msg);
      return res.status(upstream.status).json({
        success: false,
        message: msg,
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
      const msg = upstreamMessage(
        upstream.status,
        data,
        `AI service error (${upstream.status})`
      );
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

/** GET — quick checks for deploy debugging (no secrets). */
const aiHealth = async (req, res) => {
  const predictUrl = getPredictUrl();
  const configured = Boolean(predictUrl);
  const host = configured ? safeHost(predictUrl) : null;
  let upstream = { ok: false, status: null, error: null };
  const healthUrl = getHealthUrl();
  if (healthUrl) {
    try {
      const r = await fetchWithTimeout(healthUrl, { method: "GET" });
      upstream.status = r.status;
      upstream.ok = r.ok;
    } catch (e) {
      upstream.error = e.name === "AbortError" ? "timeout" : e.message;
    }
  }
  return res.json({
    ok: configured && upstream.ok,
    aiServiceConfigured: configured,
    aiServiceHost: host,
    upstreamHealthStatus: upstream.status,
    upstreamReachable: upstream.ok,
    upstreamError: upstream.error || undefined,
  });
};

export { proxySymptoms, proxyPredict, aiHealth };
