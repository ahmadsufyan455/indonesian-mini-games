import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';

interface TriviaQuizProps {
  onComplete: (score: number) => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "When did Indonesia declare its independence?",
    options: ["August 17, 1945", "August 17, 1944", "July 17, 1945", "September 17, 1945"],
    correctAnswer: 0,
    explanation: "Indonesia proclaimed its independence on August 17, 1945, by Sukarno and Mohammad Hatta."
  },
  {
    question: "What are the colors of the Indonesian flag?",
    options: ["Blue and White", "Red and White", "Green and White", "Yellow and Red"],
    correctAnswer: 1,
    explanation: "The Indonesian flag consists of two horizontal stripes: red on top and white on bottom."
  },
  {
    question: "What is the capital city of Indonesia?",
    options: ["Surabaya", "Bandung", "Jakarta", "Medan"],
    correctAnswer: 2,
    explanation: "Jakarta is the capital and largest city of Indonesia."
  },
  {
    question: "Who was Indonesia's first president?",
    options: ["Suharto", "Sukarno", "B.J. Habibie", "Megawati"],
    correctAnswer: 1,
    explanation: "Sukarno was Indonesia's first president and proclaimed the country's independence."
  },
  {
    question: "What is Indonesia's national motto?",
    options: ["Merdeka", "Bhinneka Tunggal Ika", "Pancasila", "Garuda Pancasila"],
    correctAnswer: 1,
    explanation: "Bhinneka Tunggal Ika means 'Unity in Diversity' and reflects Indonesia's multicultural society."
  },
  {
    question: "How many islands does Indonesia have approximately?",
    options: ["10,000", "17,500", "25,000", "30,000"],
    correctAnswer: 1,
    explanation: "Indonesia is an archipelago consisting of approximately 17,500 islands."
  },
  {
    question: "What is the traditional Indonesian greeting?",
    options: ["Namaste", "Selamat", "Halo", "Salamualaikum"],
    correctAnswer: 1,
    explanation: "Selamat is used in various greetings like 'Selamat pagi' (good morning)."
  },
  {
    question: "Which mountain is the highest in Indonesia?",
    options: ["Mount Merapi", "Puncak Jaya", "Mount Bromo", "Mount Rinjani"],
    correctAnswer: 1,
    explanation: "Puncak Jaya in Papua is Indonesia's highest mountain at 4,884 meters."
  }
];

const TriviaQuiz: React.FC<TriviaQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showResult && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleNextQuestion();
    }
  }, [timeLeft, showResult, selectedAnswer]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 10 + timeLeft); // Bonus points for quick answers
    }
    
    setAnsweredQuestions(prev => {
      const newArray = [...prev];
      newArray[currentQuestion] = true;
      return newArray;
    });

    setTimeout(handleNextQuestion, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
      setShowResult(false);
    } else {
      // Quiz completed
      setTimeout(() => onComplete(score), 1000);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(15);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  const question = questions[currentQuestion];
  const isComplete = currentQuestion >= questions.length;

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <Award className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h2>
          <p className="text-xl text-red-100 mb-6">
            Your final score: <span className="font-bold text-yellow-300">{score} points</span>
          </p>
          <div className="mb-6">
            <p className="text-red-100">
              You answered {answeredQuestions.filter(Boolean).length} out of {questions.length} questions correctly!
            </p>
          </div>
          <button
            onClick={resetQuiz}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Indonesia Trivia Quiz</h2>
        <p className="text-red-100">Test your knowledge about Indonesia!</p>
        
        {/* Progress and Stats */}
        <div className="flex justify-center space-x-6 mt-6">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-white font-bold">Question {currentQuestion + 1}/{questions.length}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Clock className="w-5 h-5 text-white" />
            <span className="text-white font-bold">{timeLeft}s</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-white font-bold">Score: {score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          {question.question}
        </h3>
        
        <div className="space-y-4">
          {question.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
            
            if (selectedAnswer === null) {
              buttonClass += "border-white/30 bg-white/10 hover:bg-white/20 text-white hover:border-white/50";
            } else if (index === question.correctAnswer) {
              buttonClass += "border-green-500 bg-green-500/20 text-green-100";
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              buttonClass += "border-red-500 bg-red-500/20 text-red-100";
            } else {
              buttonClass += "border-white/20 bg-white/5 text-white/60";
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{option}</span>
                  {selectedAnswer !== null && (
                    <>
                      {index === question.correctAnswer && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                      {index === selectedAnswer && index !== question.correctAnswer && (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {selectedAnswer !== null && (
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-100 text-sm">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaQuiz;