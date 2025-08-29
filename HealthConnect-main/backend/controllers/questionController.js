import Question from "../models/Question.js";

// @desc  Ask a new question (Adult/Adolescent)
// @route POST /api/questions
export const askQuestion = async (req, res) => {
	try {
		const { question } = req.body;
		if (!question) return res.status(400).json({ message: "Question text is required" });

		const newQ = await Question.create({ question });
		res.status(201).json(newQ);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// @desc  Get all questions
// @route GET /api/questions
export const getQuestions = async (req, res) => {
	try {
		const questions = await Question.find().sort({ askedAt: -1 });
		res.json(questions);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// @desc  Answer a question (Doctor only)
// @route PUT /api/questions/:id/answer
export const answerQuestion = async (req, res) => {
	try {
		const { id } = req.params;
		const { answer } = req.body;

		const question = await Question.findById(id);
		if (!question) return res.status(404).json({ message: "Question not found" });

		question.answer = answer;
		question.answeredAt = new Date();
		await question.save();

		res.json(question);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// @desc  Delete a question (optional — Admin/Moderator only)
// @route DELETE /api/questions/:id
export const deleteQuestion = async (req, res) => {
	try {
		const { id } = req.params;
		const question = await Question.findByIdAndDelete(id);

		if (!question) return res.status(404).json({ message: "Question not found" });

		res.json({ message: "Question deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
