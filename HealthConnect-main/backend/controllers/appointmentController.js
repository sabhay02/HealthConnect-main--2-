import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const { healthProfessionalId, appointmentDate, appointmentTime, description, appointmenttype } = req.body;

    // Ensure health professional exists
    const healthProfessional = await User.findOne({
      _id: healthProfessionalId,
      userType: "health_prof",
    });

    if (!healthProfessional) {
      return res.status(404).json({ success: false, message: "Health professional not found" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      healthProfessional: healthProfessionalId,
      appointmentDate,
      appointmentTime,
      description,
      appointmenttype: appointmenttype || "voice", // default voice if not provided
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get all appointments (patients see theirs, doctors see theirs)
export const getAppointments = async (req, res) => {
  try {
    let query = req.user.userType === "health_prof"
      ? { healthProfessional: req.user.id }
      : { patient: req.user.id };

    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("healthProfessional", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update status (accept / reject / complete / cancel)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      healthProfessional: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.status = status || appointment.status;
    await appointment.save();

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get list of health professionals
export const getHealthProfessionals = async (req, res) => {
  try {
    const healthProfessionals = await User.find({ userType: "health_prof", isActive: true }).select("name email");
    res.json({ success: true, data: healthProfessionals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Cancel appointment (patient only)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
