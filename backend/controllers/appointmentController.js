const Appointment = require("../models/Appointment");


// Create appointment
const createAppointment = async (
  req,
  res,
  next
) => {

  try {

    const appointment =
      await Appointment.create(
        req.body
      );


    res.status(201).json(
      appointment
    );


  } catch(error){

    next(error);

  }

};



// Get patient appointments
const getPatientAppointments =
async (
  req,
  res,
  next
) => {

  try {

    const appointments =
      await Appointment.find({
        patientId:
          req.params.id,
      });


    res.status(200).json(
      appointments
    );


  } catch(error){

    next(error);

  }

};



// Delete appointment
const deleteAppointment =
async (
  req,
  res,
  next
) => {

  try {


    const appointment =
      await Appointment.findById(
        req.params.id
      );


    if(!appointment){

      return res.status(404).json({
        message:
        "Appointment not found"
      });

    }


    await appointment.deleteOne();


    res.status(200).json({
      message:
      "Appointment cancelled"
    });


  } catch(error){

    next(error);

  }

};



module.exports = {

  createAppointment,

  getPatientAppointments,

  deleteAppointment,

};