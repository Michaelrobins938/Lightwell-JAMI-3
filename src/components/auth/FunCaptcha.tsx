import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, CheckCircle, XCircle, RefreshCw, Sparkles } from 'lucide-react';

interface FunCaptchaProps {
  onComplete: (success: boolean) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface PuzzleData {
  type: 'sequence' | 'pattern' | 'math' | 'color' | 'emoji';
  question: string;
  answer: string | number;
  options?: (string | number)[];
  hint?: string;
}

export default function FunCaptcha({ onComplete, difficulty = 'easy' }: FunCaptchaProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleData | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  // Puzzle database
  const puzzles: Record<string, PuzzleData[]> = {
    easy: [
      {
        type: 'sequence',
        question: 'What comes next? 🌟 🌙 ⭐ 🌟 🌙 ?',
        answer: '⭐',
        hint: 'Look at the pattern carefully...'
      },
      {
        type: 'math',
        question: 'What is 7 + 3 × 2?',
        answer: 13,
        options: [10, 13, 20, 17],
        hint: 'Remember the order of operations!'
      },
      {
        type: 'color',
        question: 'What color do you get when you mix blue and yellow?',
        answer: 'green',
        options: ['purple', 'green', 'orange', 'brown'],
        hint: 'Think about mixing paint colors...'
      },
      {
        type: 'emoji',
        question: 'Complete the pattern: 😊 😢 😊 😢 😊 ?',
        answer: '😢',
        hint: 'It alternates between two emotions...'
      }
    ],
    medium: [
      {
        type: 'sequence',
        question: 'What comes next? 2, 4, 8, 16, ?',
        answer: 32,
        hint: 'Each number is multiplied by 2'
      },
      {
        type: 'pattern',
        question: 'Find the missing letter: A, C, E, G, ?',
        answer: 'I',
        hint: 'Skip one letter each time'
      },
      {
        type: 'math',
        question: 'What is the sum of the first 5 even numbers?',
        answer: 30,
        options: [20, 25, 30, 35],
        hint: '2 + 4 + 6 + 8 + 10 = ?'
      }
    ],
    hard: [
      {
        type: 'sequence',
        question: 'What comes next? 1, 1, 2, 3, 5, 8, ?',
        answer: 13,
        hint: 'Each number is the sum of the previous two'
      },
      {
        type: 'pattern',
        question: 'What letter comes next? Z, Y, X, W, V, ?',
        answer: 'U',
        hint: 'Going backwards through the alphabet'
      },
      {
        type: 'math',
        question: 'What is 15% of 200?',
        answer: 30,
        options: [25, 30, 35, 40],
        hint: '15% = 0.15, so 0.15 × 200 = ?'
      }
    ]
  };

  const getRandomPuzzle = useCallback(() => {
    const difficultyPuzzles = puzzles[difficulty];
    const randomIndex = Math.floor(Math.random() * difficultyPuzzles.length);
    return difficultyPuzzles[randomIndex];
  }, [difficulty]);

  const generateNewPuzzle = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const newPuzzle = getRandomPuzzle();
      setCurrentPuzzle(newPuzzle);
      setUserAnswer('');
      setIsCorrect(null);
      setShowHint(false);
      setTimeLeft(60);
      setIsLoading(false);
    }, 500);
  }, [getRandomPuzzle]);

  useEffect(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  const handleSubmit = (answer?: string) => {
    const submittedAnswer = answer || userAnswer;
    if (!currentPuzzle) return;

    let correct = false;
    
    if (currentPuzzle.type === 'math') {
      correct = Number(submittedAnswer) === currentPuzzle.answer;
    } else {
      correct = submittedAnswer.toLowerCase() === currentPuzzle.answer.toString().toLowerCase();
    }

    setIsCorrect(correct);
    setAttempts(attempts + 1);

    if (correct) {
      setTimeout(() => {
        onComplete(true);
      }, 1000);
    } else if (attempts >= 2) {
      setTimeout(() => {
        onComplete(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isCorrect) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCorrect) {
      handleSubmit('timeout');
    }
  }, [timeLeft, isCorrect]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  if (!currentPuzzle) return null;

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Puzzle className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Fun Puzzle Challenge</h3>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-slate-400 text-sm">
          Solve this puzzle to continue
        </p>
      </div>

      {/* Timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Time left:</span>
          <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 60) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Puzzle */}
      <div className="mb-6">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          <p className="text-white text-lg text-center font-medium">
            {currentPuzzle.question}
          </p>
        </div>

        {/* Answer Input */}
        {currentPuzzle.options ? (
          <div className="grid grid-cols-2 gap-3">
            {currentPuzzle.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(option.toString())}
                className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer..."
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSubmit()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-1"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>

      {/* Hint */}
      {currentPuzzle.hint && (
        <div className="mb-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-2 mx-auto"
          >
            <span>{showHint ? 'Hide' : 'Show'} Hint</span>
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg"
              >
                <p className="text-purple-300 text-sm text-center">
                  💡 {currentPuzzle.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center p-4 rounded-xl ${
              isCorrect 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <span className={`font-medium ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Correct!' : 'Try Again'}
              </span>
            </div>
            {!isCorrect && attempts < 3 && (
              <p className="text-slate-400 text-sm">
                Attempts: {attempts}/3
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Puzzle Button */}
      {!isCorrect && attempts > 0 && (
        <div className="text-center mt-4">
          <button
            onClick={generateNewPuzzle}
            className="text-slate-400 hover:text-white text-sm flex items-center space-x-2 mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try a different puzzle</span>
          </button>
        </div>
      )}
    </div>
  );
}
