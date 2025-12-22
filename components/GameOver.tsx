
import React from 'react';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  const isNewRecord = score >= highScore && score > 0;

  return (
    <div className="text-center bg-gray-950/90 backdrop-blur-2xl p-12 rounded-[3rem] border-4 border-red-600 shadow-[0_0_80px_rgba(239,68,68,0.4)] max-w-md w-full animate-bounce-in">
      <div className="text-9xl mb-6 filter drop-shadow-xl">🎅❄️</div>
      <h2 className="text-5xl font-black mb-4 text-white">哎呀！认错啦！</h2>
      <p className="text-gray-400 text-xl mb-10 leading-relaxed">金钩拜，金钩拜，<br/>金钩鳌了拜！</p>
      
      <div className="space-y-4 mb-12">
        <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10">
          <span className="text-gray-400 font-bold">本次得分</span>
          <span className="text-4xl font-black text-red-500">第 {score} 关</span>
        </div>
        <div className="flex justify-between items-center p-5 bg-yellow-500/5 rounded-2xl border border-yellow-500/30">
          <span className="text-gray-400 font-bold">最高关卡</span>
          <span className="text-4xl font-black text-yellow-500">第 {highScore} 关</span>
        </div>
        {isNewRecord && (
          <div className="text-yellow-400 text-2xl font-black animate-pulse tracking-widest mt-4">
            ✨ 新的纪录诞生了！ ✨
          </div>
        )}
      </div>

      <button 
        onClick={onRestart}
        className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-3xl font-black rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_0_rgb(21,128,61)] hover:shadow-[0_5px_0_rgb(21,128,61)] active:translate-y-1"
      >
        不服！再来一局
      </button>
    </div>
  );
};

export default GameOver;
