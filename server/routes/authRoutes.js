const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ============================
// REGISTER
// ============================
router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.json({
      message: "User registered successfully ✅",
      user: result.rows[0]
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

});


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const user = result.rows[0];
    console.log("USER FROM DB:", user);

    
    const validPassword =
      await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        error: "Wrong password"
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role   // ADD THIS LINE
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
     
  );

    console.log("TOKEN CREATED:", token);

    res.json({

      message: "Login successful",

      token: token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }

    });

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });

  }

});

// ============================
// GET CURRENT USER (Protected)
// ============================
router.get("/me", async (req, res) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id=$1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error("JWT Error:", err.message);
    res.status(401).json({ error: "Invalid token" });

  }

});


module.exports = router;