import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import aiRouter from "./routes/aiRoute.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[express] ${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
});

const initializeConnections = async () => {
  await connectDB();
  console.log("MongoDB connected successfully.");
  await connectCloudinary();
  console.log("Cloudinary configured.");
};

const start = async () => {
  const missing = [];
  if (!process.env.MONGODB_URI) missing.push("MONGODB_URI");
  if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");

  if (missing.length) {
    console.error("\n  MediConnect backend: missing environment variables:", missing.join(", "));
    console.error("  Fix: copy backend/.env.example → backend/.env and fill in values.");
    console.error("  File must live at:", path.join(__dirname, ".env"), "\n");
    process.exit(1);
  }

  try {
    await initializeConnections();
  } catch (error) {
    console.error("\n  MediConnect backend: database or Cloudinary failed to connect.");
    console.error("  Check MONGODB_URI (Atlas IP allowlist, password) and Cloudinary keys in backend/.env\n");
    console.error(error);
    process.exit(1);
  }

  app.use("/api/user", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/doctor", doctorRouter);
  app.use("/api/ai", aiRouter);

  /** Public JSON — confirms Express env wiring (no secrets). */
  app.get("/api/config", (_req, res) => {
    const raw = (process.env.AI_SERVICE_URL || "").trim();
    console.log(
      `[config] /api/config hit; PORT=${port}; AI_SERVICE_URL set=${Boolean(raw)}; NODE_ENV=${process.env.NODE_ENV || "undefined"}`
    );
    res.json({
      aiPredictorConfigured: Boolean(raw),
    });
  });

  app.get("/", (req, res) => {
    res.send("API Working");
  });

  app.listen(port, () => {
    const ai = (process.env.AI_SERVICE_URL || "").trim();
    console.log(`\n  API ready → http://localhost:${port}`);
    console.log(
      ai
        ? "  AI_SERVICE_URL is set — /api/ai/* will proxy to the Python predictor."
        : "  WARNING: AI_SERVICE_URL is not set — /api/ai/symptoms and /api/ai/predict will fail until you add it on this host."
    );
    console.log(`  Patient app → http://localhost:5173   Admin app → http://localhost:5174\n`);
  });
};

start();
