
import React from 'react';
import { SETTINGS } from '../constants';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="text-center bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)] animate-fade-in max-w-md w-full">
      <div className="flex justify-center mb-6 relative">
        <div className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-lg rotate-12 text-sm font-bold shadow-lg">
          Merry Christmas!
        </div>
        <img 
          src={SETTINGS.santaImg} 
          alt="圣诞老人" 
          className="w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover transform hover:rotate-6 transition-transform"
        />
      </div>
      <h1 className="text-6xl font-black mb-4 text-red-500 tracking-tighter">寻找圣诞老人</h1>
      <p className="text-xl mb-8 text-gray-200 leading-relaxed">
        你能从众多的<span className="text-red-400 font-bold">鳌拜</span>中<br/>
        分辨出真正的<span className="text-green-400 font-bold">圣诞老人</span>吗？
      </p>
      
      {highScore > 0 && (
        <div className="mb-8 p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/30">
          <p className="text-yellow-400 font-bold text-lg">历史最高纪录：第 {highScore} 关</p>
        </div>
      )}

      <button 
        onClick={onStart}
        className="group relative w-full py-5 bg-red-600 hover:bg-red-700 text-white text-3xl font-black rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_0_rgb(153,27,27)] hover:shadow-[0_5px_0_rgb(153,27,27)] active:translate-y-1 mb-8"
      >
        立即挑战
      </button>

      <div className="flex items-center justify-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
        <div className="text-center">
            <img src={SETTINGS.santaImg} className="w-12 h-12 rounded-full mx-auto border-2 border-green-500 mb-1" />
            <span className="text-xs text-green-400 font-bold">圣诞老人</span>
        </div>
        <span className="text-gray-500">VS</span>
        <div className="text-center">
            <img src={SETTINGS.aobaiImg} className="w-12 h-12 rounded-full mx-auto border-2 border-red-500 mb-1" />
            <span className="text-xs text-red-400 font-bold">鳌拜 (干扰项)</span>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
