import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./config/prisma.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import http from "http";
// import initSocket from "./config/socket"

const app = express();
// const server = http.createServer(app)

const port = process.env.PORT || 7777;
const hostname = process.env.HOST_NAME;

// init socket
// initSocket(server)

app.use(cors({
  origin: [
    'http://localhost:5173'
  ],
  credentials: true
}));

//config req.body
app.use(express.json()); // đọc JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);


(async() => {
    try {
        await prisma.$connect();
        console.log("DB connected")

        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}`);
        })
    } catch (error) {
        console.log("Error connect to DB", error)
    }
})()