import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
	question: {
		type: String,
		required: true,
		trim: true,
	},
	answer: {
		type: String,
		default: "",
	},
	askedAt: {
		type: Date,
		default: Date.now,
	},
	answeredAt: {
		type: Date,
	},
});

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
