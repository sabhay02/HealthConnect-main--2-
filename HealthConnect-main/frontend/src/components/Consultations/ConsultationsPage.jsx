import { AlertCircle, Calendar, CheckCircle, Clock, Phone, Plus, User, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppointmentStore } from "../../store/useAppointmentStore.jsx";

const ConsultationsPage = () => {
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [selectedDate, setSelectedDate] = useState("");
	const [selectedTime, setSelectedTime] = useState("");
	const [selectedDoctor, setSelectedDoctor] = useState("");
	const [consultationType, setConsultationType] = useState("video");
	const [reason, setReason] = useState("");

	const { appointments, healthProfessionals, fetchAppointments, fetchHealthProfessionals, createAppointment, getUpcomingAppointments, getPastAppointments, loading, error, clearError } = useAppointmentStore();

	const availableTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

	useEffect(() => {
		const loadData = async () => {
			try {
				await Promise.all([fetchHealthProfessionals(), fetchAppointments()]);
			} catch (error) {
				console.error("Failed to load initial data:", error);
			}
		};
		loadData();
	}, [fetchHealthProfessionals, fetchAppointments]);

	const handleBookAppointment = async () => {
		if (!selectedDoctor || !selectedDate || !selectedTime) {
			alert("Please fill in all required fields");
			return;
		}

		try {
			clearError();
			await createAppointment({
				doctorId: selectedDoctor,
				date: selectedDate,
				time: selectedTime,
				type: consultationType,
				reason: reason,
			});

			// Reset form
			setShowBookingForm(false);
			setSelectedDate("");
			setSelectedTime("");
			setSelectedDoctor("");
			setReason("");
			setConsultationType("video");

			alert("Appointment booked successfully!");
		} catch (err) {
			console.error("Booking error:", err);
			alert(error || "Failed to book appointment");
		}
	};

	const handleCancelForm = () => {
		setShowBookingForm(false);
		setSelectedDate("");
		setSelectedTime("");
		setSelectedDoctor("");
		setReason("");
		setConsultationType("video");
		clearError();
	};

	const upcomingAppointments = getUpcomingAppointments();
	const pastAppointments = getPastAppointments();
	console.log(upcomingAppointments);

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Book Consultation</h1>
					<p className="mt-2 text-gray-600">Book confidential consultations with healthcare professionals</p>
				</div>
				{!showBookingForm && (
					<button
						onClick={() => setShowBookingForm(true)}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						<Plus className="h-4 w-4 mr-2" /> Book Appointment
					</button>
				)}
			</div>

			{/* Error Display */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
					<div className="flex items-center">
						<AlertCircle className="h-5 w-5 text-red-400 mr-2" />
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

			{/* Booking Form */}
			{showBookingForm && (
				<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-6">Book New Appointment</h2>

					{loading && (
						<div className="mb-4 text-center">
							<div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							<span className="ml-2 text-gray-600">Loading...</span>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Doctor Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								Select Doctor <span className="text-red-500">*</span>
							</label>
							{healthProfessionals.length === 0 ? (
								<div className="text-center py-8 text-gray-500">{loading ? "Loading doctors..." : "No doctors available"}</div>
							) : (
								<div className="space-y-3 max-h-64 overflow-y-auto">
									{healthProfessionals.map((doctor) => (
										<div
											key={doctor._id}
											className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedDoctor === doctor._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
											onClick={() => setSelectedDoctor(doctor._id)}
										>
											<div className="flex items-center space-x-3">
												<img
													src={doctor.image}
													alt={doctor.name}
													className="w-12 h-12 rounded-full object-cover"
												/>

												<div className="flex-1">
													<h4 className="font-semibold text-gray-900">{doctor.name}</h4>
													<p className="text-sm text-gray-600">{doctor.specialty}</p>
													{doctor.rating && doctor.experience && (
														<p className="text-xs text-gray-500">
															⭐ {doctor.rating} • {doctor.experience}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Date & Time Selection */}
						<div>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Select Date <span className="text-red-500">*</span>
								</label>
								<input
									type="date"
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									min={new Date().toISOString().split("T")[0]}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Select Time <span className="text-red-500">*</span>
								</label>
								<div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
									{availableTimes.map((time) => (
										<button
											key={time}
											type="button"
											onClick={() => setSelectedTime(time)}
											className={`px-3 py-2 text-sm border rounded-md transition-colors ${selectedTime === time ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:bg-gray-50"}`}
										>
											{time}
										</button>
									))}
								</div>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
								<div className="flex space-x-4">
									<button
										type="button"
										onClick={() => setConsultationType("video")}
										className={`flex items-center px-4 py-2 border rounded-md transition-colors ${consultationType === "video" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:bg-gray-50"}`}
									>
										<Video className="h-4 w-4 mr-2" /> Video Call
									</button>
									<button
										type="button"
										onClick={() => setConsultationType("phone")}
										className={`flex items-center px-4 py-2 border rounded-md transition-colors ${consultationType === "phone" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:bg-gray-50"}`}
									>
										<Phone className="h-4 w-4 mr-2" /> Phone Call
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit (Optional)</label>
						<textarea
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="Brief description of what you'd like to discuss..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							rows={3}
							maxLength={500}
						/>
						<p className="text-xs text-gray-500 mt-1">{reason.length}/500 characters</p>
					</div>

					<div className="flex space-x-3">
						<button
							onClick={handleBookAppointment}
							disabled={!selectedDoctor || !selectedDate || !selectedTime || loading}
							className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? "Booking..." : "Book Appointment"}
						</button>
						<button
							onClick={handleCancelForm}
							disabled={loading}
							className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Upcoming Appointments */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
				{upcomingAppointments.length === 0 ? (
					<div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
						<Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<p>No upcoming appointments</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{upcomingAppointments.map((apt) => (
							<div
								key={apt._id}
								className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
							>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center space-x-3">
										<User className="h-8 w-8 text-blue-600" />
										<div>
											<h3 className="font-semibold text-gray-900">{apt.healthProfessional.name}</h3>
											<p className="text-sm text-gray-600">{apt.specialty || "General Practice"}</p>
										</div>
									</div>
									<div className="flex items-center text-blue-600">{apt.appointmenttype === "video" ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}</div>
								</div>

								<div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
									<div className="flex items-center">
										<Calendar className="h-4 w-4 mr-1" />
										{new Date(apt.appointmentDate).toLocaleDateString()}
									</div>
									<div className="flex items-center">
										<Clock className="h-4 w-4 mr-1" />
										{apt.appointmentTime}
									</div>
								</div>

								<div className="mb-4">
									<span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${apt.status === "accepted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{apt.status}</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Past Appointments */}
			<div>
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Past Appointments</h2>
				{pastAppointments.length === 0 ? (
					<div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
						<CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
						<p>No past appointments</p>
					</div>
				) : (
					<div className="space-y-4">
						{pastAppointments.map((apt) => (
							<div
								key={apt._id}
								className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<CheckCircle className={`h-6 w-6 ${apt.status === "completed" ? "text-green-600" : "text-gray-400"}`} />
										<div>
											<h4 className="font-medium text-gray-900">{apt.healthProfessionalName || "Healthcare Professional"}</h4>
											<p className="text-sm text-gray-600">{apt.specialty || "General Practice"}</p>
											<span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${apt.status === "completed" ? "bg-green-100 text-green-800" : apt.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>{apt.status}</span>
										</div>
									</div>
									<div className="text-right text-sm text-gray-600">
										<p>{new Date(apt.appointmentDate).toLocaleDateString()}</p>
										<p>{apt.appointmentTime}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ConsultationsPage;
