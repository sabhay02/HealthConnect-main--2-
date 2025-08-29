import { Heart, LogOut, Menu, User } from "lucide-react";
import React, { useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore.jsx";

const Navbar = () => {
	const { user, logout } = useUserStore();

	useEffect(() => {
		// runs whenever user changes
	}, [user]);
	const location = useLocation();

	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const navItems = React.useMemo(() => {
		if (!user) return [];

		const baseItems = [
			{ key: "home", path: "/dashboard", label: "Home" },
			{ key: "learn", path: "/learn", label: "Learn" },
			{ key: "ask", path: "/ask", label: "Ask" },
		];

		if (user.userType === "adult") {
			baseItems.push({ key: "stories", path: "/stories", label: "Stories" }, { key: "consultations", path: "/consultations", label: "Consultations" });
		}

		if (user.userType === "health_prof") {
			baseItems.push({ key: "admin", path: "/admin", label: "Admin" });
		}

		return baseItems;
	}, [user]);

	if (!user) return null;

	return (
		<nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link
							to="/dashboard"
							className="flex items-center space-x-2"
						>
							<Heart className="h-8 w-8 text-blue-600" />
							<span className="text-xl font-bold text-gray-900">HealthConnect</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<Link
								key={item.key}
								to={item.path}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
							>
								{item.label}
							</Link>
						))}
					</div>

					{/* Right side items */}
					<div className="flex items-center space-x-4">
						{/* User Menu */}
						<div className="flex items-center space-x-2">
							<User className="h-5 w-5 text-gray-600" />
							<span className="text-sm font-medium text-gray-700">{user?.name}</span>
							<button
								onClick={logout}
								className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
								title="Logout"
							>
								<LogOut className="h-4 w-4" />
							</button>
						</div>

						{/* Mobile menu button */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
						>
							<Menu className="h-6 w-6" />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden border-t border-gray-200">
					<div className="px-2 pt-2 pb-3 space-y-1">
						{navItems.map((item) => (
							<Link
								key={item.key}
								to={item.path}
								onClick={() => setIsMenuOpen(false)}
								className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${location.pathname === item.path ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
