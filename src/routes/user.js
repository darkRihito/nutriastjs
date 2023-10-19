import express from "express";
const router = express.Router();

import userController from "../controllers/user.controller.js";

router.get("/users", userController.get);
// router.get("/users/:userId", usersController.getbyid);
// router.post("/register", usersController.register);
// router.post("/login", usersController.login);
// router.delete("/logout", usersController.logout);
// router.post("/predict/:userId", usersController.predict);


export default router;