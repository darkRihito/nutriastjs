import express from "express";
const router = express.Router();
const app = express();

import authorization from "../middleware/authorization.js";
import userController from "../controllers/user.controller.js";

router.get("/users", authorization, userController.get);
router.get("/users/:userId", authorization, userController.getById);

export default router;