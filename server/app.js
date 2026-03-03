require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");

const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);

app.use(express.static(path.join(__dirname, "../client")));


// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);