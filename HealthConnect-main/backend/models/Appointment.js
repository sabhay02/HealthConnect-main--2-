import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
	{
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		healthProfessional: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		appointmentDate: {
			type: Date,
			required: true,
		},
		appointmentTime: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			maxLength: 500,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
			default: "pending",
		},
		appointmenttype: {
			type: String,
			enum: ["video", "phone"],
			default: "voice",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
