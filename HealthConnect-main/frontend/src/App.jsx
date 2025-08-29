import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AskPage from "./components/Ask/AskPage";
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import ConsultationsPage from "./components/Consultations/ConsultationsPage";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./components/Layout/Layout";
import LearnPage from "./components/Learn/LearnPage";
import StoriesPage from "./components/Stories/StoriesPage";

import { useEffect } from "react";
import { useUserStore } from "./store/useUserStore.jsx";

// ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
	const { user, checkingAuth } = useUserStore();

	if (checkingAuth) {
		// Show nothing or a loading spinner while auth status is being checked
		return <div>Loading...</div>;
	}

	if (!user) {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	return children;
};

const AppContent = () => {
	const { user, checkAuth, checkingAuth } = useUserStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// Show loading until auth check is complete
	if (checkingAuth) return <div>Loading...</div>;

	return (
		<Router>
			<Routes>
				{/* Public routes */}
				<Route
					path="/login"
					element={
						!user ? (
							<LoginForm />
						) : (
							<Navigate
								to="/dashboard"
								replace
							/>
						)
					}
				/>
				<Route
					path="/signup"
					element={
						!user ? (
							<SignupForm />
						) : (
							<Navigate
								to="/dashboard"
								replace
							/>
						)
					}
				/>

				{/* Protected layout */}
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Layout />
						</ProtectedRoute>
					}
				>
					<Route
						index
						element={
							<Navigate
								to="/dashboard"
								replace
							/>
						}
					/>
					<Route
						path="dashboard"
						element={<Dashboard />}
					/>
					<Route
						path="learn"
						element={<LearnPage />}
					/>
					<Route
						path="stories"
						element={<StoriesPage />}
					/>
					<Route
						path="consultations"
						element={<ConsultationsPage />}
					/>
					<Route
						path="admin"
						element={<Dashboard />}
					/>
					<Route
						path="ask"
						element={<AskPage />}
					/>
				</Route>

				{/* Catch-all route */}
				<Route
					path="*"
					element={
						<Navigate
							to={user ? "/dashboard" : "/login"}
							replace
						/>
					}
				/>
			</Routes>
		</Router>
	);
};

function App() {
	const { user } = useUserStore();

	return <AppContent key={user?._id || "guest"} />;
}

export default App;
