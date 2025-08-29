import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173, // Vite frontend server
		proxy: {
			"/api": {
				target: "http://localhost:4000", // your backend server
				changeOrigin: true,
				secure: false,
			},
		},
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
});
