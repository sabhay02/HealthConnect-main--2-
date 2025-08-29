import { create } from "zustand";
import axios from "../api/axios.js";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	register: async ({ name, email, password, userType }) => {
		set({ loading: true });
		try {
			const res = await axios.post("/auth/register", { name, email, password, userType });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
		}
	},

	login: async ({ email, password }) => {
		set({ loading: true });
		try {
			const res = await axios.post("/auth/login", { email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
		}
	},

	logout: async () => {
		set({ loading: true }); // Show loading during logout
		try {
			await axios.post("/auth/logout");
			// Clear ALL user-related state
			set({
				user: null,
				loading: false,
				error: null,
				checkingAuth: false,
			});
		} catch (error) {
			console.error("Logout error:", error);
			// Even if logout fails on server, clear local state
			set({
				user: null,
				loading: false,
				error: null,
				checkingAuth: false,
			});
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const res = await axios.get("/auth/me");
			set({ user: res.data, checkingAuth: false });
		} catch (error) {
			set({ checkingAuth: false, user: null });
		}
	},
}));
