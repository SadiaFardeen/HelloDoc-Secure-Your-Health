// backend/setup-member2-db.js
require("dotenv").config();
const { Pool } = require("pg");

// Direct pool setup using current .env values
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "postgres",
});

async function setupDatabase() {
  try {
    console.log("Connecting to PostgreSQL...");
    console.log(`Config: User=${process.env.DB_USER}, Host=${process.env.DB_HOST}, Port=${process.env.DB_PORT}, DB=${process.env.DB_NAME}`);

    const client = await pool.connect();
    console.log(" Connected to PostgreSQL client!");

    // 1. Create appointments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        doctor_id VARCHAR(50) NOT NULL,
        doctor_name VARCHAR(100),
        patient_id VARCHAR(50) NOT NULL,
        patient_name VARCHAR(100),
        date VARCHAR(20),
        time VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pending',
        problem TEXT
      );
    `);
    console.log(" Appointments table ready.");

    // 2. Create prescriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id VARCHAR(50) PRIMARY KEY,
        appointment_id VARCHAR(50),
        doctor_id VARCHAR(50),
        patient_id VARCHAR(50),
        patient_name VARCHAR(100),
        date VARCHAR(20),
        diagnosis TEXT,
        medicines JSONB,
        notes TEXT
      );
    `);
    console.log(" Prescriptions table ready.");

    // 3. Insert initial dummy data for testing
    await client.query(`
      INSERT INTO appointments (id, doctor_id, doctor_name, patient_id, patient_name, date, time, status, problem)
      VALUES 
      ('apt-101', 'd1', 'Dr. Sarah Johnson', 'p1', 'Rahim Ahmed', '2026-09-18', '10:30 AM', 'pending', 'Persistent fever and cough for 4 days'),
      ('apt-102', 'd1', 'Dr. Sarah Johnson', 'p2', 'Ayesha Siddiqua', '2026-09-19', '02:15 PM', 'accepted', 'Chest pain and breathing difficulty')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO prescriptions (id, appointment_id, doctor_id, patient_id, patient_name, date, diagnosis, medicines, notes)
      VALUES 
      ('pr-101', 'apt-102', 'd1', 'p2', 'Ayesha Siddiqua', '2026-09-19', 'Acute Bronchitis', 
       '[{"name":"Azithromycin 500mg","dosage":"1 tablet daily","timing":"After meal"},{"name":"Montelukast 10mg","dosage":"1 tablet at night","timing":"Night"}]'::jsonb, 
       'Drink warm water and rest for 5 days.')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log(" Test data inserted successfully.");

    client.release();
    console.log("Database setup completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error(" Error setting up database:");
    console.error(err);
    process.exit(1);
  }
}

setupDatabase();