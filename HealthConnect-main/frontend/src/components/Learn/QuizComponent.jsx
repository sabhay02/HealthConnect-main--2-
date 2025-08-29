import React, { useState } from 'react';
import { Check, X, RotateCcw, Award } from 'lucide-react';

const QuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = [
    {
      id: '1',
      question: 'What is the most effective way to prevent sexually transmitted infections (STIs)?',
      options: [
        'Birth control pills',
        'Proper use of condoms',
        'Withdrawal method',
        'Douching after sex'
      ],
      correctAnswer: 1,
      explanation: 'Condoms, when used correctly and consistently, are the most effective method for preventing most STIs while also providing contraception.',
      category: 'STI Prevention'
    },
    {
      id: '2',
      question: 'At what age does puberty typically begin?',
      options: [
        '8-13 years',
        '15-18 years',
        '10-14 years',
        '12-16 years'
      ],
      correctAnswer: 0,
      explanation: 'Puberty typically begins between ages 8-13, though this can vary widely between individuals. Girls often start slightly earlier than boys.',
      category: 'Puberty'
    },
    {
      id: '3',
      question: 'Which of the following is true about consent?',
      options: [
        'It can be given once for all future encounters',
        'It can be withdrawn at any time',
        'It\'s not needed in established relationships',
        'It\'s only required for the first sexual encounter'
      ],
      correctAnswer: 1,
      explanation: 'Consent must be freely given for each encounter and can be withdrawn at any time by any party involved.',
      category: 'Consent'
    },
    {
      id: '4',
      question: 'How effective are birth control pills when used correctly?',
      options: [
        '85% effective',
        '91% effective',
        'Over 99% effective',
        '75% effective'
      ],
      correctAnswer: 2,
      explanation: 'When taken correctly and consistently, birth control pills are over 99% effective at preventing pregnancy.',
      category: 'Contraception'
    },
    {
      id: '5',
      question: 'Which statement about STI testing is correct?',
      options: [
        'You only need testing if you have symptoms',
        'Testing is only for people with multiple partners',
        'Regular testing is important even without symptoms',
        'Testing is unnecessary if using condoms'
      ],
      correctAnswer: 2,
      explanation: 'Many STIs can be asymptomatic, so regular testing is important regardless of symptoms or relationship status.',
      category: 'STI Prevention'
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
        <Award className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
        <div className="mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</div>
          <p className="text-gray-600">You scored {score} out of {questions.length} questions correctly</p>
        </div>
        
        <div className="mb-6">
          {percentage >= 80 ? (
            <p className="text-green-600 font-medium">Excellent work! You have a strong understanding of sexual health topics.</p>
          ) : percentage >= 60 ? (
            <p className="text-yellow-600 font-medium">Good job! Consider reviewing the topics you missed.</p>
          ) : (
            <p className="text-red-600 font-medium">Keep learning! Review the educational materials and try again.</p>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {questions.map((question, index) => (
            <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Question {index + 1}</span>
              <div className="flex items-center">
                {answers[index] === question.correctAnswer ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={resetQuiz}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Take Quiz Again
        </button>
      </div>
    );
  }

  const current = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="mb-6">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
            {current.category}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {current.question}
          </h2>
        </div>

        {!showResult ? (
          <div className="space-y-3 mb-8">
            {current.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-8">
            <div className={`p-4 rounded-lg mb-4 ${
              selectedAnswer === current.correctAnswer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                {selectedAnswer === current.correctAnswer ? (
                  <>
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-medium text-red-800">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700">
                The correct answer is: <strong>{current.options[current.correctAnswer]}</strong>
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
              <p className="text-sm text-blue-800">{current.explanation}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
