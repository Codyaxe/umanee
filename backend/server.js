import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import produceRoutes from "./routes/produce.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - MUST be before routes
app.use(
  cors({
    origin:
      process.env.VITE_SERVER_PRODUCTION_URL ||
      process.env.VITE_SERVER_DEVELOPMENT_URL,
    credentials: true, // Allow cookies
  })
);

// Middleware
app.use(express.json({ limit: "10mb" })); // Add limit for larger payloads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  // console.log(`🚀 ${req.method} ${req.url}`);
  next();
});

// Connect Routes
app.use("/api/auth", authRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/listings", listingRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
  connectDB();
});
