import { Calendar, Heart, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore.jsx";

const SignupForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		userType: "", // instead of age
		email: "",
		password: "",
	});

	const { register, user, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		register(formData);
		navigate("/dashboard");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<Heart className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">HealthConnect</h2>
					<p className="mt-2 text-sm text-gray-600">Safe space for sexual health education and support</p>
				</div>

				{/* Form */}
				<form
					className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
					onSubmit={handleSubmit}
				>
					<div className="space-y-4">
						{/* Name Input */}
						<div>
							<label
								htmlFor="name"
								className="sr-only"
							>
								Name
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="name"
									name="name"
									type="text"
									required
									className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Full Name"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								/>
							</div>
						</div>

						{/* Role Group Dropdown */}
						<div>
							<label
								htmlFor="userType"
								className="sr-only"
							>
								Role Group
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Calendar className="h-5 w-5 text-gray-400" />
								</div>
								<select
									id="userType"
									name="userType"
									required
									className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									value={formData.userType}
									onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
								>
									<option
										value=""
										disabled
									>
										Select your category
									</option>
									<option value="adolescent">Adolescent (10–18)</option>
									<option value="adult">Adult (18+)</option>
									<option value="health_prof">Professional / Expert</option>
								</select>
							</div>
						</div>

						{/* Email Input */}
						<div>
							<label
								htmlFor="email"
								className="sr-only"
							>
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									required
									className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Email Address"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								/>
							</div>
						</div>

						{/* Password Input */}
						<div>
							<label
								htmlFor="password"
								className="sr-only"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									name="password"
									type="password"
									required
									className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Password"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								/>
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							Sign Up
						</button>
					</div>

					<div className="text-center text-sm">
						Already Have An Account?{" "}
						<a
							href="/login"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Login
						</a>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignupForm;
