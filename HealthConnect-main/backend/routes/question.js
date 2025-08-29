import express from "express";
import { answerQuestion, askQuestion, deleteQuestion, getQuestions } from "../controllers/questionController.js";

const router = express.Router();

// Public: Anyone (adult/adolescent) can ask
router.post("/", askQuestion);

// Public: Fetch all questions
router.get("/", getQuestions);

// Expert: Answer a question
router.put("/:id/answer", answerQuestion);

// Admin/Moderator: Delete a question
router.delete("/:id", deleteQuestion);

export default router;
