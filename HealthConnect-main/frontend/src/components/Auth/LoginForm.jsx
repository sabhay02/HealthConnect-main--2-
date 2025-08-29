import { Heart, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore.jsx";

const LoginForm = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { login, user, loading } = useUserStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(formData);
		navigate("/dashboard");
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<Heart className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">HealthConnect</h2>
					<p className="mt-2 text-sm text-gray-600">Safe space for sexual health education and support</p>
				</div>

				<form
					className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
					onSubmit={handleSubmit}
				>
					<div className="space-y-4">
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
									className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
									placeholder="Email address"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								/>
							</div>
						</div>

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
									className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
									placeholder="Password"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								/>
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							Login
						</button>
					</div>
					<div className="text-center text-sm">
						New Here?!{" "}
						<a
							href="/signup"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Sign up
						</a>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
