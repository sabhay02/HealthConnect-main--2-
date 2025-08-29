import { AlertTriangle, Calendar, CheckCircle, Clock, MapPin, MessageSquare, Phone, Plus, Users, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import emailjs from "emailjs-com";

const HealthcareDashboard = () => {
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [emailStatus, setEmailStatus] = useState('');
	const [showMapsModal, setShowMapsModal] = useState(false);

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

	// Fixed EmailJS send function
	const sendAppointmentEmail = async (appointment) => {
		try {
			console.log("🔍 Sending email for appointment:", appointment);
			
			const patientEmail = appointment.patient?.email;
			const patientName = appointment.patient?.name || "Patient";
			const healthProfName = appointment.healthProfessional?.name || "Healthcare Professional";

			if (!patientEmail) {
				throw new Error("Patient email not found");
			}

			// Generate meeting link
			const meetingLink = `https://meet.jit.si/healthconnect-${appointment._id}`;

			// Template parameters matching your EmailJS template
			const templateParams = {
				to_name: patientName,
				to_email: patientEmail,
				health_prof_name: healthProfName,
				appointment_date: formatDate(appointment.appointmentDate),
				appointment_time: formatTime(appointment.appointmentTime),
				meeting_link: meetingLink,
			};

			console.log("📧 Sending email with params:", templateParams);
			setEmailStatus('Sending confirmation email...');

			const result = await emailjs.send(
				"service_ypl51ui",
				"template_uqsslc3",
				templateParams,
				"D4GFAJzB2x1z2bDs5"
			);

			console.log("✅ Email sent successfully:", result);
			setEmailStatus('Confirmation email sent successfully!');
			
			setTimeout(() => setEmailStatus(''), 3000);
			return result;
			
		} catch (error) {
			console.error("❌ Failed to send email:", error);
			setEmailStatus('Failed to send email: ' + (error.message || error.text || 'Unknown error'));
			setTimeout(() => setEmailStatus(''), 5000);
			throw error;
		}
	};

	// Status update with fixed email handling
	const handleStatusUpdate = async (appointmentId, newStatus) => {
		try {
			console.log(`🔄 Updating appointment ${appointmentId} to status: ${newStatus}`);
			
			const updated = await updateAppointmentStatus(appointmentId, newStatus);
			console.log("✅ Appointment updated:", updated);

			// Send email only on acceptance
			if (newStatus === "accepted") {
				try {
					await sendAppointmentEmail(updated);
					console.log("✅ Confirmation email sent successfully");
				} catch (emailError) {
					console.error("❌ Email failed but appointment was updated:", emailError);
					alert(`Appointment ${newStatus} successfully, but failed to send confirmation email.`);
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
			monthlyData: [],
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
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Healthcare Provider Dashboard</h1>
						<p className="mt-2 text-gray-600">Manage appointments and monitor platform activity</p>
					</div>
					<button
						onClick={() => setShowMapsModal(true)}
						className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
					>
						<MapPin className="h-4 w-4 mr-2" />
						Find Nearby Hospitals
					</button>
				</div>
				
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
							×
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
										{appointment.status}
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
										{appointment.status}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Hospital Maps Modal */}
			{showMapsModal && (
				<HospitalMapsModal onClose={() => setShowMapsModal(false)} />
			)}

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
									{selectedAppointment.status}
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

// Hospital Maps Modal Component
const HospitalMapsModal = ({ onClose }) => {
	const [userLocation, setUserLocation] = useState(null);
	const [nearbyHospitals, setNearbyHospitals] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [mapLoaded, setMapLoaded] = useState(false);

	// Sample hospital data with sexual health specialists
	const hospitalData = [
		{
			id: 1,
			name: "City General Hospital",
			address: "123 Main St, Downtown",
			phone: "+1-555-0123",
			specialties: ["Sexual Health", "Reproductive Medicine", "STI Testing"],
			rating: 4.5,
			distance: "0.8 km",
			coordinates: { lat: 40.7128, lng: -74.0060 }
		},
		{
			id: 2,
			name: "Women's Health Center",
			address: "456 Oak Ave, Midtown",
			phone: "+1-555-0456",
			specialties: ["Gynecology", "Sexual Health", "Family Planning"],
			rating: 4.7,
			distance: "1.2 km",
			coordinates: { lat: 40.7589, lng: -73.9851 }
		},
		{
			id: 3,
			name: "Metro Sexual Health Clinic",
			address: "789 Pine St, Uptown",
			phone: "+1-555-0789",
			specialties: ["STI Testing", "Sexual Health Counseling", "LGBTQ+ Care"],
			rating: 4.6,
			distance: "2.1 km",
			coordinates: { lat: 40.7831, lng: -73.9712 }
		},
		{
			id: 4,
			name: "University Medical Center",
			address: "321 College Blvd, University District",
			phone: "+1-555-0321",
			specialties: ["Sexual Health", "Student Health", "Reproductive Health"],
			rating: 4.3,
			distance: "3.5 km",
			coordinates: { lat: 40.8176, lng: -73.9782 }
		}
	];

	useEffect(() => {
		getCurrentLocation();
	}, []);

	const getCurrentLocation = () => {
		setLoading(true);
		setError(null);

		if (!navigator.geolocation) {
			setError("Geolocation is not supported by this browser");
			setLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const location = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				setUserLocation(location);
				findNearbyHospitals(location);
				setLoading(false);
			},
			(error) => {
				console.error("Geolocation error:", error);
				setError("Unable to get your location. Please enable location services.");
				// Use default location (New York City) for demo
				const defaultLocation = { lat: 40.7128, lng: -74.0060 };
				setUserLocation(defaultLocation);
				findNearbyHospitals(defaultLocation);
				setLoading(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000
			}
		);
	};

	const findNearbyHospitals = (location) => {
		// Calculate distances and sort by proximity
		const hospitalsWithDistance = hospitalData.map(hospital => {
			const distance = calculateDistance(
				location.lat, 
				location.lng, 
				hospital.coordinates.lat, 
				hospital.coordinates.lng
			);
			return {
				...hospital,
				calculatedDistance: distance,
				distance: `${distance.toFixed(1)} km`
			};
		});

		// Sort by distance and take closest 10
		const sortedHospitals = hospitalsWithDistance
			.sort((a, b) => a.calculatedDistance - b.calculatedDistance)
			.slice(0, 10);

		setNearbyHospitals(sortedHospitals);
	};

	// Haversine formula to calculate distance between two coordinates
	const calculateDistance = (lat1, lng1, lat2, lng2) => {
		const R = 6371; // Earth's radius in kilometers
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLng = (lng2 - lng1) * Math.PI / 180;
		const a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
			Math.sin(dLng/2) * Math.sin(dLng/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return R * c;
	};

	const openInMaps = (hospital) => {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}&destination_place_id=${hospital.name}`;
		window.open(url, '_blank');
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
				<div className="flex justify-between items-center p-6 border-b border-gray-200">
					<div>
						<h3 className="text-xl font-semibold text-gray-900">Nearby Sexual Health Specialists</h3>
						<p className="text-sm text-gray-600 mt-1">Find hospitals and clinics with sexual health professionals</p>
					</div>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600">
						<X className="h-6 w-6" />
					</button>
				</div>

				<div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
					{loading && (
						<div className="text-center py-8">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							<p className="mt-2 text-gray-600">Getting your location...</p>
						</div>
					)}

					{error && (
						<div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
							<div className="flex items-center">
								<AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
								<p className="text-yellow-800">{error}</p>
							</div>
							<p className="text-sm text-yellow-700 mt-2">Showing results for default location (NYC)</p>
						</div>
					)}

					{userLocation && (
						<div className="mb-6">
							<div className="bg-blue-50 border border-blue-200 rounded-md p-4">
								<div className="flex items-center">
									<MapPin className="h-5 w-5 text-blue-600 mr-2" />
									<div>
										<p className="text-blue-800 font-medium">Your Location</p>
										<p className="text-sm text-blue-600">
											Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{nearbyHospitals.length > 0 && (
						<div className="space-y-4">
							<h4 className="text-lg font-semibold text-gray-900 mb-4">
								Found {nearbyHospitals.length} nearby facilities
							</h4>
							
							{nearbyHospitals.map((hospital) => (
								<div key={hospital.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
									<div className="flex justify-between items-start mb-3">
										<div className="flex-1">
											<h5 className="font-semibold text-gray-900 text-lg">{hospital.name}</h5>
											<p className="text-gray-600 text-sm mt-1">{hospital.address}</p>
											<div className="flex items-center mt-2 space-x-4">
												<span className="text-sm text-gray-500">📞 {hospital.phone}</span>
												<span className="text-sm text-blue-600">📍 {hospital.distance}</span>
												<div className="flex items-center">
													<span className="text-yellow-500">⭐</span>
													<span className="text-sm text-gray-600 ml-1">{hospital.rating}</span>
												</div>
											</div>
										</div>
									</div>

									<div className="mb-3">
										<p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
										<div className="flex flex-wrap gap-2">
											{hospital.specialties.map((specialty, index) => (
												<span
													key={index}
													className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
												>
													{specialty}
												</span>
											))}
										</div>
									</div>

									<div className="flex space-x-3">
										<button
											onClick={() => openInMaps(hospital)}
											className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
										>
											<MapPin className="h-4 w-4 mr-2" />
											Get Directions
										</button>
										<a
											href={`tel:${hospital.phone}`}
											className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
										>
											<Phone className="h-4 w-4 mr-2" />
											Call
										</a>
									</div>
								</div>
							))}
						</div>
					)}

					{!loading && nearbyHospitals.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							<MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No nearby hospitals found</p>
							<button
								onClick={getCurrentLocation}
								className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
							>
								Retry Location
							</button>
						</div>
					)}
				</div>

				<div className="border-t border-gray-200 p-4">
					<button
						onClick={onClose}
						className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default HealthcareDashboard;