// backend/routes/member2.routes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. GET /doctor/appointments
router.get("/doctor/appointments", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM appointments ORDER BY date ASC, time ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// 2. PATCH /appointments/:id
router.patch("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// 3. GET /prescriptions
router.get("/prescriptions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM prescriptions ORDER BY date DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

// 4. POST /prescriptions
router.post("/prescriptions", async (req, res) => {
  const {
    appointmentId,
    doctorId,
    patientId,
    patientName,
    diagnosis,
    medicines,
    notes,
  } = req.body;

  if (!patientName || !diagnosis || !medicines || medicines.length === 0) {
    return res.status(400).json({
      error: "Patient name, diagnosis, and at least one medicine are required.",
    });
  }

  const newId = `pr-${Date.now()}`;
  const today = new Date().toISOString().split("T")[0];

  try {
    const result = await pool.query(
      `INSERT INTO prescriptions (id, appointment_id, doctor_id, patient_id, patient_name, date, diagnosis, medicines, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        newId,
        appointmentId || null,
        doctorId || "d1",
        patientId || "p1",
        patientName,
        today,
        diagnosis,
        JSON.stringify(medicines),
        notes || "",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating prescription:", err);
    res.status(500).json({ error: "Failed to create prescription" });
  }
});

// 5. PUT /prescriptions/:id
router.put("/prescriptions/:id", async (req, res) => {
  const { id } = req.params;
  const { diagnosis, medicines, notes } = req.body;

  try {
    const result = await pool.query(
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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating prescription:", err);
    res.status(500).json({ error: "Failed to update prescription" });
  }
});

module.exports = router;