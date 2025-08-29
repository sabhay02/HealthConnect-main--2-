import Story from "../models/Story.js";
// Create Story
export const createStory = async (req, res) => {
	try {
		const { title, content, category } = req.body;

		const story = await Story.create({
			author: req.user.id,
			title,
			content,
			category,
		});

		await story.populate("author", "name userType");
		res.status(201).json({ success: true, data: story });
	} catch (err) {
		res.status(500).json({ success: false, message: "Could not create story" });
	}
};

// Get Stories
export const getStories = async (req, res) => {
	try {
		const stories = await Story.find();
		res.status(200).json(stories);
	} catch (err) {
		res.status(500).json({ message: "Failed to fetch stories", error: err.message });
	}
};

// Get Single Story
export const getStoryById = async (req, res) => {
	try {
		const story = await Story.findOne({
			_id: req.params.id,
		})
			.populate("author", "name userType")
			.populate("comments.user", "name userType");

		if (!story) return res.status(404).json({ success: false, message: "Story not found" });

		res.json({ success: true, data: story });
	} catch (err) {
		res.status(500).json({ success: false, message: "Could not fetch story" });
	}
};

// Like / Unlike Storye
export const toggleLikeStory = async (req, res) => {
	try {
		const story = await Story.findById(req.params.id);
		if (!story) return res.status(404).json({ success: false, message: "Story not found" });

		const likedIndex = story.likes.findIndex((like) => like.user.toString() === req.user.id);

		if (likedIndex !== -1) {
			story.likes.splice(likedIndex, 1);
		} else {
			story.likes.push({ user: req.user.id });
		}

		await story.save();

		res.json({
			success: true,
			data: {
				liked: likedIndex === -1,
				likeCount: story.likes.length,
			},
		});
	} catch (err) {
		res.status(500).json({ success: false, message: "Could not toggle like" });
	}
};

// Add Comment
export const addComment = async (req, res) => {
	try {
		const { content } = req.body;

		const story = await Story.findById(req.params.id);
		if (!story) return res.status(404).json({ success: false, message: "Story not found" });

		const comment = {
			user: req.user.id,
			content: content,
		};

		story.comments.push(comment);
		await story.save();

		const newComment = story.comments[story.comments.length - 1];

		res.status(201).json({ success: true, data: newComment });
	} catch (err) {
		res.status(500).json({ success: false, message: "Could not add comment" });
	}
};

// Get My Stories
export const getMyStories = async (req, res) => {
	try {
		const stories = await Story.find({ author: req.user.id }).populate("author").sort({ createdAt: -1 });

		res.json({ success: true, data: stories });
	} catch (err) {
		res.status(500).json({ success: false, message: "Could not fetch your stories" });
	}
};
