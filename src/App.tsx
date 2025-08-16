import { Flag, Home, Trophy } from 'lucide-react';
import { useState } from 'react';
import Confetti from './components/Confetti';
import FlagPuzzle from './components/FlagPuzzle';
import HomePage from './components/HomePage';
import MemoryGame from './components/MemoryGame';
import TriviaQuiz from './components/TriviaQuiz';

type GameType = 'home' | 'puzzle' | 'trivia' | 'memory';

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('home');
  const [showConfetti, setShowConfetti] = useState(false);
  const [scores, setScores] = useState({
    puzzle: 0,
    trivia: 0,
    memory: 0,
  });

  const handleGameComplete = (game: keyof typeof scores, score: number) => {
    setScores(prev => ({
      ...prev,
      [game]: Math.max(prev[game], score)
    }));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'puzzle':
        return <FlagPuzzle onComplete={(score) => handleGameComplete('puzzle', score)} />;
      case 'trivia':
        return <TriviaQuiz onComplete={(score) => handleGameComplete('trivia', score)} />;
      case 'memory':
        return <MemoryGame onComplete={(score) => handleGameComplete('memory', score)} />;
      default:
        return <HomePage onGameSelect={setCurrentGame} scores={scores} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-white">
      {showConfetti && <Confetti />}

      {/* Navigation */}
      {currentGame !== 'home' && (
        <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setCurrentGame('home')}
                className="flex items-center space-x-2 text-white hover:text-red-100 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-semibold">Home</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-white">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">
                    {scores.puzzle + scores.trivia + scores.memory}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-white">
                  <Flag className="w-5 h-5" />
                  <span className="text-sm">Merdeka!</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {renderGame()}
      </main>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Flag className="w-5 h-5" />
            <span className="font-bold">Dirgahayu Indonesia ke-80</span>
            <Flag className="w-5 h-5" />
          </div>
          <p className="text-red-200 text-sm">
            Celebrating Indonesia's Independence Day - August 17, 1945
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;