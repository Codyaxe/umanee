import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import readingRoute from "./routes/reading.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  // console.log(`🚀 ${req.method} ${req.url}`);
  next();
});

// Make io accessible in routes/controllers
app.set("io", io);

app.use("/api/", readingRoute);

server.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
