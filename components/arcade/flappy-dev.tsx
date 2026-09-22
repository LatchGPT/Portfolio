'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from './sound-fx';
import { RotateCcw, Play, Trophy, Medal } from 'lucide-react';

interface FlappyDevProps {
  onBackToMenu: () => void;
}

interface ServerPipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
}

export function FlappyDev({ onBackToMenu }: FlappyDevProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  const engine = useRef<{
    birdY: number;
    velocity: number;
    pipes: ServerPipe[];
    animationId: number;
    score: number;
    lastPipeSpawn: number;
  }>({
    birdY: 200,
    velocity: 0,
    pipes: [],
    animationId: 0,
    score: 0,
    lastPipeSpawn: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('arcade_high_flappy_dev');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const flap = useCallback(() => {
    if (gameState === 'idle') {
      startGame();
      return;
    }
    if (gameState === 'playing') {
      engine.current.velocity = -5.6;
      sound.playJump();
    }
  }, [gameState]);

  const startGame = () => {
    engine.current.birdY = 200;
    engine.current.velocity = -4.5;
    engine.current.pipes = [];
    engine.current.score = 0;
    engine.current.lastPipeSpawn = 0;

    setScore(0);
    setGameState('playing');
    sound.playJump();
  };

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap]);

  // Main Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const width = canvas.width;
    const height = canvas.height;
    const gravity = 0.28;
    const gap = 128;
    const pipeWidth = 52;
    const pipeSpeed = 2.2;
    const birdX = 90;
    const birdRadius = 14;

    const loop = (timestamp: number) => {
      if (!isRunning) return;

      const state = engine.current;

      // 1. Physics: update bird
      state.velocity += gravity;
      state.birdY += state.velocity;

      // 2. Spawn Pipes
      if (timestamp - state.lastPipeSpawn > 1750) {
        const minTop = 60;
        const maxTop = height - gap - 80;
        const topHeight = Math.floor(minTop + Math.random() * (maxTop - minTop));
        const bottomHeight = height - topHeight - gap;

        state.pipes.push({
          x: width + 10,
          topHeight,
          bottomHeight,
          width: pipeWidth,
          passed: false,
        });
        state.lastPipeSpawn = timestamp;
      }

      // 3. Move Pipes & Check score
      state.pipes.forEach((p) => {
        p.x -= pipeSpeed;

        if (!p.passed && p.x + p.width < birdX) {
          p.passed = true;
          state.score += 1;
          setScore(state.score);
          sound.playScore();

          if (state.score > highScore) {
            setHighScore(state.score);
            localStorage.setItem('arcade_high_flappy_dev', String(state.score));
          }
        }
      });

      // Remove offscreen pipes
      state.pipes = state.pipes.filter((p) => p.x + p.width > -10);

      // 4. Collision Detection
      let collided = false;

      // Ground or Ceiling
      if (state.birdY - birdRadius <= 0 || state.birdY + birdRadius >= height - 20) {
        collided = true;
      }

      // Server Pipes Collision
      for (const p of state.pipes) {
        if (birdX + birdRadius > p.x && birdX - birdRadius < p.x + p.width) {
          // Inside horizontal span of pipe
          if (
            state.birdY - birdRadius < p.topHeight ||
            state.birdY + birdRadius > height - p.bottomHeight
          ) {
            collided = true;
            break;
          }
        }
      }

      if (collided) {
        setGameState('gameover');
        sound.playHit();
        sound.playGameOver();
        return;
      }

      // --- RENDER ---
      // Sky/cloud dark cyber gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#060d1b');
      skyGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Background cloud servers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(40, 100, 120, 160);
      ctx.fillRect(260, 60, 140, 220);
      ctx.fillRect(480, 120, 100, 180);

      // Draw Server Rack Pipes
      state.pipes.forEach((p) => {
        // Top Server Rack
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;

        // Top rack body
        ctx.fillRect(p.x, 0, p.width, p.topHeight);
        ctx.strokeRect(p.x, 0, p.width, p.topHeight);

        // Rack header cap
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(p.x - 3, p.topHeight - 14, p.width + 6, 14);
        ctx.strokeRect(p.x - 3, p.topHeight - 14, p.width + 6, 14);

        // Blinking server LEDs (top)
        ctx.fillStyle = '#10b981';
        ctx.fillRect(p.x + 8, p.topHeight - 9, 4, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p.x + 18, p.topHeight - 9, 4, 4);

        // Bottom Server Rack
        ctx.fillStyle = '#1e293b';
        const bottomY = height - p.bottomHeight;
        ctx.fillRect(p.x, bottomY, p.width, p.bottomHeight);
        ctx.strokeRect(p.x, bottomY, p.width, p.bottomHeight);

        // Bottom rack header cap
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(p.x - 3, bottomY, p.width + 6, 14);
        ctx.strokeRect(p.x - 3, bottomY, p.width + 6, 14);

        // Server LEDs (bottom)
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(p.x + 8, bottomY + 5, 4, 4);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(p.x + 18, bottomY + 5, 4, 4);
      });

      // Ground (floor)
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, height - 20, width, 20);
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, height - 20);
      ctx.lineTo(width, height - 20);
      ctx.stroke();

      // Draw Flappy Dev Mascot
      ctx.save();
      ctx.translate(birdX, state.birdY);

      // Rotation based on velocity
      const angle = Math.min(Math.max(state.velocity * 0.08, -0.5), 0.7);
      ctx.rotate(angle);

      // Mascot Body (Glowing Sky Sphere)
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, birdRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Dev Glasses (Cool nerd glasses)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(1, -5, 8, 6);
      ctx.fillRect(8, -5, 4, 6);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(3, -3, 4, 2);

      // Wing (flaps with velocity)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(-6, 2, 7, 4, state.velocity * 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Antenna / Headphones
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, -birdRadius - 2, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    let animId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [gameState, highScore]);

  const getRank = (scoreVal: number) => {
    if (scoreVal >= 40) return { title: 'Principal Architect 🦄', color: 'text-purple-400' };
    if (scoreVal >= 25) return { title: 'Senior Fullstack 🚀', color: 'text-amber-400' };
    if (scoreVal >= 10) return { title: 'Mid-Level Engineer ⚡', color: 'text-sky-400' };
    return { title: 'Junior Developer 🌱', color: 'text-emerald-400' };
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Top Game Bar */}
      <div className="w-full max-w-[540px] flex items-center justify-between px-4 py-2 bg-neutral-900 border-x border-t border-neutral-800 rounded-t-xl text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400">
            SCORE: <strong className="text-sky-400 text-sm font-bold">{score}</strong>
          </span>
          <span className="text-neutral-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            HI: <strong className="text-amber-400">{highScore}</strong>
          </span>
        </div>

        <div className="text-neutral-400 text-[11px]">
          TAP / SPACE to Flap
        </div>
      </div>

      {/* Canvas Area with Click Handler */}
      <div
        onClick={flap}
        className="relative w-full max-w-[540px] aspect-[540/420] bg-[#060d1b] border border-neutral-800 rounded-b-xl overflow-hidden shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <canvas
          ref={canvasRef}
          width={540}
          height={420}
          className="w-full h-full block touch-none"
        />

        {/* Start / Idle Screen */}
        {gameState === 'idle' && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              startGame();
            }}
            className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 mb-3">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wider uppercase font-mono">
              Flappy Dev
            </h2>
            <p className="text-neutral-300 text-xs mt-1 max-w-sm">
              Keep the developer flying! Navigate safely through cloud servers and production pipelines without crashing.
            </p>

            <div className="mt-4 p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-400 max-w-xs space-y-1">
              <p>⌨️ <strong>Keyboard:</strong> Press [Space] or [↑] to flap</p>
              <p>🖱️ <strong>Mouse/Touch:</strong> Click or tap screen anytime</p>
            </div>

            <button
              onClick={startGame}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-mono font-bold text-sm hover:from-sky-400 hover:to-indigo-400 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              FLAP TO START
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95"
          >
            <div className="text-4xl mb-2">💥</div>
            <h2 className="text-2xl font-bold text-rose-500 uppercase tracking-widest font-mono">
              Pipeline Failed!
            </h2>
            <p className="text-neutral-300 text-xs mt-1">Crashed into a cloud server rack.</p>

            <div className="my-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs flex items-center gap-6">
              <div>
                <div className="text-neutral-400 text-[10px]">SERVERS PASSED</div>
                <div className="text-xl font-bold text-sky-400">{score}</div>
              </div>
              <div className="h-8 w-px bg-neutral-800" />
              <div>
                <div className="text-neutral-400 text-[10px]">RECORD</div>
                <div className="text-xl font-bold text-amber-400">{highScore}</div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-1.5 text-xs font-mono">
              <Medal className="w-4 h-4 text-amber-400" />
              <span className="text-neutral-400">Dev Rank:</span>
              <span className={`font-bold ${getRank(score).color}`}>{getRank(score).title}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 text-white font-mono font-bold text-xs hover:bg-sky-400 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RETRY
              </button>
              <button
                onClick={onBackToMenu}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 font-mono text-xs hover:bg-neutral-700 transition-all"
              >
                ARCADE MENU
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Big Mobile Flap Button */}
      <div className="w-full max-w-[540px] mt-3">
        <button
          onClick={flap}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 active:from-sky-500 active:to-indigo-500 border border-sky-500 flex items-center justify-center gap-2 text-xs font-mono font-bold text-white shadow-md select-none touch-manipulation"
        >
          <span>FLAP / JUMP</span>
        </button>
      </div>
    </div>
  );
}
