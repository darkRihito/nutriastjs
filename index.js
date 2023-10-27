import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./src/routes/user.js";
import loginRoutes from "./src/routes/login.js";

const port = process.env.PORT || 8000;
const app = express();

// expressJson
app.use(express.json());

// bodyParser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// cors
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// cookieParser
app.use(cookieParser())

// Router
app.get("/", (req, res) => {
  res.json({ message: "Ok!" });
});
app.use(userRoutes);
app.use(loginRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
