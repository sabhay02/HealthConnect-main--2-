import { create } from "zustand";
import axios from "../api/axios.js";

export const useAppointmentStore = create((set, get) => ({
	appointments: [],
	healthProfessionals: [],
	loading: false,
	error: null,

	// Create new appointment
	createAppointment: async (appointmentData) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.post("/appointments", {
				healthProfessionalId: appointmentData.doctorId,
				appointmentDate: appointmentData.date,
				appointmentTime: appointmentData.time,
				description: appointmentData.reason || "General consultation",
				appointmenttype: appointmentData.type, // "video" or "voice"
			});

			// Add new appointment to the list
			const currentAppointments = get().appointments;
			set({
				appointments: [res.data.data, ...currentAppointments],
				loading: false,
			});

			return res.data;
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Failed to create appointment",
			});
			throw error;
		}
	},

	// Get all appointments (patient sees theirs, doctor sees theirs)
	fetchAppointments: async () => {
		set({ loading: true, error: null });
		try {
			const res = await axios.get("/appointments");
			set({
				appointments: res.data.data || [],
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Failed to fetch appointments",
			});
		}
	},

	// Get list of health professionals
	fetchHealthProfessionals: async () => {
		set({ loading: true, error: null });
		try {
			const res = await axios.get("/appointments/health-professionals");
			set({
				healthProfessionals: res.data.data || [],
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Failed to fetch health professionals",
			});
		}
	},

	// Update appointment status (for health professionals)
	updateAppointmentStatus: async (appointmentId, status) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.put(`/appointments/${appointmentId}/status`, {
				status: status, // "accepted", "rejected", "completed"
			});

			// Update the appointment in the list
			const currentAppointments = get().appointments;
			const updatedAppointments = currentAppointments.map((apt) => (apt._id === appointmentId ? res.data.data : apt));

			set({
				appointments: updatedAppointments,
				loading: false,
			});

			return res.data.data;
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Failed to update appointment status",
			});
			throw error;
		}
	},

	// Cancel appointment (for patients)
	cancelAppointment: async (appointmentId) => {
		set({ loading: true, error: null });
		try {
			const res = await axios.put(`/appointments/${appointmentId}/cancel`);

			// Update the appointment status in the list
			const currentAppointments = get().appointments;
			const updatedAppointments = currentAppointments.map((apt) => (apt._id === appointmentId ? { ...apt, status: "cancelled" } : apt));

			set({
				appointments: updatedAppointments,
				loading: false,
			});

			return res.data;
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Failed to cancel appointment",
			});
			throw error;
		}
	},

	// Get upcoming appointments
	getUpcomingAppointments: () => {
		const now = new Date();
		return get()
			.appointments.filter((apt) => new Date(apt.appointmentDate) >= now && (apt.status === "pending" || apt.status === "accepted"))
			.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
	},

	// Get past appointments
	getPastAppointments: () => {
		const now = new Date();
		return get()
			.appointments.filter((apt) => new Date(apt.appointmentDate) < now || apt.status === "completed" || apt.status === "cancelled")
			.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
	},

	// Get appointments by status
	getAppointmentsByStatus: (status) => {
		return get().appointments.filter((apt) => apt.status === status);
	},

	// Clear error
	clearError: () => set({ error: null }),

	// Clear all data (useful for logout)
	clearAppointmentData: () => {
		set({
			appointments: [],
			healthProfessionals: [],
			loading: false,
			error: null,
		});
	},
}));
