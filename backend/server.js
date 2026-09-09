const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const pool = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
  res.json({
    message: "HelloDoc Backend Running",
  });
});


// Database test route
app.get("/api/test-db", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT NOW()"
    );

    res.json({
      database: "connected",
      time: result.rows[0],
    });


  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
});


// Doctor API routes
app.use(
  "/api/doctors",
  doctorRoutes
);


// Server start
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});