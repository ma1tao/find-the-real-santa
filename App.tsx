
import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import { STORAGE_KEY } from './constants';
import StartScreen from './components/StartScreen';
import GameGrid from './components/GameGrid';
import GameOver from './components/GameOver';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const startGame = () => {
    setLevel(1);
    setGameState(GameState.PLAYING);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
  };

  const endGame = () => {
    if (level > highScore) {
      setHighScore(level);
      localStorage.setItem(STORAGE_KEY, level.toString());
    }
    setGameState(GameState.GAMEOVER);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white relative z-20">
      <MusicPlayer />
      
      {gameState === GameState.START && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}
      
      {gameState === GameState.PLAYING && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="mb-6 text-center animate-bounce-slow">
            <h1 className="text-5xl md:text-7xl font-bold mb-2 text-red-500 drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]">
              第 {level} 关
            </h1>
            <p className="text-2xl text-green-400 font-bold tracking-widest">
              找出真正的圣诞老人！
            </p>
          </div>
          
          <GameGrid 
            level={level} 
            onCorrect={nextLevel} 
            onWrong={endGame} 
          />

          <div className="mt-8 flex gap-12 text-2xl bg-black/40 px-8 py-3 rounded-full backdrop-blur-sm border border-white/10">
             <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">当前关卡</span>
                <span className="font-bold text-white">{level}</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">最高纪录</span>
                <span className="font-bold text-yellow-400">{highScore}</span>
             </div>
          </div>
        </div>
      )}

      {gameState === GameState.GAMEOVER && (
        <GameOver 
          score={level} 
          highScore={highScore} 
          onRestart={startGame} 
        />
      )}
    </div>
  );
};

export default App;
