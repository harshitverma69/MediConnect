import express from "express";
import { proxySymptoms, proxyPredict } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.get("/symptoms", proxySymptoms);
aiRouter.post("/predict", proxyPredict);

export default aiRouter;
