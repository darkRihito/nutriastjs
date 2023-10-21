import express from "express";
const router = express.Router();

import loginController from "../controllers/login.controller.js";

router.get("/login", loginController.get);
// router.get("/protected", loginController.protected);
// router.get("/logout", loginController.logout);

export default router;