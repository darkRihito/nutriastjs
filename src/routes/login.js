import express from "express";
const router = express.Router();

import loginController from "../controllers/login.controller.js";

router.post("/login", loginController.post);
// router.get("/protected", loginController.protected);
// router.get("/logout", loginController.logout);

export default router;