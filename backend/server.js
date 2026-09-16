const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

// Member 2 Routes (Added Line)
const member2Routes = require("./routes/member2.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Member 2 API Mount (Added Line)
app.use("/", member2Routes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "HelloDoc API Server is Running!" });
});

// Member 3 - GET /medical-history
app.get("/medical-history", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM medical_records ORDER BY date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Member 3 - GET /medical-history/:id
app.get("/medical-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM medical_records WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching record:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Member 3 - GET /users/:id
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Member 3 - PUT /users/:id
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, blood_group, address, emergency_contact } =
      req.body;
    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           blood_group = COALESCE($4, blood_group),
           address = COALESCE($5, address),
           emergency_contact = COALESCE($6, emergency_contact)
       WHERE id = $7
       RETURNING *`,
      [name, email, phone, blood_group, address, emergency_contact, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});