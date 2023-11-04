import express from "express";
const router = express.Router();

import authorization from "../middleware/authorization.js";
import predictController from "../controllers/predict.controller.js";

router.post("/predict", authorization, predictController.predict);

export default router;