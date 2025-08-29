import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxLength: 100,
		},
		content: {
			type: String,
			required: true,
			trim: true,
			maxLength: 5000,
		},
		category: {
			type: String,
			required: true,
			enum: ["personal_story", "advice", "educational", "support", "awareness"],
		},
		likes: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				likedAt: { type: Date, default: Date.now },
			},
		],
		comments: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
				content: { type: String, required: true, trim: true, maxLength: 500 },
				isAnonymous: { type: Boolean, default: false },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);
export default mongoose.model("Story", storySchema);
