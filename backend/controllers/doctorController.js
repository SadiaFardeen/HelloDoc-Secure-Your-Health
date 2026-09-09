const Doctor = require("../models/Doctor");

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });

    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({
      id: req.params.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
};