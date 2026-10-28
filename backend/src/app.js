import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.use(errorHandler);

export default app;