const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
    },

    patientName: {
      type: String,
      required: true,
    },

    doctorId: {
      type: String,
      required: true,
    },

    doctorName: {
      type: String,
      required: true,
    },

    specialty: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);