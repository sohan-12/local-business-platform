const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middleware/auth");


// ================= ADD BUSINESS (ADMIN ONLY) =================

router.post("/add", auth, async (req, res) => {
  try {

    // 🔥 Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can add business" });
    }

    const {
      name,
      category,
      description,
      address,
      latitude,
      longitude,
      phone,
      price_range,
      image_url
    } = req.body;

    const result = await pool.query(
      `INSERT INTO businesses
      (owner_id, name, category, description, address, latitude, longitude, phone, price_range, image_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        req.user.id, // 🔥 owner_id from token
        name,
        category,
        description,
        address,
        latitude,
        longitude,
        phone,
        price_range,
        image_url
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("ADD BUSINESS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= GET REVIEWS =================

router.get("/reviews/:businessId", async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT 
        r.id,
        r.user_id,
        r.rating,
        r.comment,
        r.created_at,
        u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.business_id = $1
      ORDER BY r.created_at DESC
      `,
      [req.params.businessId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("GET REVIEWS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= ADD / UPDATE REVIEW =================

router.post("/review", auth, async (req, res) => {
  try {

    const user_id = req.user.id;
    const { business_id, rating, comment } = req.body;

    await pool.query(
      `
      INSERT INTO reviews (user_id, business_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, business_id)
      DO UPDATE SET
        rating = EXCLUDED.rating,
        comment = EXCLUDED.comment,
        created_at = CURRENT_TIMESTAMP
      `,
      [user_id, business_id, rating, comment]
    );

    res.json({ message: "Review added/updated successfully" });

  } catch (err) {
    console.error("ADD REVIEW ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= GET ALL BUSINESSES =================

router.get("/", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        b.id,
        b.owner_id,
        b.name,
        b.category,
        b.description,
        b.address,
        b.latitude,
        b.longitude,
        b.phone,
        b.price_range,
        b.image_url,
        b.created_at,
        COALESCE(AVG(r.rating), 0) AS average_rating
      FROM businesses b
      LEFT JOIN reviews r ON b.id = r.business_id
      GROUP BY 
        b.id,
        b.owner_id,
        b.name,
        b.category,
        b.description,
        b.address,
        b.latitude,
        b.longitude,
        b.phone,
        b.price_range,
        b.image_url,
        b.created_at
      ORDER BY average_rating DESC   -- 🔥 Sorted by rating
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("GET BUSINESSES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= DELETE BUSINESS (ADMIN ONLY) =================

router.delete("/delete/:id", auth, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete business" });
    }

    await pool.query(
      "DELETE FROM businesses WHERE id=$1",
      [req.params.id]
    );

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error("DELETE BUSINESS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= DELETE REVIEW =================

router.delete("/review/:id", auth, async (req, res) => {
  try {

    const result = await pool.query(
      "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({ message: "Review deleted successfully" });

  } catch (err) {
    console.error("DELETE REVIEW ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;