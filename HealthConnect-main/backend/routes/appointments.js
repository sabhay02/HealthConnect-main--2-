import express from "express";
import {
  cancelAppointment,
  createAppointment,
  getAppointments,
  getHealthProfessionals,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// 🔹 Get list of health professionals (must come before :id route)
router.get("/health-professionals", protectRoute, getHealthProfessionals);

// 🔹 Create appointment (patients)
router.post("/", protectRoute, createAppointment);

// 🔹 Get appointments (patients see their own, doctors see theirs)
router.get("/", protectRoute, getAppointments);

// 🔹 Update appointment status (doctors only)
router.put("/:id/status", protectRoute, updateAppointmentStatus);

// 🔹 Cancel appointment (patients only)
router.delete("/:id", protectRoute, cancelAppointment);

export default router;
