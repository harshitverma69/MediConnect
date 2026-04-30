import express from "express";
import { proxySymptoms, proxyPredict, aiHealth } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.get("/health", aiHealth);
aiRouter.get("/symptoms", proxySymptoms);
aiRouter.post("/predict", proxyPredict);

export default aiRouter;
