import "dotenv/config";
import http from "http";
import app from "./app.js";
import prisma from "./config/prisma.js";
import { initSocket } from "./config/socket.js";

const port = process.env.PORT || 7777;
const hostname = process.env.HOST_NAME;

const server = http.createServer(app);

initSocket(server);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("DB connected");

    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error("Error connect to DB", error);
    process.exitCode = 1;
  }
}

startServer();

export { app, server };