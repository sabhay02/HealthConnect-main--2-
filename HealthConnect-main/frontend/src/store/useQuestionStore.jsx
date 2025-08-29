import { create } from "zustand";
import axios from "../api/axios.js"; // your axios instance

export const useQuestionStore = create((set, get) => ({
	questions: [],
	loading: false,
	error: null,

	// Fetch all questions
	fetchQuestions: async () => {
		set({ loading: true, error: null });
		try {
			const res = await axios.get("/questions");
			set({ questions: res.data, loading: false });
		} catch (err) {
			set({ error: err.response?.data?.message || err.message, loading: false });
		}
	},

	// Add a new question
	addQuestion: async (questionText) => {
		if (!questionText.trim()) return;
		try {
			const res = await axios.post("/questions", { question: questionText });
			set({ questions: [...get().questions, res.data] });
		} catch (err) {
			set({ error: err.response?.data?.message || err.message });
		}
	},

	// Answer a question
	answerQuestion: async (id, answerText) => {
		try {
			const res = await axios.put(`/questions/${id}/answer`, { answer: answerText });
			set({
				questions: get().questions.map((q) => (q._id === id ? res.data : q)),
			});
		} catch (err) {
			set({ error: err.response?.data?.message || err.message });
		}
	},

	// Delete a question
	deleteQuestion: async (id) => {
		try {
			await axios.delete(`/questions/${id}`);
			set({ questions: get().questions.filter((q) => q._id !== id) });
		} catch (err) {
			set({ error: err.response?.data?.message || err.message });
		}
	},
}));
