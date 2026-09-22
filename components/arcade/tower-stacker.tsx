'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { sound } from './sound-fx';
import { RotateCcw, Play, Trophy, Sparkles, Zap, Layers } from 'lucide-react';

interface TowerStackerProps {
  onBackToMenu: () => void;
}

interface PlacedBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

interface FallingDebris {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  alpha: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
}

const TECH_LAYERS = [
  { label: 'HTML5', color: '#f97316' },
  { label: 'CSS3', color: '#3b82f6' },
  { label: 'JavaScript', color: '#eab308' },
  { label: 'TypeScript', color: '#0ea5e9' },
  { label: 'React', color: '#06b6d4' },
  { label: 'Next.js', color: '#f8fafc' },
  { label: 'TailwindCSS', color: '#14b8a6' },
  { label: 'Node.js', color: '#22c55e' },
  { label: 'PostgreSQL', color: '#6366f1' },
  { label: 'Prisma ORM', color: '#8b5cf6' },
  { label: 'Redis Cache', color: '#ef4444' },
  { label: 'Docker', color: '#38bdf8' },
  { label: 'Kubernetes', color: '#3b82f6' },
  { label: 'GraphQL API', color: '#ec4899' },
  { label: 'CI/CD Pipeline', color: '#f59e0b' },
  { label: 'AWS Cloud', color: '#f97316' },
  { label: 'Linux Kernel', color: '#eab308' },
  { label: 'System Design', color: '#a855f7' },
  { label: 'Senior Unicorn 🦄', color: '#d946ef' },
];

