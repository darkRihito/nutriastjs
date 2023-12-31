import express from "express";
const router = express.Router();

import authorization from "../middleware/authorization.js";
import intakeUserController from "../controllers/intakeuser.controller.js";

router.get("/intakeusers", authorization, intakeUserController.get);
router.post("/intakeusers", authorization, intakeUserController.createIntakeUsers);
router.get("/intakeusers/id", authorization, intakeUserController.getById);
router.get("/history", authorization, intakeUserController.getHistory);

export default router;
