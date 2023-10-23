import express from "express";
const router = express.Router();

import loginController from "../controllers/login.controller.js";

router.post("/login", loginController.login);
router.post("/register", loginController.register);
router.delete("/logout", loginController.logout);

export default router;