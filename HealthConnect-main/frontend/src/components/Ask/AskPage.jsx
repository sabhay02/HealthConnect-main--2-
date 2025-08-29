import { PlusCircle, Reply, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuestionStore } from "../../store/useQuestionStore.jsx";
import { useUserStore } from "../../store/useUserStore.jsx";

const AskPage = () => {
	const { user } = useUserStore();
	const role = user.userType;

	const { questions, fetchQuestions, addQuestion, answerQuestion, deleteQuestion, loading, error } = useQuestionStore();

	const [newQuestion, setNewQuestion] = useState("");
	const [replyingId, setReplyingId] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	// fetch questions on mount
	useEffect(() => {
		fetchQuestions();
	}, [fetchQuestions]);

	const handleAddQuestion = () => {
		addQuestion(newQuestion);
		setNewQuestion("");
	};

	const handleReplySave = (id) => {
		answerQuestion(id, replyText);
		setReplyingId(null);
		setReplyText("");
	};

	// Filter questions by search
	const filteredQuestions = questions.filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold text-blue-600 mb-2">Ask & Answer</h1>

			{/* Show current role for testing */}
			<p className="text-gray-500 mb-6">
				<strong>Current role:</strong> {role || "Not logged in"}
			</p>

			{/* Search bar */}
			<div className="relative mb-6">
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search questions..."
					className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
				/>
				<Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
			</div>

			{(role === "adult" || role === "adolescent") && (
				<div className="mb-6">
					<textarea
						value={newQuestion}
						onChange={(e) => setNewQuestion(e.target.value)}
						placeholder="Type your question..."
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
						rows={3}
					/>
					<button
						onClick={handleAddQuestion}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<PlusCircle className="h-4 w-4 mr-2" />
						Add Question
					</button>
				</div>
			)}

			{loading && <p className="text-gray-500">Loading questions...</p>}
			{error && <p className="text-red-500">{error}</p>}

			<div className="space-y-4">
				{filteredQuestions.length === 0 && !loading && <p className="text-gray-400 italic">No matching questions found.</p>}

				{filteredQuestions.map((q) => (
					<div
						key={q._id}
						className="p-4 border rounded-lg shadow-sm bg-white"
					>
						<div className="flex justify-between items-start">
							<p className="font-medium text-blue-700">{q.question}</p>

							{/* Only Admin (or moderator) can delete */}
							{role === "admin" && (
								<button
									onClick={() => deleteQuestion(q._id)}
									className="text-red-500 hover:text-red-700"
								>
									<Trash2 className="h-5 w-5" />
								</button>
							)}
						</div>

						{q.answer ? <p className="mt-2 text-gray-700">{q.answer}</p> : <p className="mt-2 text-gray-400 italic">No answer yet.</p>}

						{role === "health_prof" && !q.answer && (
							<>
								{replyingId === q._id ? (
									<div className="mt-3">
										<textarea
											value={replyText}
											onChange={(e) => setReplyText(e.target.value)}
											placeholder="Type your reply..."
											className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
											rows={2}
										/>
										<button
											onClick={() => handleReplySave(q._id)}
											className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
										>
											Submit
										</button>
										<button
											onClick={() => {
												setReplyingId(null);
												setReplyText("");
											}}
											className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
										>
											Cancel
										</button>
									</div>
								) : (
									<button
										onClick={() => setReplyingId(q._id)}
										className="mt-3 flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
									>
										<Reply className="h-4 w-4 mr-2" />
										Reply
									</button>
								)}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default AskPage;
