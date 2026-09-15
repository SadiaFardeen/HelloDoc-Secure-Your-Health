require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HelloDoc Backend Running");
});

// Database Test API
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database connection failed",
    });
  }
});

// Get All Medical History
app.get("/medical-history", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM medical_history ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch medical history",
    });
  }
});

// Get Single Medical History
app.get("/medical-history/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM medical_history WHERE id = $1",
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch medical history record",
    });
  }
});

// Get User Profile
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch user profile",
    });
  }
});

// Update User Profile
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      age,
      bloodGroup,
    } = req.body;

    console.log("UPDATE REQUEST:", req.body);

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           phone = $3,
           age = $4,
           blood_group = $5
       WHERE id = $6
       RETURNING *`,
      [
        name,
        email,
        phone,
        age,
        bloodGroup,
        id,
      ]
    );

    console.log("UPDATED USER:", result.rows);

    res.json(result.rows);
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      error: "Failed to update user profile",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});