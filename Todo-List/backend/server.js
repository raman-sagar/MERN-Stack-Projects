const express = require("express");
const MongoDB = require("./config/database");
const taskRoutes = require("./routes/tasks");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Connection
MongoDB();
// Routes (we'll add these later)
app.get("/", (req, res) => {
  res.send("Task Management API is running");
});

app.use("/api/tasks", taskRoutes);
// Start Server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
