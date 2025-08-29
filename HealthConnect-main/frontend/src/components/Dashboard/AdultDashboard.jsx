import { BookOpen, Calendar, Heart, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppointmentStore } from "../../store/useAppointmentStore";

const AdultDashboard = () => {
	const { appointments, loading } = useAppointmentStore();

	if (loading) return <p>Loading...</p>;

	// safely get latest appointment (only if appointments exist)
	const latestAppointment = appointments.length > 0 ? [...appointments].sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())[0] : null;

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
				<p className="mt-2 text-gray-600">Comprehensive sexual health resources and professional support</p>
			</div>

			{/* Top links */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<Link
					to="/learn"
					className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
				>
					<BookOpen className="h-8 w-8 text-blue-600 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Learn</h3>
					<p className="text-gray-600">Articles, myths vs facts, and quizzes</p>
				</Link>

				<Link
					to="/consultations"
					className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
				>
					<Calendar className="h-8 w-8 text-purple-600 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Consultations</h3>
					<p className="text-gray-600">Book appointments with professionals</p>
				</Link>

				<Link
					to="/stories"
					className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
				>
					<Users className="h-8 w-8 text-orange-600 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
					<p className="text-gray-600">Share and read anonymous stories</p>
				</Link>

				<Link
					to="/ask"
					className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
				>
					<MessageCircle className="h-8 w-8 text-teal-600 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Ask Questions</h3>
					<p className="text-gray-600">Get instant answers to your questions</p>
				</Link>
			</div>

			{/* Bottom section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Upcoming Appointments */}
				<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>

					{appointments.length === 0 ? (
						<p className="text-gray-500">No upcoming appointments</p>
					) : (
						<div className="p-4 border rounded shadow">
							<h2 className="text-lg font-semibold">Latest Appointment</h2>
							<p>
								<strong>Doctor:</strong> {latestAppointment?.healthProfessional?.name || "N/A"}
							</p>
							<p>
								<strong>Date:</strong> {latestAppointment?.appointmentDate ? new Date(latestAppointment.appointmentDate).toLocaleString() : "N/A"}
							</p>
						</div>
					)}

					<Link
						to="/consultations"
						className="block mt-4 text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
					>
						View All Appointments
					</Link>
				</div>

				{/* Recent Activity (still hardcoded for now) */}
				<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
					<div className="space-y-3">
						<div className="flex items-center space-x-3">
							<Heart className="h-5 w-5 text-red-500" />
							<div>
								<p className="text-sm font-medium text-gray-900">Completed STI Prevention Quiz</p>
								<p className="text-xs text-gray-600">2 days ago</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<BookOpen className="h-5 w-5 text-blue-500" />
							<div>
								<p className="text-sm font-medium text-gray-900">Read: Healthy Relationships</p>
								<p className="text-xs text-gray-600">1 week ago</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<Users className="h-5 w-5 text-orange-500" />
							<div>
								<p className="text-sm font-medium text-gray-900">Shared anonymous story</p>
								<p className="text-xs text-gray-600">2 weeks ago</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdultDashboard;
