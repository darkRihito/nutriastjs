import express from "express";
const router = express.Router();
const app = express();

import authorization from "../middleware/authorization.js";
import userController from "../controllers/user.controller.js";

// authorization
app.use(authorization);

router.get("/users", authorization, userController.get);

export default router;