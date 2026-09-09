const express = require("express");

const router =
express.Router();


const {
  createAppointment,
  getPatientAppointments,
  deleteAppointment,

} = require("../controllers/appointmentController");



// POST appointment

router.post(
  "/",
  createAppointment
);



// GET patient appointments

router.get(
  "/patient/:id",
  getPatientAppointments
);



// DELETE appointment

router.delete(
  "/:id",
  deleteAppointment
);



module.exports = router;