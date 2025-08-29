import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore.jsx";
import Navbar from "./Navbar";

const Layout = () => {
	const { user } = useUserStore();
	useEffect(() => {
		// runs whenever user changes
	}, [user]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
