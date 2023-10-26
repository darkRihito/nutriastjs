import express from "express";
const router = express.Router();
const app = express();

import authorization from "../middleware/authorization.js";
import intakeUserController from "../controllers/intakeuser.controller.js";

router.get("/intakeusers", authorization, intakeUserController.get);
router.get("/intakeusers/:userId", authorization, intakeUserController.getById);
router.post("/intakeusers/:userId", authorization, intakeUserController.createIntake);
router.get("/intakeusers/history/:userId", authorization, intakeUserController.getHistory);

export default router;
