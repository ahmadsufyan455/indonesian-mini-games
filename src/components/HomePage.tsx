import React from 'react';
import { Puzzle, Brain, Gamepad2, Star, Trophy, Calendar } from 'lucide-react';

interface HomePageProps {
  onGameSelect: (game: 'puzzle' | 'trivia' | 'memory') => void;
  scores: {
    puzzle: number;
    trivia: number;
    memory: number;
  };
}

const HomePage: React.FC<HomePageProps> = ({ onGameSelect, scores }) => {
  const games = [
    {
      id: 'puzzle' as const,
      title: 'Flag Puzzle',
      description: 'Complete the Indonesian flag puzzle',
      icon: Puzzle,
      color: 'bg-red-600 hover:bg-red-700',
      score: scores.puzzle,
    },
    {
      id: 'trivia' as const,
      title: 'Indonesia Trivia',
      description: 'Test your knowledge about Indonesia',
      icon: Brain,
      color: 'bg-white hover:bg-gray-100 text-red-600',
      score: scores.trivia,
    },
    {
      id: 'memory' as const,
      title: 'Memory Match',
      description: 'Match Indonesian cultural symbols',
      icon: Gamepad2,
      color: 'bg-red-600 hover:bg-red-700',
      score: scores.memory,
    },
  ];

  const totalScore = scores.puzzle + scores.trivia + scores.memory;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Calendar className="w-8 h-8 text-white" />
          <h1 className="text-5xl font-bold text-white">17 Agustus</h1>
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Hari Kemerdekaan Indonesia
        </h2>
        <p className="text-xl text-red-100 max-w-2xl mx-auto">
          Celebrate Indonesia's Independence Day with fun mini-games! 
          Test your knowledge and skills while honoring our nation's history.
        </p>
        
        {/* Indonesian Flag Animation */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-32 h-20 border-4 border-white rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
          </div>
        </div>

        {/* Total Score Display */}
        {totalScore > 0 && (
          <div className="mt-6 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <span className="text-white font-bold text-lg">
              Total Score: {totalScore}
            </span>
            <Star className="w-6 h-6 text-yellow-300" />
          </div>
        )}
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`${game.color} p-4 rounded-full transition-colors`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-red-100 mb-6">{game.description}</p>
                
                {game.score > 0 && (
                  <div className="flex items-center justify-center space-x-2 mb-4 text-yellow-300">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">Best: {game.score}</span>
                  </div>
                )}
                
                <button
                  onClick={() => onGameSelect(game.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Play Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          About Indonesia's Independence Day
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Historical Significance</h4>
            <p className="text-red-100">
              On August 17, 1945, Indonesia proclaimed its independence from Dutch colonial rule, 
              marking the birth of the Republic of Indonesia. This day is celebrated annually 
              with great pride and patriotism.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">National Symbols</h4>
            <p className="text-red-100">
              The Indonesian flag, known as "Sang Saka Merah Putih" (The Sacred Red and White), 
              features two horizontal stripes - red symbolizing courage and white representing purity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;