export function TowerStacker({ onBackToMenu }: TowerStackerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const highScoreRef = useRef(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  const engine = useRef<{
    blocks: PlacedBlock[];
    debris: FallingDebris[];
    sparks: Spark[];
    currentX: number;
    currentWidth: number;
    currentSpeed: number;
    currentDirection: number;
    score: number;
    combo: number;
    cameraY: number;
    targetCameraY: number;
    animationId: number;
  }>({
    blocks: [],
    debris: [],
    sparks: [],
    currentX: 0,
    currentWidth: 220,
    currentSpeed: 3.2,
    currentDirection: 1,
    score: 0,
    combo: 0,
    cameraY: 0,
    targetCameraY: 0,
    animationId: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('arcade_high_tower_stacker');
    if (saved) {
      const val = parseInt(saved, 10);
      setHighScore(val);
      highScoreRef.current = val;
    }
  }, []);

  const startGame = () => {
    const baseWidth = 220;
    const baseHeight = 28;
    const startY = 460;
    const startX = (500 - baseWidth) / 2;

    const baseBlock: PlacedBlock = {
      x: startX,
      y: startY,
      width: baseWidth,
      height: baseHeight,
      color: TECH_LAYERS[0].color,
      label: TECH_LAYERS[0].label,
    };

    engine.current.blocks = [baseBlock];
    engine.current.debris = [];
    engine.current.sparks = [];
    engine.current.currentWidth = baseWidth;
    engine.current.currentX = 0;
    engine.current.currentSpeed = 3.2;
    engine.current.currentDirection = 1;
    engine.current.score = 0;
    engine.current.combo = 0;
    engine.current.cameraY = 0;
    engine.current.targetCameraY = 0;

    setScore(0);
    setCombo(0);
    setGameState('playing');
    sound.playDrop(0);
  };

  const spawnSparks = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      engine.current.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        life: 20 + Math.random() * 10,
      });
    }
  };

  const dropBlock = useCallback(() => {
    if (gameState === 'idle') {
      startGame();
      return;
    }
    if (gameState !== 'playing') return;

    const state = engine.current;
    const prev = state.blocks[state.blocks.length - 1];
    const blockHeight = 28;
    const currentY = prev.y - blockHeight;

    const currLeft = state.currentX;
    const currRight = state.currentX + state.currentWidth;
    const prevLeft = prev.x;
    const prevRight = prev.x + prev.width;

    const diff = currLeft - prevLeft;

    // 1. Check for PERFECT snap (within 3 pixels tolerance)
    if (Math.abs(diff) <= 3) {
      state.currentX = prev.x; // Perfect align!
      state.combo++;
      setCombo(state.combo);

      // Rewarding combo width expand
      if (state.combo >= 4 && state.currentWidth < 220) {
        state.currentWidth = Math.min(state.currentWidth + 8, 220);
      }

      const layerIdx = (state.score + 1) % TECH_LAYERS.length;
      const layer = TECH_LAYERS[layerIdx];

      state.blocks.push({
        x: state.currentX,
        y: currentY,
        width: state.currentWidth,
        height: blockHeight,
        color: layer.color,
        label: layer.label,
      });

      state.score++;
      setScore(state.score);

      if (state.score > highScoreRef.current) {
        highScoreRef.current = state.score;
        setHighScore(state.score);
        localStorage.setItem('arcade_high_tower_stacker', String(state.score));
      }

      spawnSparks(state.currentX + state.currentWidth / 2, currentY + blockHeight / 2, '#fbbf24', 20);
      sound.playDrop(state.combo);

      // Adjust camera target
      if (state.blocks.length > 8) {
        state.targetCameraY = (state.blocks.length - 8) * blockHeight;
      }

      // Next block
      state.currentX = state.currentDirection === 1 ? -state.currentWidth : 500;
      state.currentSpeed = Math.min(3.2 + state.score * 0.08, 6.8);
      return;
    }

    // 2. Check for Overlap (Slice)
    const overlap = Math.min(currRight, prevRight) - Math.max(currLeft, prevLeft);

    if (overlap > 0) {
      // Successful slice!
      state.combo = 0;
      setCombo(0);

      const newWidth = overlap;
      const newX = Math.max(currLeft, prevLeft);

      // Debris slice calculation
      const debrisWidth = state.currentWidth - newWidth;
      const debrisX = diff > 0 ? newX + newWidth : currLeft;

      state.debris.push({
        x: debrisX,
        y: currentY,
        width: debrisWidth,
        height: blockHeight,
        color: prev.color,
        vx: diff > 0 ? 2 : -2,
        vy: -1,
        rot: 0,
        vRot: (diff > 0 ? 1 : -1) * 0.08,
        alpha: 1,
      });

      state.currentWidth = newWidth;
      state.currentX = newX;

      const layerIdx = (state.score + 1) % TECH_LAYERS.length;
      const layer = TECH_LAYERS[layerIdx];

      state.blocks.push({
        x: newX,
        y: currentY,
        width: newWidth,
        height: blockHeight,
        color: layer.color,
        label: layer.label,
      });

      state.score++;
      setScore(state.score);

      if (state.score > highScoreRef.current) {
        highScoreRef.current = state.score;
        setHighScore(state.score);
        localStorage.setItem('arcade_high_tower_stacker', String(state.score));
      }

      spawnSparks(newX + (diff > 0 ? newWidth : 0), currentY + blockHeight / 2, '#38bdf8', 10);
      sound.playSlice();

      // Camera target
      if (state.blocks.length > 8) {
        state.targetCameraY = (state.blocks.length - 8) * blockHeight;
      }

      // Next block setup
      state.currentX = state.currentDirection === 1 ? -state.currentWidth : 500;
      state.currentSpeed = Math.min(3.2 + state.score * 0.08, 6.8);
    } else {
      // 3. Complete Miss -> Block falls into void!
      state.debris.push({
        x: state.currentX,
        y: currentY,
        width: state.currentWidth,
        height: blockHeight,
        color: '#ef4444',
        vx: state.currentDirection * state.currentSpeed,
        vy: 1,
        rot: 0,
        vRot: state.currentDirection * 0.08,
        alpha: 1,
      });

      setGameState('gameover');
      sound.playGameOver();
    }
  }, [gameState]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        dropBlock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dropBlock]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const width = canvas.width;
    const height = canvas.height;

    const loop = () => {
      if (!isRunning) return;

      const state = engine.current;

      // 1. Move Active Block
      state.currentX += state.currentDirection * state.currentSpeed;
      if (state.currentX + state.currentWidth >= width + 40) {
        state.currentDirection = -1;
      } else if (state.currentX <= -40) {
        state.currentDirection = 1;
      }

      // 2. Smooth Camera Interpolation
      state.cameraY += (state.targetCameraY - state.cameraY) * 0.08;

      // 3. Update Falling Debris
      state.debris.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.35; // gravity
        d.rot += d.vRot;
        d.alpha -= 0.02;
      });
      state.debris = state.debris.filter((d) => d.alpha > 0 && d.y < height + 200);

      // 4. Update Sparks
      state.sparks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.04;
        s.life--;
      });
      state.sparks = state.sparks.filter((s) => s.life > 0 && s.alpha > 0);

      // --- RENDER ---
      // Sky backdrop gradient that shifts color with height
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (state.score < 15) {
        skyGrad.addColorStop(0, '#090d16');
        skyGrad.addColorStop(1, '#0e1628');
      } else if (state.score < 30) {
        skyGrad.addColorStop(0, '#111827');
        skyGrad.addColorStop(1, '#1e1b4b');
      } else {
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(1, '#3b0764');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let y = 0; y < height; y += 28) {
        ctx.fillRect(0, (y + state.cameraY) % height, width, 1);
      }

      ctx.save();
      ctx.translate(0, state.cameraY);

      // Draw Placed Tower Blocks
      const blockHeight = 28;
      state.blocks.forEach((b, idx) => {
        // Block Body
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = idx === state.blocks.length - 1 ? 10 : 3;

        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        ctx.fill();

        // 3D Top bevel highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(b.x + 2, b.y + 2, b.width - 4, 3);

        // Tech Label text
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        if (b.width > 40) {
          ctx.fillText(b.label, b.x + b.width / 2, b.y + 18);
        }
      });

      // Draw Falling Debris
      state.debris.forEach((d) => {
        ctx.save();
        ctx.globalAlpha = Math.max(d.alpha, 0);
        ctx.translate(d.x + d.width / 2, d.y + d.height / 2);
        ctx.rotate(d.rot);
        ctx.fillStyle = d.color;
        ctx.fillRect(-d.width / 2, -d.height / 2, d.width, d.height);
        ctx.restore();
      });

      // Draw Sparks
      state.sparks.forEach((s) => {
        ctx.save();
        ctx.globalAlpha = Math.max(s.alpha, 0);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Active Moving Block
      if (state.blocks.length > 0) {
        const prev = state.blocks[state.blocks.length - 1];
        const nextY = prev.y - blockHeight;
        const layerIdx = state.score % TECH_LAYERS.length;
        const layerColor = TECH_LAYERS[layerIdx].color;

        ctx.fillStyle = layerColor;
        ctx.shadowColor = layerColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.roundRect(state.currentX, nextY, state.currentWidth, blockHeight, 4);
        ctx.fill();

        // Top highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(state.currentX + 2, nextY + 2, state.currentWidth - 4, 3);

        // Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        if (state.currentWidth > 40) {
          ctx.fillText(TECH_LAYERS[layerIdx].label, state.currentX + state.currentWidth / 2, nextY + 18);
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    let animId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [gameState]);

  const getArchitectTitle = (floorCount: number) => {
    if (floorCount >= 50) return { title: 'Cloud Skyscraper Deity 🦄', color: 'text-purple-400' };
    if (floorCount >= 30) return { title: 'Principal System Architect 🚀', color: 'text-amber-400' };
    if (floorCount >= 18) return { title: 'Full-Stack Engineer ⚡', color: 'text-sky-400' };
    if (floorCount >= 8) return { title: 'Junior Stack Builder 🌱', color: 'text-emerald-400' };
    return { title: 'Code Apprentice 🔨', color: 'text-neutral-400' };
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Top Game Bar */}
      <div className="w-full max-w-[500px] flex items-center justify-between px-4 py-2 bg-neutral-900 border-x border-t border-neutral-800 rounded-t-xl text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            FLOORS: <strong className="text-amber-400 text-sm font-bold">{score}</strong>
          </span>
          <span className="text-neutral-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            RECORD: <strong className="text-amber-400">{highScore}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {combo > 1 && (
            <span className="text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              {combo}x PERFECT!
            </span>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div
        onClick={dropBlock}
        className="relative w-full max-w-[500px] aspect-[500/520] bg-[#090d16] border border-neutral-800 rounded-b-xl overflow-hidden shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={520}
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
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3">
              <span className="text-3xl">🏗️</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wider uppercase font-mono">
              Tower Stacker
            </h2>
            <p className="text-neutral-300 text-xs mt-1 max-w-sm">
              Stack your tech architecture into the stratosphere! Drop moving blocks with precision—any overhang gets sliced off.
            </p>

            <div className="mt-4 p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-400 max-w-xs space-y-1">
              <p>🎯 <strong>Precision Snap:</strong> Land within 3px for PERFECT combo notes</p>
              <p>⚡ <strong>Combo Reward:</strong> 4x perfect streaks expand block width</p>
              <p>🖱️ <strong>Controls:</strong> Press [Space] or click/tap anywhere</p>
            </div>

            <button
              onClick={startGame}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-mono font-bold text-sm hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              START BUILDING
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95"
          >
            <div className="text-4xl mb-2">🏢💥</div>
            <h2 className="text-2xl font-bold text-rose-500 uppercase tracking-widest font-mono">
              Tower Collapsed!
            </h2>
            <p className="text-neutral-300 text-xs mt-1">Block missed the foundation and fell into the void.</p>

            <div className="my-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs flex items-center gap-6">
              <div>
                <div className="text-neutral-400 text-[10px]">TOWER HEIGHT</div>
                <div className="text-2xl font-bold text-amber-400">{score} Floors</div>
              </div>
              <div className="h-8 w-px bg-neutral-800" />
              <div>
                <div className="text-neutral-400 text-[10px]">ALL-TIME RECORD</div>
                <div className="text-2xl font-bold text-emerald-400">{highScore} Floors</div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-1.5 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-neutral-400">Architect Rank:</span>
              <span className={`font-bold ${getArchitectTitle(score).color}`}>
                {getArchitectTitle(score).title}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 text-white font-mono font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                BUILD AGAIN
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

      {/* Big Action Button for Mobile/Touch */}
      <div className="w-full max-w-[500px] mt-3">
        <button
          onClick={dropBlock}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 active:from-amber-500 active:to-orange-500 border border-amber-500 flex items-center justify-center gap-2 text-xs font-mono font-bold text-white shadow-md select-none touch-manipulation"
        >
          <span>DROP & STACK LAYER</span>
        </button>
      </div>
    </div>
  );
}
