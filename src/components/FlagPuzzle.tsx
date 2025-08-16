import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, Timer } from 'lucide-react';

interface FlagPuzzleProps {
  onComplete: (score: number) => void;
}

type PiecePosition = {
  id: number;
  isRed: boolean;
  isPlaced: boolean;
  correctPosition: number;
};

const FlagPuzzle: React.FC<FlagPuzzleProps> = ({ onComplete }) => {
  const [pieces, setPieces] = useState<PiecePosition[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize puzzle pieces
  useEffect(() => {
    const initialPieces: PiecePosition[] = [];
    for (let i = 0; i < 12; i++) {
      initialPieces.push({
        id: i,
        isRed: i < 6, // First 6 pieces are red (top half)
        isPlaced: false,
        correctPosition: i,
      });
    }
    // Shuffle pieces
    const shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isComplete) {
      // Time's up
      const score = Math.max(0, 100 - moves - (60 - timeLeft));
      onComplete(score);
    }
  }, [timeLeft, isComplete, moves, onComplete]);

  const handleDragStart = (pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleDrop = (position: number) => {
    if (draggedPiece === null) return;

    const draggedPieceData = pieces.find(p => p.id === draggedPiece);
    if (!draggedPieceData) return;

    // Check if this is the correct position
    if (draggedPieceData.correctPosition === position) {
      setPieces(prevPieces =>
        prevPieces.map(piece =>
          piece.id === draggedPiece
            ? { ...piece, isPlaced: true }
            : piece
        )
      );
    }

    setMoves(prev => prev + 1);
    setDraggedPiece(null);

    // Check if puzzle is complete
    const updatedPieces = pieces.map(piece =>
      piece.id === draggedPiece && draggedPieceData.correctPosition === position
        ? { ...piece, isPlaced: true }
        : piece
    );

    if (updatedPieces.every(piece => piece.isPlaced)) {
      setIsComplete(true);
      const score = Math.max(0, 200 - moves - (60 - timeLeft));
      setTimeout(() => onComplete(score), 1000);
    }
  };

  const resetPuzzle = () => {
    const initialPieces: PiecePosition[] = [];
    for (let i = 0; i < 12; i++) {
      initialPieces.push({
        id: i,
        isRed: i < 6,
        isPlaced: false,
        correctPosition: i,
      });
    }
    const shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setTimeLeft(60);
    setMoves(0);
    setIsComplete(false);
    setDraggedPiece(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Indonesian Flag Puzzle</h2>
        <p className="text-red-100">
          Drag and drop the pieces to complete the Indonesian flag!
        </p>
        
        {/* Game Stats */}
        <div className="flex justify-center space-x-6 mt-6">
          <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Timer className="w-5 h-5 text-white" />
            <span className="text-white font-bold">{timeLeft}s</span>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-white font-bold">Moves: {moves}</span>
          </div>
          <button
            onClick={resetPuzzle}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-white" />
            <span className="text-white">Reset</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Puzzle Board */}
        <div className="relative">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Flag Board</h3>
          <div className="grid grid-cols-6 gap-1 w-72 h-48 border-4 border-white rounded-lg overflow-hidden bg-gray-300">
            {Array.from({ length: 12 }).map((_, index) => {
              const placedPiece = pieces.find(p => p.correctPosition === index && p.isPlaced);
              return (
                <div
                  key={index}
                  className={`aspect-square border border-gray-400 flex items-center justify-center transition-all duration-300 ${
                    index < 6 ? 'bg-red-600' : 'bg-white'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  style={{
                    opacity: placedPiece ? 1 : 0.3,
                  }}
                >
                  {placedPiece && isComplete && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Pieces */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Puzzle Pieces</h3>
          <div className="grid grid-cols-4 gap-2 w-72">
            {pieces
              .filter(piece => !piece.isPlaced)
              .map((piece) => (
                <div
                  key={piece.id}
                  draggable
                  onDragStart={() => handleDragStart(piece.id)}
                  className={`w-16 h-12 border-2 border-white rounded cursor-grab active:cursor-grabbing transition-transform hover:scale-105 ${
                    piece.isRed ? 'bg-red-600' : 'bg-white'
                  } ${draggedPiece === piece.id ? 'opacity-50' : ''}`}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {isComplete && (
        <div className="mt-8 text-center">
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-500 rounded-2xl p-8 inline-block">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Selamat! (Congratulations!)</h3>
            <p className="text-green-100">
              You completed the Indonesian flag puzzle in {moves} moves with {timeLeft} seconds remaining!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlagPuzzle;