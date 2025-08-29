import React, { useState } from 'react';
import { RotateCcw, Check, X } from 'lucide-react';

const MythFactCards = () => {
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [answeredCards, setAnsweredCards] = useState(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const mythsFacts = [
    {
      id: '1',
      statement: 'You can get pregnant from your first time having sex',
      isFact: true,
      explanation: 'Yes, pregnancy can occur during first sexual intercourse if no contraception is used. The timing in a menstrual cycle and ovulation are key factors, regardless of whether it\'s your first time or not.',
      category: 'Pregnancy'
    },
    {
      id: '2',
      statement: 'Masturbation causes blindness or hairy palms',
      isFact: false,
      explanation: 'This is completely false. Masturbation is a normal, healthy sexual activity that has no negative physical effects. These myths were created to discourage the practice but have no scientific basis.',
      category: 'Sexual Health'
    },
    {
      id: '3',
      statement: 'You cannot get STIs from oral sex',
      isFact: false,
      explanation: 'This is false. Many STIs can be transmitted through oral sex, including herpes, gonorrhea, chlamydia, syphilis, and HIV. Using barrier methods like condoms or dental dams during oral sex reduces this risk.',
      category: 'STI Prevention'
    },
    {
      id: '4',
      statement: 'Birth control pills are 99% effective when used correctly',
      isFact: true,
      explanation: 'When taken correctly and consistently, birth control pills are over 99% effective at preventing pregnancy. However, typical use (accounting for missed pills) reduces effectiveness to about 91%.',
      category: 'Contraception'
    },
    {
      id: '5',
      statement: 'Pulling out (withdrawal) is an effective form of birth control',
      isFact: false,
      explanation: 'Withdrawal has a high failure rate - about 22% with typical use. Pre-ejaculatory fluid can contain sperm, and perfect timing is difficult to achieve. More reliable contraceptive methods are recommended.',
      category: 'Contraception'
    },
    {
      id: '6',
      statement: 'Regular STI testing is important even if you have no symptoms',
      isFact: true,
      explanation: 'Many STIs can be asymptomatic, meaning you can have an infection without knowing it. Regular testing helps detect and treat infections early, preventing complications and transmission to partners.',
      category: 'STI Prevention'
    }
  ];

  const handleGuess = (cardId, guess) => {
    const card = mythsFacts.find(mf => mf.id === cardId);
    if (!card) return;

    setFlippedCards(prev => new Set(prev).add(cardId));
    setAnsweredCards(prev => new Set(prev).add(cardId));
    
    if (guess === card.isFact) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const resetQuiz = () => {
    setFlippedCards(new Set());
    setAnsweredCards(new Set());
    setCorrectAnswers(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Myths vs Facts</h2>
          <p className="text-gray-600 mt-2">Test your knowledge about sexual health</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Score: {correctAnswers}/{answeredCards.size}
          </div>
          <button
            onClick={resetQuiz}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mythsFacts.map((item) => {
          const isFlipped = flippedCards.has(item.id);
          const isAnswered = answeredCards.has(item.id);
          const isCorrect = isAnswered && item.isFact;

          return (
            <div key={item.id} className="relative h-64">
              <div className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}>
                
                {/* Front of Card */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                        {item.category}
                      </span>
                      <p className="text-lg font-medium text-gray-900 mb-6">
                        {item.statement}
                      </p>
                    </div>
                    
                    {!isAnswered && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleGuess(item.id, true)}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Fact
                        </button>
                        <button
                          onClick={() => handleGuess(item.id, false)}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Myth
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isFact 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isFact ? 'FACT' : 'MYTH'}
                      </span>
                      <div className={`p-1 rounded-full ${
                        isCorrect 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-3">
                        {item.statement}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {answeredCards.size === mythsFacts.length && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
          <p className="text-gray-600 mb-4">
            You scored {correctAnswers} out of {mythsFacts.length} ({Math.round((correctAnswers / mythsFacts.length) * 100)}%)
          </p>
          <button
            onClick={resetQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MythFactCards;
