const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const db = require("./db");

const pool = db.pool || db;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const initDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL database successfully.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'patient',
        specialty VARCHAR(150),
        license VARCHAR(100),
        phone VARCHAR(50),
        bio TEXT,
        image_url TEXT,
        hospital VARCHAR(150),
        fee INT DEFAULT 500,
        age INT,
        gender VARCHAR(20) DEFAULT 'Male',
        blood_group VARCHAR(10),
        height VARCHAR(20),
        weight VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        specialization VARCHAR(150) NOT NULL,
        qualification VARCHAR(150) DEFAULT 'MBBS, FCPS',
        experience INT DEFAULT 5,
        hospital VARCHAR(150) DEFAULT 'Dhaka Medical Hospital',
        location VARCHAR(150) DEFAULT 'Dhaka',
        fee INT DEFAULT 500,
        rating NUMERIC(2,1) DEFAULT 4.9,
        availability VARCHAR(100) DEFAULT 'Available Today',
        image_url TEXT,
        about TEXT DEFAULT 'Dedicated specialist doctor available for consultations.',
        languages VARCHAR(150) DEFAULT 'English, Bangla',
        user_id INT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        patient_name VARCHAR(150) NOT NULL,
        doctor_id VARCHAR(50) NOT NULL,
        doctor_name VARCHAR(150) NOT NULL,
        specialty VARCHAR(150),
        problem TEXT DEFAULT 'General consultation',
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id VARCHAR(50) PRIMARY KEY,
        appointment_id VARCHAR(50),
        doctor_id VARCHAR(50) NOT NULL,
        doctor_name VARCHAR(150) DEFAULT 'Doctor',
        patient_id VARCHAR(50),
        patient_name VARCHAR(150) NOT NULL,
        diagnosis TEXT,
        medicines TEXT NOT NULL,
        notes TEXT,
        instructions TEXT,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_role VARCHAR(20) NOT NULL,
        sender_name VARCHAR(150) NOT NULL,
        doctor_id VARCHAR(50) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};

initDB();

app.get("/", (req, res) => {
  res.json({ message: "HelloDoc Backend API is running" });
});

// ================= MEMBER 2 ENDPOINTS =================

// 1. GET /doctor/appointments
app.get("/doctor/appointments", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM appointments ORDER BY date ASC, time ASC"
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments", details: err.message });
  }
});

// 2. PATCH /appointments/:id (Accept/Reject)
app.patch("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const { rows } = await pool.query(
      "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update appointment", details: err.message });
  }
});

