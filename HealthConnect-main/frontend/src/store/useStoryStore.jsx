import { create } from "zustand";
import axios from "../api/axios.js";

export const useStoryStore = create((set, get) => ({
	stories: [],
	loading: false,
	error: null,
	submitting: false,

	fetchStories: async () => {
		set({ loading: true, error: null });
		try {
			const res = await axios.get("/stories/");
			set({ stories: res.data, loading: false });
		} catch (err) {
			set({ error: err.response?.data?.message || "Failed to fetch stories", loading: false });
		}
	},

	createStory: async ({ title, content, category }) => {
		set({ submitting: true, error: null });
		try {
			const res = await axios.post("/stories/", { title, content, category });
			set((state) => ({ stories: [res.data, ...state.stories], submitting: false }));
			return { success: true, data: res.data };
		} catch (err) {
			const errorMsg = err.response?.data?.message || "Failed to create story";
			set({ error: errorMsg, submitting: false });
			throw new Error(errorMsg);
		}
	},

	toggleLike: async (storyId) => {
		try {
			const res = await axios.post(`/stories/${storyId}/like`);
			const { liked, likeCount } = res.data.data;
			const currentUserId = get().currentUserId;
			set((state) => ({
				stories: state.stories.map((story) =>
					story._id === storyId
						? {
								...story,
								likes: liked ? [...(story.likes || []), { user: currentUserId, likedAt: new Date() }] : (story.likes || []).filter((like) => like.user !== currentUserId && (like.user._id || like.user) !== currentUserId),
						  }
						: story
				),
			}));
			return { liked, likeCount };
		} catch (err) {
			const errorMsg = err.response?.data?.message || "Failed to toggle like";
			set({ error: errorMsg });
			console.error("Toggle like error:", err.response?.data);
			throw err;
		}
	},

	addComment: async (storyId, content) => {
		try {
			const res = await axios.post(`/stories/${storyId}/comments`, { content });
			set((state) => ({
				stories: state.stories.map((story) => (story._id === storyId ? { ...story, comments: [...(story.comments || []), res.data.data] } : story)),
			}));
			return res.data.data;
		} catch (err) {
			const errorMsg = err.response?.data?.message || "Failed to add comment";
			set({ error: errorMsg });
			console.error("Add comment error:", err.response?.data);
			throw err;
		}
	},

	setCurrentUser: (userId) => set({ currentUserId: userId }),
	clearError: () => set({ error: null }),
	clearStories: () => set({ stories: [], error: null, loading: false, submitting: false }),
}));
