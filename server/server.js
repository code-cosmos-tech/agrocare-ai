require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./utilities/db");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const errorFunction = require("./middlewares/error-func");
const cors = require("cors");

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const corsOption = {
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(express.json());
app.use(cors(corsOption));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use(errorFunction);

connectDb().then(() => {
  app.listen(PORT, (res, req) => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})
