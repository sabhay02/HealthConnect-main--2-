import { AlertTriangle, Calendar, CheckCircle, Clock, MessageSquare, Phone, Users, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import emailjs from "emailjs-com"; // Updated import

const HealthcareDashboard = () => {
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [emailStatus, setEmailStatus] = useState(''); // For showing email status

	const {
		appointments,
		fetchAppointments,
		fetchHealthProfessionals,
		updateAppointmentStatus,
		getAppointmentsByStatus,
		getUpcomingAppointments,
		getPastAppointments,
		loading,
		error,
		clearError,
	} = useAppointmentStore();

	// Initialize EmailJS
	useEffect(() => {
		// Initialize EmailJS with your public key
		emailjs.init("D4GFAJzB2x1z2bDs5");
		console.log("EmailJS initialized");
	}, []);

	useEffect(() => {
		const loadData = async () => {
			try {
				await Promise.all([fetchAppointments(), fetchHealthProfessionals()]);
			} catch (error) {
				console.error("Failed to load dashboard data:", error);
			}
		};
		loadData();
	}, [fetchAppointments, fetchHealthProfessionals]);

	const pendingAppointments = getAppointmentsByStatus("pending");
	const upcomingAppointments = getUpcomingAppointments();
	const pastAppointments = getPastAppointments();

	// ---- EmailJS send function ----
	const sendAppointmentEmail = async (appointment) => {
		try {
			console.log("🔍 Full appointment object:", appointment);
			
			// The patient field contains an ID, not the actual patient object
			// We need to look for email in other places or fetch patient data
			let patientEmail, patientName;
			
			// Check if email is stored directly on appointment
			if (appointment.patientEmail || appointment.email || appointment.userEmail) {
				patientEmail = appointment.patientEmail || appointment.email || appointment.userEmail;
				patientName = appointment.patientName || appointment.userName || "Patient";
			}
			// Check if patient is populated (object instead of string ID)
			else if (appointment.patient && typeof appointment.patient === 'object' && appointment.patient.email) {
				patientEmail = appointment.patient.email;
				patientName = appointment.patient.name || "Patient";
			}
			// If patient is just an ID, we might need to fetch patient data
			// or check if there's a populated patient field elsewhere
			else {
				console.log("🔍 Patient field is ID:", appointment.patient);
				console.log("🔍 Looking for email in other fields...");
				console.log("🔍 All appointment fields:", Object.keys(appointment));
				
				// Check if there's an email field stored elsewhere
				// Sometimes the email might be in a different field
				patientEmail = appointment.contactEmail || 
							  appointment.clientEmail || 
							  appointment.bookingEmail ||
							  appointment.requestEmail;
				
				patientName = appointment.contactName || 
							 appointment.clientName || 
							 appointment.bookingName ||
							 appointment.requestName ||
							 "Patient";
			}

			console.log("🔍 Found patient email:", patientEmail);
			console.log("🔍 Found patient name:", patientName);
			
			// Validate required fields
			if (!patientEmail) {
				console.error("❌ No patient email found in any expected field");
				console.log("🔍 Available fields:", Object.keys(appointment));
				throw new Error(`Patient email not found. Available fields: ${Object.keys(appointment).join(', ')}`);
			}

			// Prepare template parameters to match your EmailJS template exactly
			const templateParams = {
				to_email: patientEmail,
				to_name: patientName,
				health_prof_name: appointment.healthProfessional?.name || "Healthcare Team",
				health_prof_email: appointment.healthProfessional?.email || "noreply@healthcare.com",
				meeting_link: appointment.meetingLink || `https://meet.jit.si/${appointment._id}`,
				appointment_date: formatDate(appointment.appointmentDate),
				appointment_time: formatTime(appointment.appointmentTime),
			};

			console.log("📧 Sending email with template params:", templateParams);
			setEmailStatus('Sending email...');

			const result = await emailjs.send(
				"service_ypl51ui",    // Your service ID
				"template_uqsslc3",   // Your template ID
				templateParams,
				"D4GFAJzB2x1z2bDs5"   // Your public key
			);

			console.log("✅ Email sent successfully:", result);
			setEmailStatus('Email sent successfully!');
			
			// Clear success message after 3 seconds
			setTimeout(() => setEmailStatus(''), 3000);
			
			return result;
			
		} catch (error) {
			console.error("❌ Failed to send email:", error);
			setEmailStatus('Failed to send email: ' + (error.message || error.text || 'Unknown error'));
			
			// Clear error message after 5 seconds
			setTimeout(() => setEmailStatus(''), 5000);
			
			throw error;
		}
	};

	// Test email function for debugging
	const testEmail = async () => {
		try {
			setEmailStatus('Testing email connection...');
			
			const testParams = {
				to_email: "test@example.com", // Replace with your test email
				to_name: "Test Patient",
				health_prof_name: "Dr. Test",
				health_prof_email: "doctor@test.com",
				meeting_link: "https://meet.jit.si/test123",
				appointment_date: "Dec 25, 2024",
				appointment_time: "10:00 AM",
			};

			const result = await emailjs.send(
				"service_ypl51ui",
				"template_uqsslc3",
				testParams,
				"D4GFAJzB2x1z2bDs5"
			);
			
			console.log("✅ Test email sent:", result);
			setEmailStatus('Test email sent successfully!');
			
		} catch (error) {
			console.error("❌ Test email failed:", error);
			setEmailStatus('Test email failed: ' + (error.message || error.text || 'Unknown error'));
		}
	};

	// ---- Status update with improved email handling ----
	const handleStatusUpdate = async (appointmentId, newStatus) => {
		try {
			console.log(`🔄 Updating appointment ${appointmentId} to status: ${newStatus}`);
			
			const updated = await updateAppointmentStatus(appointmentId, newStatus);
			console.log("✅ Appointment updated:", updated);

			// Send email only on acceptance
			if (newStatus === "accepted") {
				// Try multiple possible email field locations
				const patientEmail = updated.patient?.email || 
								   updated.patientEmail || 
								   updated.email || 
								   updated.patient?.emailAddress ||
								   updated.userEmail;

				console.log("🔍 Checking for email in updated appointment:");
				console.log("🔍 updated.patient?.email:", updated.patient?.email);
				console.log("🔍 updated.patientEmail:", updated.patientEmail);
				console.log("🔍 updated.email:", updated.email);
				console.log("🔍 Final patientEmail found:", patientEmail);

				if (patientEmail) {
					try {
						await sendAppointmentEmail(updated);
						console.log("✅ Confirmation email sent successfully");
					} catch (emailError) {
						console.error("❌ Email failed but appointment was updated:", emailError);
						alert(`Appointment ${newStatus} successfully, but failed to send confirmation email. Please contact the patient directly at ${patientEmail}`);
					}
				} else {
					console.warn("⚠️ No patient email found in any expected field");
					console.log("🔍 Available fields in updated appointment:", Object.keys(updated));
					if (updated.patient) {
						console.log("🔍 Available fields in patient object:", Object.keys(updated.patient));
					}
					alert(`Appointment ${newStatus} successfully, but no patient email found to send confirmation.`);
				}
			}

			setShowModal(false);
			setSelectedAppointment(null);
			
		} catch (error) {
			console.error("❌ Failed to update appointment status:", error);
			alert("Failed to update appointment status. Please try again.");
		}
	};

	const openAppointmentModal = (appointment) => {
		setSelectedAppointment(appointment);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedAppointment(null);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "accepted":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			case "cancelled":
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = (dateString) =>
		new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	const formatTime = (timeString) => timeString;

	// Chart data for status distribution
	const analytics = (() => {
		const statusCounts = appointments.reduce((acc, apt) => {
			acc[apt.status] = (acc[apt.status] || 0) + 1;
			return acc;
		}, {});
		return {
			totalAppointments: appointments.length,
			pendingCount: statusCounts.pending || 0,
			acceptedCount: statusCounts.accepted || 0,
			completedCount: statusCounts.completed || 0,
			cancelledCount: (statusCounts.cancelled || 0) + (statusCounts.rejected || 0),
			statusCounts,
			monthlyData: [], // Add your monthly data calculation here
		};
	})();

	const statusChartData = Object.entries(analytics.statusCounts).map(([status, count]) => ({
		name: status.charAt(0).toUpperCase() + status.slice(1),
		value: count,
		color: getStatusColorForChart(status),
	}));

	function getStatusColorForChart(status) {
		switch (status) {
			case "pending":
				return "#F59E0B";
			case "accepted":
				return "#10B981";
			case "completed":
				return "#3B82F6";
			case "cancelled":
			case "rejected":
				return "#EF4444";
			default:
				return "#6B7280";
		}
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Healthcare Provider Dashboard</h1>
				<p className="mt-2 text-gray-600">Manage appointments and monitor platform activity</p>
				
				{/* Email Status Display */}
				{emailStatus && (
					<div className={`mt-4 p-3 rounded-md ${emailStatus.includes('Failed') || emailStatus.includes('failed') 
						? 'bg-red-100 text-red-800' 
						: emailStatus.includes('successfully') || emailStatus.includes('sent') 
						? 'bg-green-100 text-green-800' 
						: 'bg-blue-100 text-blue-800'}`}>
						{emailStatus}
					</div>
				)}

				{/* Debug Info - Remove in production */}
				<div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
					<h4 className="font-semibold text-gray-900 mb-2">Debug Info (Remove in production)</h4>
					<div className="text-sm text-gray-700 space-y-1">
						<p><strong>Total appointments:</strong> {appointments.length}</p>
						<p><strong>Sample appointment structure:</strong></p>
						{appointments.length > 0 && (
							<pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
								{JSON.stringify(appointments[0], null, 2)}
							</pre>
						)}
					</div>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
					<div className="flex items-center">
						<AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
						<p className="text-red-800">{error}</p>
						<button
							onClick={clearError}
							className="ml-auto text-red-600 hover:text-red-800"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<div className="flex items-center">
						<Calendar className="h-8 w-8 text-blue-600" />
						<div className="ml-4">
							<p className="text-2xl font-bold text-gray-900">{analytics.totalAppointments}</p>
							<p className="text-sm text-gray-600">Total Appointments</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<div className="flex items-center">
						<Clock className="h-8 w-8 text-yellow-600" />
						<div className="ml-4">
							<p className="text-2xl font-bold text-gray-900">{analytics.pendingCount}</p>
							<p className="text-sm text-gray-600">Pending Requests</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<div className="flex items-center">
						<CheckCircle className="h-8 w-8 text-green-600" />
						<div className="ml-4">
							<p className="text-2xl font-bold text-gray-900">{analytics.acceptedCount}</p>
							<p className="text-sm text-gray-600">Accepted</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<div className="flex items-center">
						<Users className="h-8 w-8 text-purple-600" />
						<div className="ml-4">
							<p className="text-2xl font-bold text-gray-900">{analytics.completedCount}</p>
							<p className="text-sm text-gray-600">Completed</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{/* Monthly Activity Chart */}
				<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={analytics.monthlyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="consultations" fill="#3B82F6" name="Completed" />
							<Bar dataKey="pending" fill="#F59E0B" name="Pending" />
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Status Distribution */}
				<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status Distribution</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={statusChartData}
								cx="50%"
								cy="50%"
								outerRadius={100}
								fill="#8884d8"
								dataKey="value"
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
							>
								{statusChartData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Pending Appointments */}
			<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
					<AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
					Pending Appointment Requests ({pendingAppointments.length})
				</h3>

				{loading && (
					<div className="text-center py-4">
						<div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
						<span className="ml-2 text-gray-600">Loading appointments...</span>
					</div>
				)}

				{pendingAppointments.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<p>No pending appointment requests</p>
					</div>
				) : (
					<div className="space-y-4">
						{pendingAppointments.map((appointment) => (
							<div
								key={appointment._id}
								className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
							>
								<div className="flex justify-between items-start mb-3">
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
											<Users className="h-5 w-5 text-blue-600" />
										</div>
										<div>
											<h4 className="font-semibold text-gray-900">{appointment.patient?.name || "Patient"}</h4>
											<p className="text-sm text-gray-600">{appointment.patient?.email || "No email provided"}</p>
										</div>
									</div>
									<div className="flex items-center space-x-2 text-sm text-gray-600">
										<div className="flex items-center">
											{appointment.appointmenttype === "video" ? 
												<Video className="h-4 w-4 mr-1" /> : 
												<Phone className="h-4 w-4 mr-1" />
											}
											{appointment.appointmenttype || "video"}
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
									<div className="flex items-center">
										<Calendar className="h-4 w-4 mr-1" />
										{formatDate(appointment.appointmentDate)}
									</div>
									<div className="flex items-center">
										<Clock className="h-4 w-4 mr-1" />
										{formatTime(appointment.appointmentTime)}
									</div>
								</div>

								{appointment.description && (
									<div className="mb-3 p-3 bg-gray-50 rounded-md">
										<p className="text-sm text-gray-700">
											<strong>Description:</strong> {appointment.description}
										</p>
									</div>
								)}

								<div className="flex space-x-3">
									<button
										onClick={() => handleStatusUpdate(appointment._id, "accepted")}
										disabled={loading}
										className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
									>
										{loading ? 'Processing...' : 'Accept'}
									</button>
									<button
										onClick={() => handleStatusUpdate(appointment._id, "rejected")}
										disabled={loading}
										className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
									>
										Decline
									</button>
									<button
										onClick={() => openAppointmentModal(appointment)}
										className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
									>
										View Details
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Upcoming Appointments */}
			<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments ({upcomingAppointments.length})</h3>

				{upcomingAppointments.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<p>No upcoming appointments</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{upcomingAppointments.slice(0, 6).map((appointment) => (
							<div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
								<div className="flex justify-between items-start mb-2">
									<div>
										<h4 className="font-medium text-gray-900">{appointment.patient?.name || "Patient"}</h4>
										<p className="text-sm text-gray-600">
											{formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
										</p>
									</div>
									<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
										{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
									</span>
								</div>
								<div className="flex items-center text-sm text-gray-500">
									{appointment.appointmenttype === "video" ? 
										<Video className="h-4 w-4 mr-1" /> : 
										<Phone className="h-4 w-4 mr-1" />
									}
									{appointment.appointmenttype} consultation
								</div>
								{appointment.status === "accepted" && (
									<div className="mt-3">
										<button
											onClick={() => handleStatusUpdate(appointment._id, "completed")}
											disabled={loading}
											className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
										>
											Mark Completed
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Past Appointments */}
			<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Past Appointments ({pastAppointments.length})</h3>

				{pastAppointments.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<p>No past appointments</p>
					</div>
				) : (
					<div className="space-y-3">
						{pastAppointments.slice(0, 10).map((appointment) => (
							<div key={appointment._id} className="border border-gray-200 rounded-lg p-3">
								<div className="flex justify-between items-center">
									<div className="flex items-center space-x-3">
										<CheckCircle className={`h-5 w-5 ${
											appointment.status === "completed" ? "text-green-600" : "text-gray-400"
										}`} />
										<div>
											<h4 className="font-medium text-gray-900">{appointment.patient?.name || "Patient"}</h4>
											<p className="text-sm text-gray-600">
												{formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
											</p>
										</div>
									</div>
									<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
										{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Appointment Details Modal */}
			{showModal && selectedAppointment && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
							<button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="space-y-3">
							<div>
								<label className="text-sm font-medium text-gray-700">Patient:</label>
								<p className="text-gray-900">{selectedAppointment.patient?.name || "Not provided"}</p>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">Email:</label>
								<p className="text-gray-900">{selectedAppointment.patient?.email || "Not provided"}</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-gray-700">Date:</label>
									<p className="text-gray-900">{formatDate(selectedAppointment.appointmentDate)}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-700">Time:</label>
									<p className="text-gray-900">{formatTime(selectedAppointment.appointmentTime)}</p>
								</div>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">Type:</label>
								<p className="text-gray-900 capitalize">{selectedAppointment.appointmenttype}</p>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-700">Status:</label>
								<span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
									{selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
								</span>
							</div>

							{selectedAppointment.description && (
								<div>
									<label className="text-sm font-medium text-gray-700">Description:</label>
									<p className="text-gray-900">{selectedAppointment.description}</p>
								</div>
							)}
						</div>

						{selectedAppointment.status === "pending" && (
							<div className="flex space-x-3 mt-6">
								<button
									onClick={() => handleStatusUpdate(selectedAppointment._id, "accepted")}
									disabled={loading}
									className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
								>
									{loading ? 'Processing...' : 'Accept'}
								</button>
								<button
									onClick={() => handleStatusUpdate(selectedAppointment._id, "rejected")}
									disabled={loading}
									className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
								>
									Decline
								</button>
							</div>
						)}

						{selectedAppointment.status === "accepted" && (
							<div className="mt-6">
								<button
									onClick={() => handleStatusUpdate(selectedAppointment._id, "completed")}
									disabled={loading}
									className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
								>
									Mark as Completed
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default HealthcareDashboard;