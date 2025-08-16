import React, { useState, useEffect } from 'react';
import { RotateCcw, Star, Timer, Trophy } from 'lucide-react';

interface MemoryGameProps {
  onComplete: (score: number) => void;
}

interface Card {
  id: number;
  symbol: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const indonesianSymbols = [
  { symbol: '🇮🇩', name: 'Indonesian Flag' },
  { symbol: '🦅', name: 'Garuda' },
  { symbol: '🌺', name: 'Jasmine Flower' },
  { symbol: '🏛️', name: 'Temple' },
  { symbol: '🥥', name: 'Coconut' },
  { symbol: '🏔️', name: 'Mountain' },
  { symbol: '🏝️', name: 'Island' },
  { symbol: '🎭', name: 'Traditional Mask' },
];

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !isGameComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isGameComplete]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (matches === indonesianSymbols.length && !isGameComplete) {
      setIsGameComplete(true);
      const score = Math.max(0, 500 - moves * 5 - timeElapsed * 2);
      setTimeout(() => onComplete(score), 1000);
    }
  }, [matches, isGameComplete, moves, timeElapsed, onComplete]);

  const initializeGame = () => {
    const gameCards: Card[] = [];
    let id = 0;

    // Create pairs
    indonesianSymbols.forEach(item => {
      gameCards.push(
        {
          id: id++,
          symbol: item.symbol,
          name: item.name,
          isFlipped: false,
          isMatched: false,
        },
        {
          id: id++,
          symbol: item.symbol,
          name: item.name,
          isFlipped: false,
          isMatched: false,
        }
      );
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimeElapsed(0);
    setIsGameComplete(false);
    setGameStarted(true);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Indonesian Memory Match</h2>
        <p className="text-red-100">
          Match pairs of Indonesian cultural symbols!
        </p>
        
        {/* Game Stats */}
        <div className="flex justify-center space-x-6 mt-6">
          <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Timer className="w-5 h-5 text-white" />
            <span className="text-white font-bold">{formatTime(timeElapsed)}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-white font-bold">Moves: {moves}</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">Matches: {matches}/{indonesianSymbols.length}</span>
          </div>
          <button
            onClick={initializeGame}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-white" />
            <span className="text-white">Reset</span>
          </button>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl cursor-pointer transition-all duration-500 transform hover:scale-105 ${
              card.isFlipped || card.isMatched
                ? 'bg-white shadow-lg'
                : 'bg-red-600 hover:bg-red-700 shadow-md'
            }`}
            style={{
              transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-full h-full rounded-xl flex flex-col items-center justify-center p-2">
              {card.isFlipped || card.isMatched ? (
                <>
                  <div className="text-4xl mb-2">{card.symbol}</div>
                  <div className="text-xs text-center text-gray-700 font-semibold">
                    {card.name}
                  </div>
                </>
              ) : (
                <div className="text-white text-2xl font-bold">?</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${(matches / indonesianSymbols.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Success Message */}
      {isGameComplete && (
        <div className="text-center">
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500 rounded-2xl p-8 inline-block">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Hebat! (Great!)</h3>
            <p className="text-green-100">
              You completed the memory game in {moves} moves and {formatTime(timeElapsed)}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;