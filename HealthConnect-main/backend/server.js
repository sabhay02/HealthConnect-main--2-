import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Import routes (must use .js extension in ESM)
import appointmentRoutes from "./routes/appointments.js";
import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/question.js";
import storyRoutes from "./routes/stories.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
	cors({
		origin: "http://localhost:5173", // your frontend URL
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());

// Logging (only in development)
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/questions", questionRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "✅ Health Connect Backend is running!",
		environment: process.env.NODE_ENV,
		timestamp: new Date().toISOString(),
	});
});

// Handle 404 (Not Found)
app.use("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: `Route ${req.originalUrl} not found`,
	});
});

// Global error handler
app.use((err, req, res, next) => {
	console.error("🔥 Server Error:", err);

	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Something went wrong!",
		error: process.env.NODE_ENV === "development" ? err.stack : "Internal server error",
	});
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
