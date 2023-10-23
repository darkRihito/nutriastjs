import express from "express";
const router = express.Router();
const app = express();

// import authorization from "../middleware/authorization.js";
import predictController from "../controllers/predict.controller.js";

router.get("/predict", predictController.predict);

export default router;