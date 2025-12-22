
import React, { useMemo, useState } from 'react';
import { SETTINGS } from '../constants';

interface GameGridProps {
  level: number;
  onCorrect: () => void;
  onWrong: () => void;
}

const GameGrid: React.FC<GameGridProps> = ({ level, onCorrect, onWrong }) => {
  const gridSize = level + 1;
  const totalCells = gridSize * gridSize;
  const [feedback, setFeedback] = useState<{ x: number, y: number, text: string } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // 确保图片路径正确
  const santaImgPath = SETTINGS.santaImg;
  const aobaiImgPath = SETTINGS.aobaiImg;

  const santaIndex = useMemo(() => {
    const idx = Math.floor(Math.random() * totalCells);
    console.log(`[DEBUG] Level: ${level}, Grid: ${gridSize}x${gridSize}, Santa is at index: ${idx} (Row: ${Math.floor(idx / gridSize) + 1}, Col: ${idx % gridSize + 1})`);
    return idx;
  }, [level, totalCells, gridSize]);

  const playSound = (type: 'correct' | 'wrong') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'correct') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(110, audioCtx.currentTime); // A2
        oscillator.frequency.linearRampToValueAtTime(55, audioCtx.currentTime + 0.2); // A1
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio Context blocked by browser policy");
    }
  };

  const handleClick = (idx: number, e: React.MouseEvent) => {
    if (idx === santaIndex) {
      playSound('correct');
      const messages = ['好耶！🎅', '找到了！🎄', '圣诞快乐！✨', '你是天才！🎁'];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setFeedback({ x: e.clientX, y: e.clientY, text: randomMsg });
      
      setTimeout(() => {
        setFeedback(null);
        onCorrect();
      }, 500);
    } else {
      playSound('wrong');
      setIsShaking(true);
      
      const overlay = document.getElementById('global-overlay');
      if (overlay) {
        overlay.classList.add('animate-flash-red');
        setTimeout(() => overlay.classList.remove('animate-flash-red'), 400);
      }

      setTimeout(() => {
        setIsShaking(false);
        onWrong();
      }, 500);
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
    gap: gridSize > 6 ? '4px' : '8px',
  };

  const tileSize = useMemo(() => {
    if (gridSize <= 3) return 'w-32 h-32 md:w-48 md:h-48';
    if (gridSize <= 5) return 'w-20 h-20 md:w-32 md:h-32';
    if (gridSize <= 8) return 'w-12 h-12 md:w-20 md:h-20';
    return 'w-8 h-8 md:w-12 md:h-12';
  }, [gridSize]);

  return (
    <div className="relative">
      {feedback && (
        <div 
          className="feedback-pop text-3xl md:text-5xl pointer-events-none"
          style={{ left: feedback.x - 60, top: feedback.y - 60 }}
        >
          {feedback.text}
        </div>
      )}
      
      <div 
        className={`bg-white/10 p-6 rounded-[2rem] backdrop-blur-md border-4 border-white/20 shadow-2xl transition-transform ${isShaking ? 'animate-shake' : ''}`}
        style={gridStyle}
      >
        {Array.from({ length: totalCells }).map((_, idx) => (
          <button
            key={`${level}-${idx}`}
            onClick={(e) => handleClick(idx, e)}
            className={`${tileSize} rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-90 bg-gray-900 border-2 border-white/10 hover:border-yellow-400 shadow-lg relative group`}
          >
            <img 
              src={idx === santaIndex ? santaImgPath : aobaiImgPath}
              alt="人物"
              className="w-full h-full object-contain bg-gray-900"
              onError={(e) => {
                // 如果图片加载失败的后备方案 (显示 Emoji)
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as any).parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl bg-gray-800">${idx === santaIndex ? '🎅' : '👨🏻‍🦳'}</div>`;
              }}
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