// 3. PUT /prescriptions/:id
app.put("/prescriptions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, medicines, notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE prescriptions
       SET diagnosis = COALESCE($1, diagnosis),
           medicines = COALESCE($2, medicines),
           notes = COALESCE($3, notes)
       WHERE id = $4 RETURNING *`,
      [
        diagnosis ?? null,
        medicines ? JSON.stringify(medicines) : null,
        notes ?? null,
        id,
      ]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Prescription not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update prescription", details: err.message });
  }
});

// ================= APPOINTMENTS & PRESCRIPTIONS =================

app.get("/appointments", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM appointments ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/appointments", async (req, res) => {
  try {
    const { id, patient_id, patient_name, doctor_id, doctor_name, specialty, problem, date, time } = req.body;
    if (!patient_name || !doctor_id || !date || !time) {
      return res.status(400).json({ error: "Missing required appointment fields" });
    }
    const query = `
      INSERT INTO appointments (id, patient_id, patient_name, doctor_id, doctor_name, specialty, problem, date, time, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
      RETURNING *;
    `;
    const values = [
      id || `apt-${Date.now()}`,
      patient_id || "P-101",
      patient_name,
      doctor_id.toString(),
      doctor_name || "Doctor",
      specialty || "General",
      problem || "General consultation",
      date,
      time,
    ];
    const { rows } = await pool.query(query, values);
    res.status(201).json({ message: "Appointment booked successfully", appointment: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to book appointment", details: err.message });
  }
});

app.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM appointments WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment cancelled successfully", appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel appointment", details: err.message });
  }
});

app.get("/prescriptions", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM prescriptions ORDER BY date DESC");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/prescriptions", async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      doctorName,
      patientId,
      patientName,
      patient_name,
      diagnosis,
      medicines,
      notes,
    } = req.body;

    const pName = patientName || patient_name;

    if (!pName || !diagnosis) {
      return res.status(400).json({ error: "Patient name and diagnosis are required." });
    }

    const newId = `pr-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const medsData = typeof medicines === "string" ? medicines : JSON.stringify(medicines || []);

    const query = `
      INSERT INTO prescriptions (id, appointment_id, doctor_id, doctor_name, patient_id, patient_name, diagnosis, medicines, notes, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      newId,
      appointmentId || null,
      doctorId || "d1",
      doctorName || "Dr. Farhana Khan",
      patientId || "P-101",
      pName,
      diagnosis,
      medsData,
      notes || "",
      today,
    ];

    const { rows } = await pool.query(query, values);
    
    // Parse medicines back to an array for frontend response
    const saved = rows[0];
    if (typeof saved.medicines === "string") {
      try {
        saved.medicines = JSON.parse(saved.medicines);
      } catch (e) {
        saved.medicines = [];
      }
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("Prescription error:", err);
    res.status(500).json({ error: "Failed to save prescription", details: err.message });
  }
});

// ================= AUTH, DOCTORS & MESSAGES =================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, specialty, license, hospital, fee, image_url, age, gender, blood_group, height, weight } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Please provide name, email, password, and role." });
    }
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    const insertUserQuery = `
      INSERT INTO users (name, email, password, role, specialty, license, hospital, fee, image_url, age, gender, blood_group, height, weight)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, name, email, role, specialty, license, hospital, fee, image_url, age, gender, blood_group, height, weight;
    `;
    const userValues = [
      name.trim(),
      email.toLowerCase().trim(),
      password,
      role.toLowerCase().trim(),
      specialty || null,
      license || null,
      hospital || "Medical Center",
      Number(fee) || 500,
      image_url || null,
      age ? Number(age) : null,
      gender || "Male",
      blood_group || null,
      height || null,
      weight || null,
    ];
    const { rows: userRows } = await pool.query(insertUserQuery, userValues);
    const newUser = userRows[0];

    if (role.toLowerCase().trim() === "doctor") {
      const existingDoc = await pool.query("SELECT * FROM doctors WHERE user_id = $1", [newUser.id]);
      if (existingDoc.rows.length === 0) {
        const insertDoctorQuery = `
          INSERT INTO doctors (name, specialization, hospital, location, fee, rating, availability, about, image_url, user_id)
          VALUES ($1, $2, $3, 'Dhaka', $4, 5.0, 'Available Today', 'Dedicated specialist doctor available for consultations.', $5, $6);
        `;
        await pool.query(insertDoctorQuery, [
          `Dr. ${newUser.name.replace(/^Dr\.\s*/i, "")}`,
          newUser.specialty || "General Physician",
          newUser.hospital || "Dhaka Medical Center",
          newUser.fee || 500,
          newUser.image_url || null,
          newUser.id,
        ]);
      }
    }
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password." });
    }
    const query = "SELECT * FROM users WHERE email = $1 AND role = $2";
    const { rows } = await pool.query(query, [email.toLowerCase().trim(), role.toLowerCase().trim()]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No account found with this email and role." });
    }
    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password." });
    }
    delete user.password;
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT id, name, email, role, specialty, license, phone, bio, image_url, hospital, fee, age, gender, blood_group, height, weight FROM users WHERE id = $1",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, bio, image_url, hospital, fee, specialty, age, gender, blood_group, height, weight } = req.body;
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const updateQuery = `
      UPDATE users 
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          bio = COALESCE($3, bio),
          image_url = COALESCE($4, image_url),
          hospital = COALESCE($5, hospital),
          fee = COALESCE($6, fee),
          specialty = COALESCE($7, specialty),
          age = COALESCE($8, age),
          gender = COALESCE($9, gender),
          blood_group = COALESCE($10, blood_group),
          height = COALESCE($11, height),
          weight = COALESCE($12, weight)
      WHERE id = $13
      RETURNING id, name, email, role, specialty, license, phone, bio, image_url, hospital, fee, age, gender, blood_group, height, weight;
    `;
    const { rows } = await pool.query(updateQuery, [
      name || null,
      phone || null,
      bio || null,
      image_url || null,
      hospital || null,
      fee ? Number(fee) : null,
      specialty || null,
      age ? Number(age) : null,
      gender || null,
      blood_group || null,
      height || null,
      weight || null,
      parsedId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found in database." });
    }
    res.status(200).json({ message: "Profile updated successfully", user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update profile" });
  }
});

app.get("/doctors", async (req, res) => {
  try {
    const { search, specialization } = req.query;
    let query = "SELECT DISTINCT ON (name) * FROM doctors WHERE 1=1";
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR specialization ILIKE $${params.length} OR location ILIKE $${params.length})`;
    }
    if (specialization && specialization !== "All") {
      params.push(specialization);
      query += ` AND specialization = $${params.length}`;
    }
    query += " ORDER BY name, id DESC";
    const { rows } = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors", details: err.message });
  }
});

app.get("/doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM doctors WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctor", details: err.message });
  }
});

app.get("/api/messages/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { rows } = await pool.query("SELECT * FROM messages WHERE doctor_id = $1 ORDER BY id ASC", [doctorId]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const { sender_role, sender_name, doctor_id, text } = req.body;
    if (!text || !doctor_id) {
      return res.status(400).json({ error: "Message text and doctorId are required" });
    }
    const query = `
      INSERT INTO messages (sender_role, sender_name, doctor_id, text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [sender_role || "patient", sender_name || "User", doctor_id.toString(), text]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});