import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';

import userRoutes from "./src/routes/user.js";

const port = process.env.PORT || 8000;
const app = express()

// bodyParser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// cors
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// cookieParser
app.use(cookieParser())
app.use(express.json())
app.get('/', (req, res) => {
  res.json({'message': 'Ok!'});
})

// Router
app.use(userRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})