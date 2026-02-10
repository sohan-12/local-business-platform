const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "User route working ✅" });
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
