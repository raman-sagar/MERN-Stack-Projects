import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import path from "path";
import multer from "multer";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";

dotenv.config();
// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(import.meta.dirname, "public")));

app.get("/", (req, res) => {
  res.send("<h3>Backend Server is running</h3>");
});
app.use(helmet())
app.use(compression({ level: 4, threshold: 1024 * 1024 * 5 }));
const limiter = rateLimit({
  windowMs: 1000 * 60,
  limit: 20,
  message: "Too many requests from this IP, please try again after an hour",
});
app.use(limiter);
app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);

//Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.json({ message: "Error:Too many files uploaded" });
    }
    return res.json({ message: `Multer Error ${error.message}` });
  } else if (error) {
    return res.json({
      message: `Something went wrong:${error.message}`,
    });
  }
  next();
});

app.use((req, res) => {
  return res.status(404).json({ message: "Page not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
