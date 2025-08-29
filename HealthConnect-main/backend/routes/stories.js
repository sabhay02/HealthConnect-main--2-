import express from "express";
import { addComment, createStory, getMyStories, getStories, getStoryById, toggleLikeStory } from "../controllers/storyController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Stories
router.post("/", protectRoute, createStory);
router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/:id/like", protectRoute, toggleLikeStory);
router.post("/:id/comments", protectRoute, addComment);
router.get("/my/posts", protectRoute, getMyStories);

export default router;
